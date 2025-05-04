import os
import requests
from flask import Blueprint, request, jsonify, session

uber_bp = Blueprint('uber_bp', __name__, url_prefix='/api/uber-direct')

# Função auxiliar para obter o access token do Uber Direct
def get_uber_access_token():
    client_id = os.getenv("UBER_CLIENT_ID")
    client_secret = os.getenv("UBER_CLIENT_SECRET")
    url = "https://login.uber.com/oauth/v2/token"
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
        "scope": "eats.deliveries"
    }
    resp = requests.post(url, data=data)
    if resp.status_code != 200:
        raise Exception(f"Erro ao obter token do Uber: {resp.text}")
    return resp.json().get("access_token")

# Função auxiliar para criar uma entrega na Uber
def create_uber_delivery(access_token, delivery_data):
    url = "https://api.uber.com/v1/eats/deliveries"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    resp = requests.post(url, headers=headers, json=delivery_data)
    if resp.status_code not in (200, 201):
        raise Exception(f"Erro ao criar entrega Uber: {resp.text}")
    return resp.json()

# Endpoint para criar uma entrega Uber Direct
@uber_bp.route('/create-delivery', methods=['POST'])
def create_delivery():

    if 'user_id' not in session:
        return jsonify({'error': 'Faça login primeiro'}), 401

    data = request.get_json()
    # Exemplo de dados mínimos
    delivery_data = {
        "pickup": {
            "address": "Rua Exemplo, 123, Centro, São Paulo, SP",
            "contact": {
                "first_name": "Restaurante",
                "last_name": "Exemplo",
                "phone": "+5511999999999"
            }
        },
        "dropoff": {
            "address": data["endereco_cliente"],
            "contact": {
                "first_name": data["nome_cliente"],
                "last_name": "",
                "phone": data["telefone_cliente"]
            }
        },
        "order_value": data.get("valor_pedido", 1000),  # em centavos
        "external_id": str(data.get("pedido_id", "123"))
    }
    try:
        access_token = get_uber_access_token()
        result = create_uber_delivery(access_token, delivery_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
