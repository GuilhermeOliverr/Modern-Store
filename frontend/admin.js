async function cadastrarProduto() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || usuario.tipo !== "ADMIN") {
    alert("Apenas admin pode cadastrar");
    return;
  }

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const estoque = document.getElementById("estoque").value;
  const imagem = document.getElementById("imagem").value;

  const resposta = await fetch("http://localhost:3000/produto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: usuario.email,
      nome,
      preco,
      estoque,
      imagem
    })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Produto cadastrado com sucesso!");
    carregarProdutosAdmin(); // 🔥 atualiza lista automaticamente
  } else {
    alert(dados.mensagem || "Erro ao cadastrar");
  }
}

// 🔥 CORRIGIDO
async function carregarProdutosAdmin() {
  console.log("CARREGANDO PRODUTOS...");

  try {
    const resposta = await fetch("http://localhost:3000/produto");
    console.log("STATUS:", resposta.status);

    const produtos = await resposta.json();
    console.log("PRODUTOS:", produtos);

    const div = document.getElementById("lista-produtos-admin");

    // 🔥 PROTEÇÃO
    if (!div) {
      console.log("DIV NÃO ENCONTRADA");
      return;
    }

    div.innerHTML = "";

    produtos.forEach(p => {
      div.innerHTML += `
        <div class="card">
          <h3>${p.nome}</h3>
          <p>R$ ${p.preco}</p>
          <button onclick="excluirProduto(${p.id})">
            Excluir
          </button>
        </div>
      `;
    });

  } catch (erro) {
    console.log("ERRO:", erro);
  }
}

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    const resposta = await fetch(`http://localhost:3000/produto/${id}`, {
      method: "DELETE"
    });

    console.log("STATUS DELETE:", resposta.status);

    const dados = await resposta.json();
    console.log("RESPOSTA:", dados);

    if (resposta.ok) {
      alert("Produto excluído!");
      carregarProdutosAdmin();
    } else {
      alert(dados.erro || dados.mensagem || "Erro ao excluir");
    }

  } catch (erro) {
    console.log("ERRO:", erro);
    alert("Erro de conexão");
  }
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

window.addEventListener("load", () => {
  if (typeof mostrarUsuario === "function") {
    mostrarUsuario();
  }
  carregarProdutosAdmin();
});