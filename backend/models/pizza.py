from datetime import datetime
from db import db


class PizzaFlavor(db.Model):
    __tablename__ = 'pizza_flavors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class PizzaConfig(db.Model):
    __tablename__ = 'pizzas'
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(20), nullable=False)  # broto, media, grande, familia
    crust = db.Column(db.String(20), nullable=False)  # fina, regular, recheada
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)

    # Relacionamento muitos-para-muitos com sabores
    flavors = db.relationship(
        'PizzaFlavor',
        secondary='pizza_flavor_association',
        lazy='joined',
        backref=db.backref('pizzas', lazy='joined')
    )


class PizzaFlavorAssociation(db.Model):
    __tablename__ = 'pizza_flavor_association'
    pizza_id = db.Column(db.Integer, db.ForeignKey('pizzas.id'), primary_key=True)
    flavor_id = db.Column(db.Integer, db.ForeignKey('pizza_flavors.id'), primary_key=True)
