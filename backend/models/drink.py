from db import db

class Drink(db.Model):
    __tablename__ = 'drinks'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    preco = db.Column(db.Numeric(6, 2), nullable=False)

    def __repr__(self):
        return f"<Drink {self.nome}>"
