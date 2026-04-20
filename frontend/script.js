// LOGIN
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

    // salva usuário completo
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    window.location.href = "produtos.html";
  } else {
    alert(dados.mensagem);
  }
}


function irPagamento(produto_id) {
  localStorage.setItem("produtoCompra", produto_id);
  window.location.href = "pagamento.html";
}


// NAVEGAÇÃO


function irCadastro() {
  window.location.href = "cadastro.html";
}

function irLogin() {
  window.location.href = "login.html";
}


// CADASTRO (AGORA COM AUTO LOGIN)
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

    // login automático (não precisa voltar pro login)
    localStorage.setItem("usuario", JSON.stringify({
      nome,
      email,
      tipo: "CLIENTE"
    }));localStorage.setItem("usuario", JSON.stringify({ email }));

    window.location.href = "produtos.html";
  } else {
    alert("Erro ao cadastrar");
  }
}

function mostrarMetodo() {
  const metodo = document.getElementById("metodo").value;
  const area = document.getElementById("areaPagamento");

  if (metodo === "PIX") {
    area.innerHTML = `
      <p>Escaneie o QR Code:</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-FAKE">
      <p>Após pagar, clique em confirmar.</p>
    `;
  } else if (metodo === "CARTAO") {
    area.innerHTML = `
      <p>Pagamento com cartão (simulado)</p>
      <input placeholder="Número do cartão"><br>
      <input placeholder="Nome"><br>
      <input placeholder="CVV"><br>
    `;
  } else {
    area.innerHTML = "";
  }
}

async function confirmarPagamento() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const produto_id = localStorage.getItem("produtoCompra");
  const metodo = document.getElementById("metodo").value;

  if (!metodo) {
    alert("Escolha um método de pagamento");
    return;
  }

  // cria pedido
  const resposta = await fetch("http://localhost:3000/comprar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: usuario.email,
      produto_id
    })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert("Erro ao criar pedido");
    return;
  }

  const pedido_id = dados.pedido_id;

  // atualiza status
  await fetch(`http://localhost:3000/pedido/${pedido_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "APROVADO",
      metodo_pagamento: metodo
    })
  });

  alert("Pagamento aprovado!");
  window.location.href = "endereco.html";
}

function mostrarMetodo() {
  const metodo = document.getElementById("metodo").value;
  const area = document.getElementById("areaPagamento");

  if (metodo === "PIX") {
    area.innerHTML = `
      <p>Escaneie o QR Code:</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-FAKE">
      <p>Após pagar, clique em confirmar.</p>
    `;
  } else if (metodo === "CARTAO") {
    area.innerHTML = `
      <p>Pagamento com cartão (simulado)</p>
      <input placeholder="Número do cartão">
      <input placeholder="Nome no cartão">
      <input placeholder="CVV">
    `;
  } else {
    area.innerHTML = "";
  }
}

function mostrarUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    document.getElementById("usuario-logado").innerText =
      `${usuario.nome} (${usuario.tipo})`;
  }
}

window.onload = mostrarUsuario;



function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}