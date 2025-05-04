from decimal import Decimal
from db import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    status = db.Column(db.String(20), default='pendente')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    customer = db.relationship('Customer', back_populates='orders')
    items = db.relationship('OrderDrink', back_populates='order', cascade='all, delete-orphan')
    pizzas = db.relationship('PizzaConfig', backref='order', cascade='all, delete-orphan')

    def calcular_total(self):
        total = Decimal('0.00')

        # Preços fixos em Decimal
        precos_pizza = {
            'broto': Decimal('25.00'),
            'media': Decimal('35.00'),
            'grande': Decimal('45.00'),
            'familia': Decimal('55.00')
        }
        adicional_crosta = Decimal('5.00')

        # Bebidas
        for item in self.items:
            total += Decimal(str(item.preco)) * item.quantidade

        # Pizzas
        for pizza in self.pizzas:
            preco_base = precos_pizza.get(pizza.size, Decimal('0.00'))
            if pizza.crust == 'recheada':
                preco_base += adicional_crosta
            total += preco_base

        return total


class OrderDrink(db.Model):
    __tablename__ = 'order_drinks'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    drink_id = db.Column(db.Integer, db.ForeignKey('drinks.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False, default=1)
    preco = db.Column(db.Numeric(6, 2), nullable=False)

    # Relacionamentos
    order = db.relationship('Order', back_populates='items')
    drink = db.relationship('Drink')
