from flask import Blueprint, request, jsonify, session
from models.order import Order, OrderDrink
from models.drink import Drink
from models.pizza import PizzaConfig, PizzaFlavor, PizzaFlavorAssociation
from db import db
from decimal import Decimal

cart_bp = Blueprint('cart_bp', __name__, url_prefix='/api/cart')


def _build_cors_preflight_response():
    response = jsonify({"message": "Preflight Accepted"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


def calcular_preco_pizza_front(pizza):
    precos = {
        'broto': 25.0,
        'media': 35.0,
        'grande': 45.0,
        'familia': 55.0
    }
    preco = precos.get(pizza.size, 0.0)
    if pizza.crust == 'recheada':
        preco += 5.0
    return preco


@cart_bp.route('/add', methods=['POST', 'OPTIONS'])
def add_to_cart():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    user_id = session['user_id']
    data = request.get_json()

    if not data or 'type' not in data:
        return jsonify({"error": "Dados inválidos"}), 400

    order = Order.query.filter_by(
        customer_id=user_id,
        status='pendente'
    ).first()

    if not order:
        order = Order(customer_id=user_id)
        db.session.add(order)
        db.session.flush()

    try:
        if data['type'] == 'drink':
            if 'items' not in data:
                return jsonify({"error": "Dados de bebida inválidos"}), 400

            for item in data['items']:
                drink_id = item.get('drink_id')
                quantidade = item.get('quantidade', 1)

                drink = Drink.query.get(drink_id)
                if not drink:
                    continue

                existing_item = next(
                    (i for i in order.items if i.drink_id == drink_id),
                    None
                )

                if existing_item:
                    existing_item.quantidade = quantidade
                else:
                    new_item = OrderDrink(
                        order_id=order.id,
                        drink_id=drink_id,
                        quantidade=quantidade,
                        preco=drink.preco
                    )
                    db.session.add(new_item)

        elif data['type'] == 'pizza':
            pizza_data = data.get('pizza', {})
            if not pizza_data or not all(key in pizza_data for key in ['size', 'crust', 'flavors']):
                return jsonify({"error": "Dados de pizza incompletos"}), 400
            if not isinstance(pizza_data.get('flavors'), list) or len(pizza_data['flavors']) == 0:
                return jsonify({"error": "Selecione pelo menos 1 sabor"}), 400

            new_pizza = PizzaConfig(
                size=pizza_data['size'],
                crust=pizza_data['crust'],
                order_id=order.id
            )
            db.session.add(new_pizza)
            db.session.flush()

            for flavor_id in pizza_data['flavors']:
                flavor = PizzaFlavor.query.get(flavor_id)
                if flavor:
                    print(f"Associando sabor ID {flavor_id} à pizza ID {new_pizza.id}")  # Debug
                    association = PizzaFlavorAssociation(
                        pizza_id=new_pizza.id,
                        flavor_id=flavor_id
                    )
                    db.session.add(association)

        else:
            return jsonify({"error": "Tipo de item inválido"}), 400

        db.session.commit()
        response = jsonify({"msg": "Item adicionado ao carrinho!"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@cart_bp.route('/', methods=['GET', 'OPTIONS'])
def get_cart():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    user_id = session['user_id']
    order = Order.query.options(
        db.joinedload(Order.items).joinedload(OrderDrink.drink),
        db.joinedload(Order.pizzas).joinedload(PizzaConfig.flavors)
    ).filter_by(
        customer_id=user_id,
        status='pendente'
    ).first()

    if not order:
        return jsonify({"items": [], "pizzas": [], "total": 0})

    items = [{
        "id": item.id,
        "drink_id": item.drink_id,
        "nome": item.drink.nome,
        "quantidade": item.quantidade,
        "preco": float(item.preco)
    } for item in order.items]

    pizzas = [{
        "id": pizza.id,
        "size": pizza.size,
        "crust": pizza.crust,
        "flavors": [f.name for f in pizza.flavors],
        "preco": calcular_preco_pizza_front(pizza)
    } for pizza in order.pizzas]

    response = jsonify({
        "items": items,
        "pizzas": pizzas,
        "total": float(order.calcular_total())
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 200


@cart_bp.route('/update/<int:item_id>', methods=['PUT', 'OPTIONS'])
def update_cart_item(item_id):
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    data = request.get_json()
    new_quantity = data.get('quantidade', 1)

    item = OrderDrink.query.get(item_id)
    if not item:
        return jsonify({"error": "Item não encontrado"}), 404

    item.quantidade = new_quantity
    db.session.commit()

    response = jsonify({"msg": "Quantidade atualizada!"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 200


@cart_bp.route('/remove/<int:item_id>', methods=['DELETE', 'OPTIONS'])
def remove_cart_item(item_id):
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    item = OrderDrink.query.get(item_id)
    if not item:
        return jsonify({"error": "Item não encontrado"}), 404

    db.session.delete(item)
    db.session.commit()

    response = jsonify({"msg": "Item removido!"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 200


@cart_bp.route('/remove-pizza/<int:pizza_id>', methods=['DELETE', 'OPTIONS'])
def remove_pizza(pizza_id):
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    if 'user_id' not in session:
        return jsonify({"error": "Faça login primeiro"}), 401

    try:
        pizza = PizzaConfig.query.get(pizza_id)
        if not pizza:
            return jsonify({"error": "Pizza não encontrada"}), 404

        db.session.delete(pizza)
        db.session.commit()

        response = jsonify({"msg": "Pizza removida com sucesso!"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

