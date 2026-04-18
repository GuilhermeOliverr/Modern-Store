const express = require("express");
const mysql = require("mysql2");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// 🔌 Conexão
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
// 👤 USUÁRIOS
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
// 👕 PRODUTOS
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

    // 🔥 lógica da imagem
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
// 🛒 CARRINHO (CORRIGIDO)
// =======================

// Criar carrinho se não existir
app.post("/carrinho", (req, res) => {

  
    console.log("REQ BODY:", req.body); // 👈 AQUI

  const { email, produto_id, quantidade } = req.body;

  const sqlUser = "SELECT id FROM cliente WHERE email = ?";

  con.query(sqlUser, [email], (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const id_cliente = result[0].id;

    // 1️⃣ verifica se já existe carrinho
    const sqlCarrinho = "SELECT id FROM carrinho WHERE id_cliente = ?";

    con.query(sqlCarrinho, [id_cliente], (err2, result2) => {
      if (err2) return res.status(500).json({ erro: err2 });

      if (result2.length === 0) {
        // cria carrinho
        con.query("INSERT INTO carrinho (id_cliente) VALUES (?)", [id_cliente], (err3, result3) => {
          if (err3) return res.status(500).json({ erro: err3 });

          inserirItem(result3.insertId);
        });
      } else {
        inserirItem(result2[0].id);
      }
    });

    function inserirItem(id_carrinho) {
      const sqlItem = `
        INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade)
        VALUES (?, ?, ?)
      `;

      con.query(sqlItem, [id_carrinho, produto_id, quantidade], (err4) => {
        if (err4) return res.status(500).json({ erro: err4 });

        res.json({ mensagem: "Produto adicionado ao carrinho" });
      });
    }
  });
});


// Ver carrinho
app.get("/carrinho/:email", (req, res) => {
  const { email } = req.params;

  const sql = `
    SELECT p.nome, p.preco, ic.quantidade
    FROM item_carrinho ic
    JOIN carrinho c ON ic.id_carrinho = c.id
    JOIN cliente cl ON c.id_cliente = cl.id
    JOIN produto p ON ic.id_produto = p.id
    WHERE cl.email = ?
  `;

  con.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    if (result.length === 0) {
      return res.json({ mensagem: "Carrinho vazio" });
    }

    res.json(result);
  });
});


// =======================
// 🚀 SERVIDOR
// =======================

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});