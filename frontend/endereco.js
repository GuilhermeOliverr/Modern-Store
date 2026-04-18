async function buscarCEP() {
  const cep = document.getElementById("cep").value;

  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const dados = await resposta.json();

  document.getElementById("rua").value = dados.logradouro;
  document.getElementById("bairro").value = dados.bairro;
  document.getElementById("cidade").value = dados.localidade;
  document.getElementById("estado").value = dados.uf;
}
async function finalizarPedido() {
  alert("Pedido finalizado com endereço!");
  window.location.href = "produtos.html";
}