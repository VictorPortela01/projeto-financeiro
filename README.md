# 📊 MeuFinanceiro — Dashboard de Controle Financeiro  

`MeuFinanceiro` é uma aplicação web full-stack completa, construída com as tecnologias mais modernas, que permite aos usuários gerenciar suas finanças pessoais.  
Usuários podem se cadastrar, fazer login e controlar suas receitas e despesas de forma visual e intuitiva.  

Este projeto foi desenvolvido como um **item de portfólio robusto**, demonstrando proficiência na **stack MERN (MongoDB, Express, React, Node.js)** e em **arquiteturas de autenticação seguras**.  

---

## ✨ Demonstração *(WIP)*  
🔗 *(Adicionar aqui o link do site em produção quando disponível.)*  

---

## 📸 Screenshots  
*(Adicionar screenshots do seu app pronto aqui — esta é a parte mais importante do seu portfólio!)*  

| Dashboard (Dark Mode) | Dashboard (Light Mode) |
| :---: | :---: |
|  |  |
| Modal de Transação | Página de Categorias |
|  |  |

---

## 🚀 Principais Funcionalidades  

### 🔐 Autenticação Segura  
- Cadastro e login de usuários.  
- Sistema de autenticação baseado em **JWT (JSON Web Token)**.  
- Fluxo de **Access Token (15min)** e **Refresh Token (7d)**.  
- Refresh Token armazenado em cookie `httpOnly` (proteção contra XSS).  
- **Logout stateful:** o Refresh Token é invalidado no banco no logout.  

### 📈 Dashboard Interativo  
- Cards de resumo (Saldo, Receitas, Despesas) em tempo real.  
- Gráfico de rosca (**Chart.js**) mostrando distribuição por categoria.  
- Lista de transações recentes com scroll.  

### 💰 CRUD de Transações  
- **Criar:** adicionar receitas/despesas via modal.  
- **Ler:** visualizar lista de transações.  
- **Atualizar:** editar transações existentes.  
- **Deletar:** excluir com confirmação.  

### 🏷️ CRUD de Categorias  
- Página dedicada (`/categories`) para gerenciamento.  
- Criar, editar e excluir categorias (com validação de uso no backend).  

### 💡 Experiência do Usuário (UX)  
- **Atualização automática:** via **React Query** (invalidação de cache).  
- **Dark Mode:** sincroniza com o sistema e salva no `localStorage`.  
- **Design responsivo:** com **Tailwind CSS**.  
- **Rotas protegidas:** acesso controlado com base na autenticação.  

---

## 🛠️ Stack de Tecnologias  

### 🧩 Backend (API)  
- **Node.js**  
- **Express.js**  
- **MongoDB Atlas**  
- **Mongoose**  
- **JSON Web Token (JWT)**  
- **bcrypt.js**  
- **CORS**  

### 💻 Frontend (Aplicação)  
- **React (Vite)**  
- **Tailwind CSS**  
- **React Router DOM**  
- **React Query (TanStack Query)**  
- **Axios**  
- **Chart.js**  
- **React Context**  

---

## 📦 Como Rodar o Projeto Localmente  

### ⚙️ Requisitos  
- **Node.js v18+**  
- **Git**  
- Conta gratuita no **MongoDB Atlas**  

---

### 1️⃣ Clonar o Repositório  
```bash
git clone https://github.com/seu-usuario/projeto-financeiro.git
cd projeto-financeiro

---

## ⚙️ 2️⃣ Configurar o Backend

```bash
cd backend
npm install


# Conexão com o MongoDB Atlas
MONGO_URI=mongodb+srv://...

# Porta do servidor
PORT=5000

# Chaves secretas
JWT_SECRET=sua_chave_secreta_longa_aqui
JWT_REFRESH_SECRET=sua_outra_chave_secreta_longa_aqui
JWT_LIFETIME=15m
JWT_REFRESH_LIFETIME=7d


npm run dev
# O backend rodará em http://localhost:5000

---

## ⚙️ 3️⃣ Configurar o Frontend
cd frontend
npm install

---
🌐 Documentação da API
Todas as rotas (exceto /auth/login e /auth/register) são protegidas e exigem um Bearer Token.

|   Método   | Endpoint                 | Descrição                                 |
| :--------: | :----------------------- | :---------------------------------------- |
|  **POST**  | `/api/auth/register`     | Cria um novo usuário                      |
|  **POST**  | `/api/auth/login`        | Autentica e retorna tokens                |
|   **GET**  | `/api/auth/refresh`      | Gera novo Access Token a partir do cookie |
|  **POST**  | `/api/auth/logout`       | Invalida o Refresh Token no banco         |
|   **GET**  | `/api/dashboard/summary` | [Protegido] Retorna resumo financeiro     |
|   **GET**  | `/api/transactions`      | [Protegido] Lista transações              |
|  **POST**  | `/api/transactions`      | [Protegido] Cria nova transação           |
|   **PUT**  | `/api/transactions/:id`  | [Protegido] Atualiza transação            |
| **DELETE** | `/api/transactions/:id`  | [Protegido] Deleta transação              |
|   **GET**  | `/api/categories`        | [Protegido] Lista categorias              |
|  **POST**  | `/api/categories`        | [Protegido] Cria categoria                |
|   **PUT**  | `/api/categories/:id`    | [Protegido] Atualiza categoria            |
| **DELETE** | `/api/categories/:id`    | [Protegido] Deleta categoria              |


## 👨‍💻 Autor

**Victor Portela**

* [LinkedIn](https://www.linkedin.com/in/victorportelav/)
* [GitHub](https://github.com/VictorPortela01)