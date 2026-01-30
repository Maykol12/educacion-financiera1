document.addEventListener('DOMContentLoaded', () => {
    const productsTable = document.getElementById('products-table').querySelector('tbody');
    const addProductBtn = document.getElementById('add-product-btn');
    const productTemplate = document.getElementById('product-row-template');
    
    const proForm = document.getElementById('pro-business-form');
    const resultsDiv = document.getElementById('pro-results');
    const projectionsDiv = document.getElementById('projections-section');
    
    // Total displays
    const totalRevDisplay = document.getElementById('total-revenue-display');
    const totalFixedDisplay = document.getElementById('total-fixed-display');
    const totalOpDisplay = document.getElementById('total-operating-display');

    let cashFlowChart = null;

    // --- Helper Functions ---

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const calculateRowMargin = (row) => {
        const qty = parseFloat(row.querySelector('.prod-qty').value) || 0;
        const price = parseFloat(row.querySelector('.prod-price').value) || 0;
        const cost = parseFloat(row.querySelector('.prod-cost').value) || 0;
        const margin = qty * (price - cost);
        row.querySelector('.prod-margin').textContent = formatCurrency(margin);
        updateOverallTotals();
    };

    const updateOverallTotals = () => {
        // Revenue
        let totalRev = 0;
        productsTable.querySelectorAll('tr').forEach(row => {
            const qty = parseFloat(row.querySelector('.prod-qty').value) || 0;
            const price = parseFloat(row.querySelector('.prod-price').value) || 0;
            totalRev += qty * price;
        });
        totalRevDisplay.textContent = formatCurrency(totalRev);

        // Fixed Costs
        const fixed = (parseFloat(document.getElementById('rent').value) || 0) +
                      (parseFloat(document.getElementById('utilities').value) || 0) +
                      (parseFloat(document.getElementById('salaries').value) || 0) +
                      (parseFloat(document.getElementById('maintenance').value) || 0);
        totalFixedDisplay.textContent = formatCurrency(fixed);

        // Operating
        const operating = (parseFloat(document.getElementById('marketing').value) || 0) +
                          (parseFloat(document.getElementById('transport').value) || 0) +
                          (parseFloat(document.getElementById('imprevistos').value) || 0) +
                          (parseFloat(document.getElementById('internet').value) || 0);
        totalOpDisplay.textContent = formatCurrency(operating);
    };

    // --- Event Listeners ---

    addProductBtn.addEventListener('click', () => {
        const clone = productTemplate.content.cloneNode(true);
        const row = clone.querySelector('tr');
        
        // Default initial values
        row.querySelector('.prod-qty').value = 1;
        row.querySelector('.prod-price').value = 0;
        row.querySelector('.prod-cost').value = 0;

        // Add change listeners to inputs
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => calculateRowMargin(row));
        });

        // Delete button
        row.querySelector('.btn-delete-row').addEventListener('click', () => {
            row.remove();
            updateOverallTotals();
        });

        productsTable.appendChild(row);
        updateOverallTotals();
    });

    // Listen for changes in all numeric inputs of the form
    proForm.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateOverallTotals);
    });

    // --- Form Submission ---

    document.getElementById('save-pro-btn').addEventListener('click', async () => {
        const businessName = document.getElementById('business-name').value;
        const month = document.getElementById('month').value;
        
        if (!businessName || !month) {
            alert('Por favor completa el nombre del negocio y el mes antes de guardar.');
            return;
        }

        const products = [];
        productsTable.querySelectorAll('tr').forEach(row => {
            products.push({
                name: row.querySelector('.prod-name').value,
                quantity: parseFloat(row.querySelector('.prod-qty').value) || 0,
                price: parseFloat(row.querySelector('.prod-price').value) || 0,
                cost_unit: parseFloat(row.querySelector('.prod-cost').value) || 0
            });
        });

        const operatingExpenses = {
            marketing: parseFloat(document.getElementById('marketing').value) || 0,
            transport: parseFloat(document.getElementById('transport').value) || 0,
            imprevistos: parseFloat(document.getElementById('imprevistos').value) || 0,
            internet: parseFloat(document.getElementById('internet').value) || 0
        };

        const payload = {
            businessName,
            month,
            products,
            fixedCosts: (parseFloat(document.getElementById('rent').value) || 0) +
                       (parseFloat(document.getElementById('utilities').value) || 0) +
                       (parseFloat(document.getElementById('salaries').value) || 0) +
                       (parseFloat(document.getElementById('maintenance').value) || 0),
            operatingExpenses
        };

        try {
            const response = await fetch('/save_pro_simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const res = await response.json();
            if (res.error) throw new Error(res.error);
            alert('Proyecto guardado exitosamente en tu perfil.');
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    });

    proForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather Products
        const products = [];
        productsTable.querySelectorAll('tr').forEach(row => {
            products.push({
                name: row.querySelector('.prod-name').value,
                quantity: parseFloat(row.querySelector('.prod-qty').value) || 0,
                price: parseFloat(row.querySelector('.prod-price').value) || 0,
                cost_unit: parseFloat(row.querySelector('.prod-cost').value) || 0
            });
        });

        if (products.length === 0) {
            alert('Por favor agrega al menos un producto o servicio.');
            return;
        }

        // Gather Expenses
        const fixedCosts = (parseFloat(document.getElementById('rent').value) || 0) +
                           (parseFloat(document.getElementById('utilities').value) || 0) +
                           (parseFloat(document.getElementById('salaries').value) || 0) +
                           (parseFloat(document.getElementById('maintenance').value) || 0);

        const operatingExpenses = {
            marketing: parseFloat(document.getElementById('marketing').value) || 0,
            transport: parseFloat(document.getElementById('transport').value) || 0,
            imprevistos: parseFloat(document.getElementById('imprevistos').value) || 0,
            internet: parseFloat(document.getElementById('internet').value) || 0
        };

        const creditInfo = {
            amount: parseFloat(document.getElementById('credit-amount').value) || 0,
            rate: parseFloat(document.getElementById('credit-rate').value) || 0,
            term: parseInt(document.getElementById('credit-term').value) || 0
        };

        const payload = {
            products,
            fixedCosts,
            operatingExpenses,
            creditInfo
        };

        try {
            const response = await fetch('/calculate_pro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const results = await response.json();
            if (results.error) throw new Error(results.error);

            // Mapping for results injection
            results.fixedCosts = fixedCosts;

            renderResults(results);
            renderChart(results.projections);
            renderProjectionsTable(results.projections);
            
            resultsDiv.style.display = 'block';
            projectionsDiv.style.display = 'block';
            
            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error(error);
            alert('Error al calcular: ' + error.message);
        }
    });

    function renderResults(res) {
        const marginClasses = {
            'saludable': 'alert-saludable',
            'normal': 'alert-normal',
            'precaución': 'alert-precaucion',
            'crítico': 'alert-critico'
        };

        resultsDiv.innerHTML = `
            <h4 style="margin-bottom: 2rem;">Resultados de Proyección</h4>
            
            <div class="alert-dashboard">
                <div class="alert-card ${res.netProfit < 0 ? 'alert-negativo' : 'alert-saludable'}">
                    <small>Utilidad Neta <span class="help-icon" data-concept="utilidad-neta" style="background: rgba(255,255,255,0.2);">?</span></small>
                    <div style="font-size: 1.5rem;">${formatCurrency(res.netProfit)}</div>
                    <small>${res.profitStatus}</small>
                </div>
                <div class="alert-card ${marginClasses[res.marginStatus] || 'alert-normal'}">
                    <small>Margen Neto <span class="help-icon" data-concept="margen-ganancia" style="background: rgba(255,255,255,0.2);">?</span></small>
                    <div style="font-size: 1.5rem;">${res.margin}%</div>
                    <small>${res.marginStatus.toUpperCase()}</small>
                </div>
                <div class="alert-card ${res.cashFlow < 0 ? 'alert-negativo' : 'alert-saludable'}">
                    <small>Flujo de Caja <span class="help-icon" data-concept="flujo-caja" style="background: rgba(255,255,255,0.2);">?</span></small>
                    <div style="font-size: 1.5rem;">${formatCurrency(res.cashFlow)}</div>
                    <small>${res.cashFlow >= 0 ? 'Líquido' : 'Crítico'}</small>
                </div>
            </div>

            <div class="results-grid">
                <div class="result-item">
                    <h5>Resumen de Operación</h5>
                    <table class="results-table">
                        <tr><td>Ingresos Totales:</td><td>${formatCurrency(res.totalRevenue)}</td></tr>
                        <tr><td>Costos Variables:</td><td>${formatCurrency(res.totalVariableCosts)}</td></tr>
                        <tr><td>Utilidad Bruta:</td><td>${formatCurrency(res.grossProfit)}</td></tr>
                        <tr><td>Costos Fijos:</td><td>${formatCurrency(res.fixedCosts)}</td></tr>
                        <tr><td>Gastos Operativos:</td><td>${formatCurrency(res.totalOperating)}</td></tr>
                        <tr><td>Cuota Crédito:</td><td>${formatCurrency(res.creditPayment)}</td></tr>
                        <tr><td><strong>Punto Equilibrio:</strong></td><td><strong>${res.breakEven === "N/A" ? "N/A" : formatCurrency(res.breakEven)}</strong></td></tr>
                    </table>
                </div>
                <div class="result-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h5>Estructura de Gastos</h5>
                    <canvas id="costStructureChart" width="250" height="250"></canvas>
                </div>
            </div>
        `;
        
        // Render Pie Chart for Pro
        setTimeout(() => {
            const ctx = document.getElementById('costStructureChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['C. Variables', 'C. Fijos', 'Gastos Op.', 'Crédito'],
                    datasets: [{
                        data: [res.totalVariableCosts, res.fixedCosts, res.totalOperating, res.creditPayment],
                        backgroundColor: ['#e67e22', '#3498db', '#9b59b6', '#f1c40f']
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }, 100);
    }

    function renderChart(projections) {
        const ctx = document.getElementById('cashflow-chart').getContext('2d');
        
        if (cashFlowChart) cashFlowChart.destroy();

        const labels = projections.map(p => `Mes ${p.month}`);
        const data = projections.map(p => p.cashFlow);

        cashFlowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Flujo de Caja Mensual',
                    data: data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    function renderProjectionsTable(projections) {
        const table = document.getElementById('projections-table');
        let html = `
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Ingresos</th>
                    <th>Egresos Totales</th>
                    <th>Utilidad</th>
                    <th>Flujo de Caja</th>
                </tr>
            </thead>
            <tbody>
        `;

        projections.forEach(p => {
            html += `
                <tr>
                    <td>Mes ${p.month}</td>
                    <td>${formatCurrency(p.revenue)}</td>
                    <td>${formatCurrency(p.costs)}</td>
                    <td class="${p.profit < 0 ? 'text-danger' : ''}">${formatCurrency(p.profit)}</td>
                    <td class="${p.cashFlow < 0 ? 'text-danger' : ''}">${formatCurrency(p.cashFlow)}</td>
                </tr>
            `;
        });

        html += '</tbody>';
        table.innerHTML = html;
    }

    // Add initial product row
    addProductBtn.click();
});
