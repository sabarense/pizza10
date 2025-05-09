# Projeto Delivery - Pizza e Bebidas com Stripe

Este é um sistema completo de pedidos de pizza e bebidas, com pagamento online via Stripe 

## Estrutura do Projeto

- `/frontend` - Aplicação React (interface do usuário)
- `/backend` - API Flask (servidor, banco de dados, integrações externas)

## Pré-requisitos

- Node.js (v16+)
- Python 3.8+
- pip
- Stripe account (para testes)

## Como rodar o projeto

### 1. Clone o repositório

git clone https://github.com/sabarense/pizza10.git <br>
cd pizza10 <br>

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` em `/frontend` e outro em `/backend` conforme os exemplos nos respectivos READMEs.

### 3. Instale e rode o backend

cd backend <br>
pip install -r requirements.txt <br>
python app.py <br>

### 4. Instale e rode o frontend

Abra outro terminal:

cd frontend <br>
npm install <br> 
npm start <br>

### 5. Acesse

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Funcionalidades

- Cadastro e login de usuários
- Escolha de pizzas e bebidas
- Carrinho de compras
- Pagamento online com Stripe
  
---

## Estrutura dos READMEs

- [Instruções do Frontend](./frontend/README.md)
- [Instruções do Backend](./backend/README.md)

---

