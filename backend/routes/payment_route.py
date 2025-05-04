# routes/payment_route.py
import os
from flask import Blueprint, jsonify, session
from models.order import Order
import stripe

payment_bp = Blueprint('payment_bp', __name__, url_prefix='/api')

# Configure sua chave secreta do Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


@payment_bp.route('/payment-intent', methods=['POST'])
def create_payment_intent():
    # Verifica autenticação
    if 'user_id' not in session:
        return jsonify({'error': 'Faça login primeiro'}), 401

    # Busca o pedido pendente do usuário
    order = Order.query.filter_by(
        customer_id=session['user_id'],
        status='pendente'
    ).first()

    if not order:
        return jsonify({'error': 'Nenhum pedido encontrado'}), 404

    try:
        # Converte o total para centavos (exigência do Stripe)
        total_centavos = int(order.calcular_total() * 100)

        # Cria o PaymentIntent no Stripe
        intent = stripe.PaymentIntent.create(
            amount=total_centavos,
            currency='brl',
            automatic_payment_methods={'enabled': True},
            metadata={
                'order_id': order.id,
                'user_id': session['user_id']
            }
        )

        return jsonify({'clientSecret': intent.client_secret}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
