from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from .calculations import (
    calc_utilidad_bruta, calc_utilidad_neta, calc_flujo_caja,
    calc_punto_equilibrio, calc_margen_ganancia, classify_margen,
    classify_profit, calc_cuota_credito, calc_negocio_detallado
)
from .models import db, Concept, Case, Simulation, UserConcept, UserCase

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/simulador')
def simulador():
    return render_template('simulador.html')

@main.route('/simulador/basico')
def simulador_basico():
    return render_template('simulador_basico.html')

@main.route('/simulador/negocio')
def simulador_negocio():
    return render_template('simulador_negocio.html')

@main.route('/simulador/credito')
def simulador_credito():
    return render_template('simulador_credito.html')

@main.route('/conceptos')
@login_required
def conceptos():
    concepts = Concept.query.all()
    completed_ids = [c.concept_id for c in UserConcept.query.filter_by(user_id=current_user.id).all()]
    return render_template('conceptos.html', concepts=concepts, completed_ids=completed_ids)

@main.route('/casos')
@login_required
def casos():
    cases = Case.query.all()
    completed_ids = {c.case_id: c.selected_option for c in UserCase.query.filter_by(user_id=current_user.id).all()}
    return render_template('casos.html', cases=cases, completed_ids=completed_ids)

@main.route('/ayuda')
def ayuda():
    return render_template('ayuda.html')

@main.route('/dashboard')
@login_required
def dashboard():
    # Progress tracking logic
    total_concepts = Concept.query.count()
    total_cases = Case.query.count()
    
    completed_concepts_count = UserConcept.query.filter_by(user_id=current_user.id).count()
    completed_cases_count = UserCase.query.filter_by(user_id=current_user.id).count()

    simulations = Simulation.query.filter_by(user_id=current_user.id).order_by(Simulation.created_at.desc()).all()
    
    return render_template('dashboard.html', 
                          total_concepts=total_concepts, 
                          total_cases=total_cases,
                          completed_concepts_count=completed_concepts_count,
                          completed_cases_count=completed_cases_count,
                          simulations=simulations)

@main.route('/mark_concept_completed/<int:concept_id>', methods=['POST'])
@login_required
def mark_concept_completed(concept_id):
    existing = UserConcept.query.filter_by(user_id=current_user.id, concept_id=concept_id).first()
    if not existing:
        new_completion = UserConcept(user_id=current_user.id, concept_id=concept_id)
        db.session.add(new_completion)
        db.session.commit()
    return jsonify({'status': 'success'})

@main.route('/mark_case_completed/<int:case_id>', methods=['POST'])
@login_required
def mark_case_completed(case_id):
    data = request.get_json()
    option = data.get('option')
    
    existing = UserCase.query.filter_by(user_id=current_user.id, case_id=case_id).first()
    if not existing:
        new_completion = UserCase(user_id=current_user.id, case_id=case_id, selected_option=option)
        db.session.add(new_completion)
        db.session.commit()
    else:
        existing.selected_option = option
        db.session.commit()
        
    return jsonify({'status': 'success'})

@main.route('/save_simulation', methods=['POST'])
@login_required
def save_simulation():
    try:
        data = request.get_json()
        
        # We need the calculated net profit too
        income = float(data.get('income', 0))
        fixed_costs = float(data.get('fixedCosts', 0))
        variable_costs_raw = float(data.get('variableCosts', 0))
        variable_type = data.get('variableType', 'fixed')
        
        if variable_type == 'percentage':
            variable_costs = (variable_costs_raw / 100) * income
        else:
            variable_costs = variable_costs_raw
            
        expenses = float(data.get('expenses', 0))
        
        gross_profit = calc_utilidad_bruta(income, variable_costs)
        net_profit = calc_utilidad_neta(gross_profit, fixed_costs, expenses)

        new_sim = Simulation(
            user_id=current_user.id,
            business_name=data.get('name'),
            sector=data.get('sector'),
            month=data.get('month'),
            income=income,
            fixed_costs=fixed_costs,
            variable_costs=variable_costs,
            expenses=expenses,
            net_profit=net_profit
        )
        
        db.session.add(new_sim)
        db.session.commit()
        
        return jsonify({'message': 'Simulación guardada con éxito', 'id': new_sim.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/save_pro_simulation', methods=['POST'])
@login_required
def save_pro_simulation():
    try:
        import json
        data = request.get_json()
        
        products = data.get('products', [])
        operating_expenses = data.get('operatingExpenses', {})
        fixed_costs = float(data.get('fixedCosts', 0))
        
        # We can use our calc function to get the net profit for saving
        # But we also have it from the frontend... let's just use the totals directly
        # for simplicity in saving
        
        total_revenue = sum(float(p.get('quantity', 0)) * float(p.get('price', 0)) for p in products)
        total_variable = sum(float(p.get('quantity', 0)) * float(p.get('cost_unit', 0)) for p in products)
        total_operating = sum(float(v) for v in operating_expenses.values())
        
        net_profit = total_revenue - (total_variable + fixed_costs + total_operating)

        new_sim = Simulation(
            user_id=current_user.id,
            business_name=data.get('businessName'),
            sector='General (Pro)',
            month=data.get('month'),
            income=total_revenue,
            fixed_costs=fixed_costs,
            variable_costs=total_variable,
            expenses=total_operating,
            net_profit=net_profit,
            is_pro=True,
            products_json=json.dumps(products),
            operating_details_json=json.dumps(operating_expenses)
        )
        
        db.session.add(new_sim)
        db.session.commit()
        
        return jsonify({'message': 'Simulación Pro guardada con éxito', 'id': new_sim.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        income = float(data.get('income', 0))
        
        if 'fixedCosts' in data:
            fixed_costs = float(data.get('fixedCosts', 0))
        else:
            rent = float(data.get('rent', 0))
            utilities = float(data.get('utilities', 0))
            insurance = float(data.get('insurance', 0))
            salaries = float(data.get('salaries', 0))
            fixed_costs = rent + utilities + insurance + salaries
        
        variable_costs_raw = float(data.get('variableCosts', 0))
        variable_type = data.get('variableType', 'fixed')
        
        if variable_type == 'percentage':
            variable_costs = (variable_costs_raw / 100) * income
        else:
            variable_costs = variable_costs_raw
        
        expenses = float(data.get('expenses', 0))
        
        credit_amount = float(data.get('creditAmount', 0))
        credit_rate = float(data.get('creditRate', 0))
        credit_term = int(data.get('creditTerm', 0))
        credit_payment = calc_cuota_credito(credit_amount, credit_rate, credit_term)
        
        gross_profit = calc_utilidad_bruta(income, variable_costs)
        net_profit = calc_utilidad_neta(gross_profit, fixed_costs, expenses)
        cash_flow = calc_flujo_caja(income, fixed_costs, variable_costs, expenses) - credit_payment
        break_even = calc_punto_equilibrio(fixed_costs, variable_costs, income)
        margin = calc_margen_ganancia(net_profit, income)
        
        result = {
            'grossProfit': round(gross_profit, 2),
            'netProfit': round(net_profit, 2),
            'cashFlow': round(cash_flow, 2),
            'breakEven': round(break_even, 2) if break_even != float('inf') else 'N/A',
            'margin': round(margin, 2),
            'profitStatus': classify_profit(net_profit),
            'marginStatus': classify_margen(margin),
            'fixedCosts': round(fixed_costs, 2),
            'variableCosts': round(variable_costs, 2),
            'creditPayment': round(credit_payment, 2)
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/calculate_pro', methods=['POST'])
def calculate_pro():
    try:
        data = request.get_json()
        products = data.get('products', [])
        fixed_costs = float(data.get('fixedCosts', 0))
        operating_expenses = data.get('operatingExpenses', {})
        credit_info = data.get('creditInfo', {})
        
        results = calc_negocio_detallado(products, fixed_costs, operating_expenses, credit_info)
        
        # Round values for display
        for key in results:
            if isinstance(results[key], (int, float)):
                results[key] = round(results[key], 2)
        
        # Add dynamic classifications
        results['profitStatus'] = classify_profit(results['netProfit'])
        results['marginStatus'] = classify_margen(results['margin'])
        
        # Generate 12-month projections (simple for now: constant values)
        projections = []
        for i in range(1, 13):
            # We could add growth factors here if needed
            projections.append({
                'month': i,
                'revenue': results['totalRevenue'],
                'costs': results['totalVariableCosts'] + fixed_costs + results['totalOperating'] + results['creditPayment'],
                'profit': results['netProfit'],
                'cashFlow': results['cashFlow']
            })
        
        results['projections'] = projections
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
