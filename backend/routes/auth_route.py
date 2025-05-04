from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from models.customer import Customer

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    if not email or not senha:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    user = Customer.query.filter_by(email=email).first()
    if user and check_password_hash(user.senha, senha):
        session['user_id'] = user.id
        session['user_nome'] = user.nome
        return jsonify({"msg": "Login realizado!", "nome": user.nome, "id": user.id}), 200
    return jsonify({"error": "Credenciais inválidas"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('user_nome', None)
    return jsonify({"msg": "Logout realizado!"}), 200
