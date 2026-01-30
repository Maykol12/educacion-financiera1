def calc_utilidad_bruta(income, variable_costs):
    """Calculate gross profit: Income - Variable Costs"""
    return income - variable_costs

def calc_utilidad_neta(gross_profit, fixed_costs, expenses):
    """Calculate net profit: Gross Profit - Fixed Costs - Expenses"""
    return gross_profit - fixed_costs - expenses

def calc_flujo_caja(income, fixed_costs, variable_costs, expenses):
    """Calculate monthly cash flow: Income - (Fixed Costs + Variable Costs + Expenses)"""
    return income - (fixed_costs + variable_costs + expenses)

def calc_punto_equilibrio(fixed_costs, variable_costs, income):
    """Calculate break-even point: Fixed Costs / (1 - (Variable Costs / Income))"""
    if income <= 0 or variable_costs >= income:
        return float('inf')
    return fixed_costs / (1 - (variable_costs / income))

def calc_margen_ganancia(net_profit, income):
    """Calculate profit margin percentage: (Net Profit / Income) * 100"""
    if income <= 0:
        return 0
    return (net_profit / income) * 100

def classify_margen(margin):
    """Classify margin status based on percentage"""
    if margin >= 20:
        return "saludable"
    elif margin >= 10:
        return "normal"
    elif margin >= 5:
        return "precaución"
    else:
        return "crítico"

def classify_profit(net_profit):
    """Classify profit status"""
    if net_profit > 0:
        return "positiva (ganancia)"
    elif net_profit < 0:
        return "negativa (pérdida)"
    else:
        return "cero (equilibrio)"

def calc_cuota_credito(monto, tasa_anual, plazo_meses):
    """Calculate monthly loan payment using simple monthly interest"""
    if monto <= 0 or plazo_meses <= 0:
        return 0
    tasa_mensual = (tasa_anual / 100) / 12
    if tasa_mensual == 0:
        return monto / plazo_meses
    return (monto * tasa_mensual) / (1 - (1 + tasa_mensual) ** (-plazo_meses))

def calc_negocio_detallado(products, fixed_costs, operating_expenses, credit_info=None):
    """
    Calculate detailed business metrics based on products and expense breakdown.
    products: list of dicts {'quantity': Q, 'price': P, 'cost_unit': C}
    fixed_costs: total fixed monthly costs
    operating_expenses: dict with marketing, transport, imprevistos, etc.
    credit_info: dict with amount, rate, term
    """
    total_revenue = 0
    total_variable_costs = 0
    
    for p in products:
        q = float(p.get('quantity', 0))
        price = float(p.get('price', 0))
        cost = float(p.get('cost_unit', 0))
        total_revenue += q * price
        total_variable_costs += q * cost
        
    total_operating = sum(float(v) for v in operating_expenses.values())
    
    gross_profit = total_revenue - total_variable_costs
    net_profit = gross_profit - fixed_costs - total_operating
    
    credit_payment = 0
    if credit_info and credit_info.get('amount', 0) > 0:
        credit_payment = calc_cuota_credito(
            credit_info['amount'], 
            credit_info['rate'], 
            credit_info['term']
        )
        
    cash_flow = total_revenue - (total_variable_costs + fixed_costs + total_operating + credit_payment)
    
    # Break-even in monetary terms/revenue
    # Break-even = Fixed Costs / (1 - (Variable Costs / Revenue))
    # In pro version, we also include operating expenses in the fixed part for break-even to find survival point
    survival_break_even = (fixed_costs + total_operating) / (1 - (total_variable_costs / total_revenue)) if total_revenue > total_variable_costs else float('inf')
    
    return {
        'totalRevenue': total_revenue,
        'totalVariableCosts': total_variable_costs,
        'grossProfit': gross_profit,
        'totalOperating': total_operating,
        'netProfit': net_profit,
        'cashFlow': cash_flow,
        'creditPayment': credit_payment,
        'breakEven': survival_break_even,
        'margin': (net_profit / total_revenue * 100) if total_revenue > 0 else 0
    }
