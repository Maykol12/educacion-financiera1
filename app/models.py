from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    # Progress tracking
    completed_concepts = db.relationship('UserConcept', backref='user', lazy=True)
    completed_cases = db.relationship('UserCase', backref='user', lazy=True)
    simulations = db.relationship('Simulation', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Concept(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    help_icon_id = db.Column(db.String(50)) # e.g. 'costos-fijos'

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    # Options and feedback could be JSON or separate table. For simplicity, let's use string/text here or JSON.
    option_a = db.Column(db.String(200), nullable=False)
    option_b = db.Column(db.String(200), nullable=False)
    feedback_a = db.Column(db.Text)
    feedback_b = db.Column(db.Text)

class UserConcept(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    concept_id = db.Column(db.Integer, db.ForeignKey('concept.id'), nullable=False)

class UserCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    selected_option = db.Column(db.String(1)) # 'A' or 'B'
    score = db.Column(db.Integer, default=0)

class Simulation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    business_name = db.Column(db.String(100), nullable=False)
    sector = db.Column(db.String(50))
    month = db.Column(db.String(20))
    income = db.Column(db.Float)
    fixed_costs = db.Column(db.Float)
    variable_costs = db.Column(db.Float)
    expenses = db.Column(db.Float)
    net_profit = db.Column(db.Float)
    # Pro fields
    is_pro = db.Column(db.Boolean, default=False)
    products_json = db.Column(db.Text) # Storing products as JSON string
    operating_details_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
