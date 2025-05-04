from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models.customer import Customer
from db import db

customer_bp = Blueprint('customer_bp', __name__, url_prefix='/api/customers')

@customer_bp.route('/', methods=['POST'])
def create_customer():
    data = request.get_json()
    required = ['nome', 'email', 'senha']
    if not all(field in data for field in required):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    if Customer.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'E-mail já cadastrado'}), 400

    new_customer = Customer(
        nome=data['nome'],
        email=data['email'],
        senha=generate_password_hash(data['senha']),
        telefone=data.get('telefone', ''),
        endereco=data.get('endereco', '')
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({'msg': 'Usuário cadastrado com sucesso!', 'id': new_customer.id}), 201
