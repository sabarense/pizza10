import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from models.drink import Drink
from models.pizza import PizzaFlavor

# Configuração inicial
load_dotenv()
app = Flask(__name__)

# Configurações do app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pizza10.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização do banco de dados
from db import db

db.init_app(app)

# Registro de blueprints
from routes.auth_route import auth_bp
from routes.customer_routes import customer_bp
from routes.drink_route import drink_bp
from routes.cart_route import cart_bp
from routes.payment_route import payment_bp
from routes.uber_direct_route import uber_bp



app.register_blueprint(auth_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(drink_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(uber_bp)

# Configuração do CORS APÓS registro dos blueprints
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:3000",
            "supports_credentials": True,
            "allow_headers": ["Content-Type"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    }
)

# Criação do banco de dados e seed inicial
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        # Seed inicial de bebidas
        if not Drink.query.first():
            from models.drink import Drink

            bebidas = [
                Drink(nome='Coca-Cola 2L', preco=10.50),
                Drink(nome='Guaraná 2L', preco=8.00),
                Drink(nome='Suco de Laranja', preco=8.00),
                Drink(nome='Água Mineral', preco=4.00)
            ]
            db.session.add_all(bebidas)
            db.session.commit()

            # Seed de sabores
            if not PizzaFlavor.query.first():
                sabores = [
                    "Calabresa", "Portuguesa", "Frango",
                    "Peperoni", "Vegetariana", "Moda",
                    "Margheritta", "Quatro Queijos"
                ]
                for sabor in sabores:
                    db.session.add(PizzaFlavor(name=sabor))
                db.session.commit()

    app.run(debug=True)
