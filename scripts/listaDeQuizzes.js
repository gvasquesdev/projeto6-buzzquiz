let quizzesServidor = [];

buscarQuizzesServidor();
function buscarQuizzesServidor() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
  promise.then(renderizarQuizzes);
  promise.catch((erro) => console.log(erro));
}

function renderizarQuizzes(quizzes) {
  quizzesServidor = quizzes.data;

  const serverQuizzes = document.querySelector(".server-quizzes");
  serverQuizzes.innerHTML = "";

  quizzesServidor.forEach((quizz) => {
    let { image: imagem, title: titulo } = quizz;

    let quizzRenderizado = `
    <div class="quizz" onclick="responderQuizz()">
    <img src="${imagem}">
    <h3>${titulo}</h3>
    </div>
    `;

    serverQuizzes.innerHTML += quizzRenderizado;
  });
}
