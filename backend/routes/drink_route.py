from flask import Blueprint, jsonify
from models.drink import Drink

drink_bp = Blueprint('drink_bp', __name__, url_prefix='/api/drinks')

@drink_bp.route('/', methods=['GET'])
def get_drinks():
    drinks = Drink.query.all()
    return jsonify([
        {"id": d.id, "nome": d.nome, "preco": float(d.preco)}
        for d in drinks
    ])
