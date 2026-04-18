# 📦 Modern Store

Projeto acadêmico de sistema de loja simples desenvolvido para a disciplina de Análise e Projeto de Sistemas.  
O sistema permite o gerenciamento de produtos com operações CRUD (Create, Read, Update e Delete), integrando front-end, back-end e banco de dados.

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js v18.20.8 ou superior  
- MySQL Server  
- Git  

---

## 📥 Clonar o repositório

```bash
git clone https://github.com/GuilhermeOliverr/Modern-Store.git
cd Modern-Store
```
## 🗄️ Configuração do banco de dados

Abra o MySQL e execute:
```bash
CREATE DATABASE projeto;
```

## 📦 Instalação do backend
Acesse a pasta do backend e instale as dependências:
```bash
cd backend
npm install
```
## ▶️ Executar o backend

Modo desenvolvimento (com nodemon):
```bash
npm run dev
```
Modo produção:
```bash
npm start
```
## 🧰 Tecnologias utilizadas
Node.js
Express
MySQL
HTML
CSS
JavaScript
CORS
Nodemon

## 📌 Configuração do banco no backend
O projeto utiliza conexão local com o MySQL:
``` bash
host: "localhost",
user: "root",
password: "1234",
database: "projeto"
```

## 📌 Observação
Este projeto foi desenvolvido com fins acadêmicos, seguindo a estrutura proposta na disciplina de Análise e Projeto de Sistemas.