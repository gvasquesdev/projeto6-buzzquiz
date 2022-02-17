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
  console.log(quizzesServidor);

  const serverQuizzes = document.querySelector(".server-quizzes");
  serverQuizzes.innerHTML = "";

  quizzesServidor.forEach((quizz) => {
    let { id: id, title: titulo, image: imagem } = quizz;

    let quizzRenderizado = `
    <div id="${id}" class="quizz" onclick="responderQuizz(this.id)">
    <img src="${imagem}">
    <h3>${titulo}</h3>
    </div>
    `;

    serverQuizzes.innerHTML += quizzRenderizado;
  });
}
