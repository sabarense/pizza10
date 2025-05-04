from flask import Blueprint, request, jsonify, session
from models.pizza import PizzaConfig, PizzaFlavor, PizzaFlavorAssociation
from models.order import Order
from db import db

pizza_bp = Blueprint('pizza_bp', __name__, url_prefix='/api/pizzas')


@pizza_bp.route('/', methods=['POST'])
def create_pizza():
    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    data = request.get_json()
    size = data.get('size')
    crust = data.get('crust')
    flavor_ids = data.get('flavors', [])

    # Validação básica
    if not size or not crust or len(flavor_ids) == 0:
        return jsonify({"error": "Dados incompletos"}), 400

    # Encontra o pedido pendente do usuário
    order = Order.query.filter_by(
        customer_id=session['user_id'],
        status='pendente'
    ).first()

    if not order:
        order = Order(customer_id=session['user_id'])
        db.session.add(order)
        db.session.flush()

    # Cria a pizza
    new_pizza = PizzaConfig(
        size=size,
        crust=crust,
        order_id=order.id
    )
    db.session.add(new_pizza)
    db.session.flush()

    # Associa os sabores
    for flavor_id in flavor_ids:
        flavor = PizzaFlavor.query.get(flavor_id)
        if flavor:
            association = PizzaFlavorAssociation(pizza_id=new_pizza.id, flavor_id=flavor_id)
            db.session.add(association)

    db.session.commit()

    return jsonify({"msg": "Pizza adicionada ao carrinho!"}), 201
