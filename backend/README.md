# Backend - Pizza Delivery

Este é o backend Flask do sistema de delivery.

## Como rodar

pip install -r requirements.txt <br>
python app.py


## Variáveis de ambiente

Crie um arquivo `.env` com:

STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe <br>
UBER_CLIENT_ID=seu_client_id_uber <br>
UBER_CLIENT_SECRET=seu_client_secret_uber <br>
SECRET_KEY=um_segredo_qualquer


## Endpoints principais

- `/api/cart`
- `/api/auth`
- `/api/uber-direct/create-delivery`
- `/api/payment-intent`

---
