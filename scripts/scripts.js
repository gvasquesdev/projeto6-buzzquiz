const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const screen3 = document.getElementById("screen3");
screen2.style.display = "none";
screen3.style.display = "none";

let chosenQuiz = null,
  questions = null,
  answers = [],
  levels = null,
  quizID = null,
  totalAnswers = 0,
  correctAnswers = 0;

let serverQuizzes = null,
  userQuizzes = null;

const hasUserQuizzes = document
  .querySelector(".has-user-quizzes")
  .classList.add("hidden");

verifyUserQuizzes(); // Quando o usuário criar um novo quiz, tem que rodar essa função de novo pra verificar.
getQuizzesFromServer();

// Functions

function verifyUserQuizzes() {
  if (userQuizzes != null) {
    document.querySelector(".has-user-quizzes").classList.remove("hidden");
    document.querySelector(".no-user-quizzes").classList.add("hidden");
  }
}

function getQuizzesFromServer() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
  promise.then(saveQuizzes);
  promise.catch((err) => console.log(err.response));
}

function saveQuizzes(quizzes) {
  document.querySelector(".server-quizzes").innerHTML = "";
  serverQuizzes = quizzes.data;

  serverQuizzes.forEach((quiz) => {
    renderQuiz(quiz);
  });
}

function renderQuiz(quiz) {
  const { id, title, image } = quiz;

  // const userQuizzesSection = document.querySelector(".user-quizzes");
  const serverQuizzesSection = document.querySelector(".server-quizzes");

  const newQuiz = `<div onclick="identifyQuiz(${id})" class="quiz">
  <img src="${image}">
  <p>${title}</p>
  </div>`;

  //Verificar (pelo ID) se o quizz que veio do servidor é do usuário ou de outra pessoa -> renderizar em sections diferentes.

  serverQuizzesSection.innerHTML += newQuiz;
}

function createQuiz() {
  screen1.style.display = "none";
  screen3.style.display = "block";
}

function identifyQuiz(id) {
  quizID = id;
  screen1.style.display = "none";
  screen2.style.display = "block";

  const banner = document.querySelector(".banner");
  banner.innerHTML = "";
  const questionsSection = document.querySelector(".questions");
  questionsSection.innerHTML = "";
  const endOfQuiz = document.querySelector(".end-of-quiz");
  endOfQuiz.innerHTML = "";
  endOfQuiz.style.display = "none";

  const promise = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`
  );
  promise.then(renderQuizPage);
  promise.catch((err) => console.log(err.response));
}

function renderQuizPage(quiz) {
  chosenQuiz = quiz.data;
  levels = chosenQuiz.levels;
  questions = chosenQuiz.questions;

  const banner = document.querySelector(".banner");

  banner.innerHTML = `
    <img src="${chosenQuiz.image}">
    <p>${chosenQuiz.title}</p>
  `;

  questions.forEach(renderQuestion);
}

let i = 0;
function renderQuestion(question) {
  const questionsSection = document.querySelector(".questions");

  let newQuestion = `
  <div id="${i++}" class="question">
    <div class="question-title" style="background-color: ${question.color};">
      <p>${question.title}</p>
    </div>
    <div class="answers">
    </div>
  </div>
  `;

  questionsSection.innerHTML += newQuestion;

  renderAnswers(question.answers);
}

function renderAnswers(answers) {
  const answersDiv = document.querySelector(".question:last-child > .answers");

  answers.sort(shuffle);

  answers.forEach((answer) => {
    const newAnswer = `
    <div class="answer" onclick="verifyAnswer(this)" iscorrect="${answer.isCorrectAnswer}">
      <img src="${answer.image}">
      <p>${answer.text}</p>
    </div>
    `;

    answersDiv.innerHTML += newAnswer;
  });
}

function verifyAnswer(answer) {
  totalAnswers++;
  if (answer.getAttribute("iscorrect") === "true") {
    correctAnswers++;
  }

  let currentQuestion = answer.parentNode.parentNode;
  let currentQuestionID = parseInt(currentQuestion.id);

  const nextQuestion = document.getElementById(`${currentQuestionID + 1}`);

  const allAnswers = answer.parentNode.querySelectorAll(".answer");

  allAnswers.forEach((option) => {
    option.removeAttribute("onclick");
    option.classList.add("not-selected");

    if (option.getAttribute("iscorrect") === "true") {
      option.classList.add("correct-answer");
    } else {
      option.classList.add("wrong-answer");
    }
  });

  answer.classList.add("selected");

  if (nextQuestion != null) {
    setTimeout(() => {
      nextQuestion.scrollIntoView();
    }, 2000);
  }

  if (totalAnswers == questions.length) {
    showResult();
  }
}

function showResult() {
  const endOfQuiz = document.querySelector(".end-of-quiz");
  endOfQuiz.style.display = "block";

  const percent = Math.round((correctAnswers / totalAnswers) * 100);
  let indexResult = 0;

  const values = [];
  levels.forEach((level) => {
    values.push(level.minValue);
  });

  for (let ind = 0; ind < values.length; ind++) {
    if (percent >= values[ind]) {
      indexResult = ind;
    }
  }
  const result = levels[indexResult];

  endOfQuiz.innerHTML = `
  <section class="result">
    <div class="result-title">
      <p>${percent}% de acerto: ${result.title}</p>
    </div>
    <div class="result-image">
      <img src="${result.image}">
    </div>
    <div class="result-description">
      <p>${result.text}</p>
    </div>
  </section>
  <section class="buttons">
    <button onclick="restartQuiz()" class="restart-btn">Reiniciar Quiz</button>
    <button onclick="window.location.reload()" class="home-btn">Voltar para home</button>
  </section>
  `;

  setTimeout(() => {
    const endOfQuiz = document.querySelector(".end-of-quiz");
    endOfQuiz.scrollIntoView();
  }, 2000);
}

function restartQuiz() {
  totalAnswers = 0;
  correctAnswers = 0;

  identifyQuiz(quizID);
}

function shuffle() {
  return Math.random() - 0.5;
}
