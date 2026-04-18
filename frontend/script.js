// 🔐 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  console.log("Enviando:", email, senha);

  const resposta = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  console.log("Status:", resposta.status);

  const dados = await resposta.json();
  console.log("Resposta:", dados);

  if (resposta.ok) {
    alert("Login OK");

    // 🔥 salva usuário completo
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    window.location.href = "produtos.html";
  } else {
    alert(dados.mensagem);
  }
}


// 🛒 ADICIONAR AO CARRINHO
async function adicionarCarrinho(produto_id) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // verifica se já existe
  const item = carrinho.find(p => p.id === produto_id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({
      id: produto_id,
      quantidade: 1
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert("Produto adicionado ao carrinho");
}


// 🔗 NAVEGAÇÃO


function irCadastro() {
  window.location.href = "cadastro.html";
}

function irLogin() {
  window.location.href = "login.html";
}


// 🧾 CADASTRO (AGORA COM AUTO LOGIN)
async function cadastrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const resposta = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Conta criada com sucesso!");

    // 🔥 login automático (não precisa voltar pro login)
    localStorage.setItem("usuario", JSON.stringify({ email }));

    window.location.href = "produtos.html";
  } else {
    alert("Erro ao cadastrar");
  }
}