const express = require("express");
const mysql = require("mysql2");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// Conexão
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "projeto"
});

con.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});


// =======================
//  USUÁRIOS
// =======================

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;

  const sql = "INSERT INTO cliente (nome, email, senha, tipo) VALUES (?, ?, ?, 'CLIENTE')";

  con.query(sql, [nome, email, senha], (err) => {
    if (err) return res.status(500).json({ erro: err });

    res.json({ mensagem: "Usuário cadastrado com sucesso" });
  });
});

app.get("/usuarios", (req, res) => {
  con.query("SELECT * FROM cliente", (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    res.json(result);
  });
});


// LOGIN
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM cliente WHERE email = ? AND senha = ?";

  con.query(sql, [email, senha], (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    if (result.length > 0) {
      res.json({
        mensagem: "Login OK",
        usuario: result[0]
      });
    } else {
      res.status(401).json({ mensagem: "Email ou senha inválidos" });
    }
  });
});


// =======================
//  PRODUTOS
// =======================


app.get("/produto", (req, res) => {
  con.query("SELECT * FROM produto", (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    res.json(result);
  });
});

app.post("/produto", (req, res) => {
  const { email, nome, preco, estoque, imagem } = req.body;

  const sqlUser = "SELECT * FROM cliente WHERE email = ?";

  con.query(sqlUser, [email], (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    if (result.length === 0 || result[0].tipo !== "ADMIN") {
      return res.status(403).json({
        mensagem: "Apenas admin pode cadastrar produtos"
      });
    }

    //  lógica da imagem
    let imagemFinal = imagem;

  if (!imagemFinal || imagemFinal.trim() === "") {    

  const nomeLimpo = nome.toLowerCase();

  if (nomeLimpo.includes("camiseta")) {
    imagemFinal = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab";

  } else if (nomeLimpo.includes("calça")) {
    imagemFinal = "https://images.unsplash.com/photo-1516826957135-700dedea698c";

  } else if (nomeLimpo.includes("tênis")) {
    imagemFinal = "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

  } else {
    imagemFinal = "https://via.placeholder.com/150";
  }
}

    const sqlProduto = `
      INSERT INTO produto (nome, preco, estoque, imagem)
      VALUES (?, ?, ?, ?)
    `;

    con.query(sqlProduto, [nome, preco, estoque, imagemFinal], (err2) => {
      if (err2) return res.status(500).json({ erro: err2 });

      res.json({ mensagem: "Produto cadastrado com sucesso" });
    });
  });
});


// =======================
//  COMPRA DIRETA
// =======================

app.post("/comprar", (req, res) => {
  const { email, produto_id } = req.body;

  // busca usuário
  con.query("SELECT id FROM cliente WHERE email = ?", [email], (err, userResult) => {
    if (err) return res.status(500).json({ erro: err });

    if (userResult.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const id_cliente = userResult[0].id;

    // busca produto
    con.query("SELECT * FROM produto WHERE id = ?", [produto_id], (err2, prodResult) => {
      if (err2) return res.status(500).json({ erro: err2 });

      if (prodResult.length === 0) {
        return res.status(404).json({ mensagem: "Produto não encontrado" });
      }

      const produto = prodResult[0];

      // cria pedido
      const sqlPedido = `
        INSERT INTO pedido (id_cliente, total)
        VALUES (?, ?)
      `;

      con.query(sqlPedido, [id_cliente, produto.preco], (err3, pedidoResult) => {
        if (err3) return res.status(500).json({ erro: err3 });

        const id_pedido = pedidoResult.insertId;

        // cria item do pedido
        const sqlItem = `
          INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario)
          VALUES (?, ?, ?, ?)
        `;

        con.query(sqlItem, [id_pedido, produto_id, 1, produto.preco], (err4) => {
          if (err4) return res.status(500).json({ erro: err4 });

          res.json({
            mensagem: "Compra realizada com sucesso!",
            pedido_id: id_pedido
          });
        });
      });
    });
  });
});



app.put("/pedido/:id", (req, res) => {
  const { id } = req.params;
  const { status, metodo_pagamento } = req.body;

  const sql = `
    UPDATE pedido
    SET status = ?, metodo_pagamento = ?
    WHERE id = ?
  `;

  con.query(sql, [status, metodo_pagamento, id], (err) => {
    if (err) return res.status(500).json({ erro: err });

    res.json({ mensagem: "Pedido atualizado" });
  });
});

//servidor



app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});