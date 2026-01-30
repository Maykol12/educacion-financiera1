// Basic JavaScript for navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Modal logic
    const modal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && closeModal) {
        closeModal.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Concept definitions for tooltips
    const HELP_CONCEPTS = {
        'nombre': {
            title: 'Nombre del Emprendimiento',
            body: 'Es el nombre comercial de tu negocio. Ayuda a identificar tu proyecto en los reportes.'
        },
        'sector': {
            title: 'Sector Económico',
            body: 'La categoría a la que pertenece tu negocio. Esto puede influir en los tipos de costos que manejes.'
        },
        'mes': {
            title: 'Mes de Análisis',
            body: 'El periodo de tiempo que estás simulando. Útil para comparar diferentes meses del año.'
        },
        'ingresos': {
            title: 'Ingresos Mensuales',
            body: 'Todo el dinero que entra a tu negocio por ventas.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Ingresos = Unidades Vendidas × Precio Unitario</code>'
        },
        'costos-fijos': {
            title: 'Costos Fijos',
            body: 'Gastos que debes pagar sin importar cuánto vendas (ej: alquiler, internet, sueldos fijos). No cambian con tu nivel de producción.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Total Fijo = Alquiler + Servicios + Seguros + Salarios</code>'
        },
        'costos-variables': {
            title: 'Costos Variables',
            body: 'Gastos que dependen directamente de tus ventas o producción. Si vendes más, estos aumentan.<br><br><b>Fórmula (por porcentaje):</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">C. Variable = Ingresos × % Costo Variable</code>'
        },
        'gastos': {
            title: 'Gastos Operativos',
            body: 'Costos indirectos que ayudan a que el negocio funcione pero no son materia prima ni costos fijos de local.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Gastos = Publicidad + Transporte + Otros</code>'
        },
        'escenarios': {
            title: 'Análisis de Escenarios',
            body: 'Simula qué pasaría si las condiciones cambian. Te ayuda a estar preparado para riesgos o identificar oportunidades.'
        },
        'credito-monto': {
            title: 'Monto del Crédito',
            body: 'El capital total que solicitas prestado. Este monto afectará tu flujo de caja mensual por el pago de cuotas.'
        },
        'credito-tasa': {
            title: 'Tasa de Interés',
            body: 'El porcentaje anual que el banco te cobra por el préstamo.<br><br><b>Fórmula Mensual:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Tasa Mensual = Tasa Anual / 12</code>'
        },
        'credito-plazo': {
            title: 'Plazo (Meses)',
            body: 'El tiempo total que tienes para devolver el préstamo. A mayor plazo, las cuotas son menores pero terminas pagando más intereses.'
        },
        'credito-amortizacion': {
            title: 'Tipo de Amortización',
            body: '<b>Sistema Francés:</b> Las cuotas son fijas durante todo el crédito. Al principio pagas más intereses y al final más capital.<br><br><b>Sistema Alemán:</b> Pagas una cantidad fija de capital cada mes. Las cuotas son mayores al inicio y van disminuyendo con el tiempo.'
        },
        'utilidad-bruta': {
            title: 'Utilidad Bruta',
            body: 'Ganancia obtenida tras descontar los costos directos de venta.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">U. Bruta = Ingresos − Costos Variables</code>'
        },
        'utilidad-neta': {
            title: 'Utilidad Neta',
            body: 'La ganancia real final que queda para el dueño del negocio.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">U. Neta = U. Bruta − C. Fijos − Gastos</code>'
        },
        'flujo-caja': {
            title: 'Flujo de Caja',
            body: 'Dinero en efectivo disponible al final del mes. A diferencia de la utilidad, este considera el pago de cuotas de crédito.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Flujo = Ingresos − Egresos Totales</code>'
        },
        'punto-equilibrio': {
            title: 'Punto de Equilibrio',
            body: 'El nivel de ventas necesario para que los ingresos sean iguales a los costos (ni ganas ni pierdes).<br><br><b>Fórmula Simplificada:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">PE = Costos Fijos / Margen de Contribución</code>'
        },
        'margen-ganancia': {
            title: 'Margen de Ganancia',
            body: 'Porcentaje de los ingresos que se convierte en utilidad neta.<br><br><b>Fórmula:</b><br><code style="background:#eee; padding:2px 5px; border-radius:3px;">Margen % = (Utilidad Neta / Ingresos) × 100</code>'
        }
    };

    // Global listener for help icons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('help-icon')) {
            const conceptId = e.target.getAttribute('data-concept');
            const concept = HELP_CONCEPTS[conceptId];
            if (concept) {
                document.getElementById('modal-title').textContent = concept.title;
                document.getElementById('modal-body').innerHTML = concept.body;
                document.getElementById('help-modal').style.display = "block";
            }
            
            // Mark as viewed if it belongs to a concept card
            const card = e.target.closest('.concept-card');
            if (card) {
                const dbId = card.getAttribute('data-concept-id');
                if (dbId) markConceptViewed(dbId, card);
            }
        }
    });

    // Mark concept viewed on clicking the card too
    document.querySelectorAll('.concept-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Only if not already completed and clicked part wasn't the icon (handled above)
            if (!this.classList.contains('completed') && !e.target.classList.contains('help-icon')) {
                const dbId = this.getAttribute('data-concept-id');
                if (dbId) markConceptViewed(dbId, this);
            }
        });
    });

    function markConceptViewed(id, element) {
        if (typeof IS_AUTHENTICATED === 'undefined' || !IS_AUTHENTICATED) return;
        
        fetch(`/mark_concept_completed/${id}`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    element.classList.add('completed');
                    if (!element.querySelector('.badge-success')) {
                        const h4 = element.querySelector('h4');
                        h4.insertAdjacentHTML('beforeend', '<span class="badge badge-success" style="float: right; font-size: 0.7rem;">✔ Visto</span>');
                    }
                }
            });
    }

    // Smooth scrolling for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('case-opt')) {
            const btn = e.target;
            const caseId = btn.getAttribute('data-case');
            const opt = btn.getAttribute('data-opt');
            const feedbackVal = btn.getAttribute('data-feedback');
            const feedbackDiv = document.getElementById(`feedback-${caseId}`);
            
            if (feedbackDiv) {
                feedbackDiv.innerHTML = `<p style="margin-top: 1rem; color: #27ae60; font-weight: bold;">Seleccionaste ${opt}: ${feedbackVal}</p>`;
                feedbackDiv.classList.add('visible');
                
                // Highlight button
                const siblings = btn.parentElement.querySelectorAll('.case-opt');
                siblings.forEach(s => {
                    s.classList.remove('btn-success');
                    s.classList.add('btn-secondary');
                });
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-success');

                // Mark as completed in DB
                if (typeof IS_AUTHENTICATED !== 'undefined' && IS_AUTHENTICATED) {
                    fetch(`/mark_case_completed/${caseId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ option: opt })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            const card = document.getElementById(`case-${caseId}`);
                            if (card && !card.classList.contains('completed')) {
                                card.classList.add('completed');
                                const h4 = card.querySelector('h4');
                                h4.insertAdjacentHTML('beforeend', '<span class="badge badge-success" style="float: right; font-size: 0.7rem;">✔ Resuelto</span>');
                            }
                        }
                    });
                }
            }
        }
    });

    // Only run simulador-specific code if on simulador page
    if (document.getElementById('business-form')) {
        initSimulador();
    }

    // --- TUTORIAL LOGIC ---
    const tutorialBtn = document.getElementById('start-tutorial-btn');
    if (tutorialBtn) {
        tutorialBtn.addEventListener('click', () => {
            const steps = [
                { title: "¡Bienvenido! ✨", body: "Esta guía rápida te enseñará a usar el simulador. Primero: llena los datos básicos de tu negocio." },
                { title: "Costos Fijos 🏠", body: "No olvides incluir el alquiler y los servicios, aunque no vendas nada este mes." },
                { title: "Costos Variables 📦", body: "Aquí va lo que te cuesta producir cada unidad. Puedes usar un porcentaje de tus ingresos." },
                { title: "Resultados 📊", body: "Al presionar 'Calcular', verás gráficos y alertas de salud financiera abajo." },
                { title: "Escenarios 🔮", body: "Usa la sección de escenarios para ver qué pasa si suben los costos o si pides un préstamo." }
            ];
            
            let currentStep = 0;
            
            const showStep = (idx) => {
                document.getElementById('modal-title').textContent = steps[idx].title;
                document.getElementById('modal-body').innerHTML = `
                    <p>${steps[idx].body}</p>
                    <div style="margin-top: 20px; text-align: right;">
                        ${idx < steps.length - 1 ? `<button class="btn-primary" id="next-step">Siguiente</button>` : `<button class="btn-secondary" onclick="document.getElementById('help-modal').style.display='none'">Finalizar</button>`}
                    </div>
                `;
                document.getElementById('help-modal').style.display = "block";
                
                const nextBtn = document.getElementById('next-step');
                if (nextBtn) {
                    nextBtn.onclick = () => showStep(idx + 1);
                }
            };
            
            showStep(0);
        });
    }
});

function initSimulador() {
    const form = document.getElementById('business-form');
    const clearBtn = document.getElementById('clear-btn');
    const newSimulationBtn = document.getElementById('new-simulation-btn');
    const saveBtn = document.getElementById('save-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resultsDiv = document.getElementById('results');

    // Calculate total fixed costs dynamically
    const fixedInputs = ['rent', 'utilities', 'insurance', 'salaries'];
    fixedInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateTotalFixed);
    });

    // Handle variable cost type change
    document.querySelectorAll('input[name="variable-type"]').forEach(radio => {
        radio.addEventListener('change', updateVariableHelp);
    });

    // Real-time calculation on input changes
    const realTimeInputs = [
        'business-name', 'sector', 'month', 'income', 
        'rent', 'utilities', 'insurance', 'salaries', 
        'variable-costs', 'expenses'
    ];
    realTimeInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', performRealTimeCalculation);
            element.addEventListener('change', performRealTimeCalculation);
        }
    });
    // Also listen for radio button changes
    document.querySelectorAll('input[name="variable-type"]').forEach(radio => {
        radio.addEventListener('change', performRealTimeCalculation);
    });

    // New Simulation
    if (newSimulationBtn) {
        newSimulationBtn.addEventListener('click', function() {
            if (confirm('¿Crear nueva simulación? Se perderán los datos actuales.')) {
                form.reset();
                resultsDiv.style.display = 'none';
                document.getElementById('scenarios').style.display = 'none';
                localStorage.removeItem('businessData');
                updateTotalFixed();
                updateVariableHelp();
            }
        });
    }

    // Save
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const data = getFormData();
            if (data) {
                // Always save to localStorage
                localStorage.setItem('businessData', JSON.stringify(data));
                
                // If authenticated, also save to DB
                if (typeof IS_AUTHENTICATED !== 'undefined' && IS_AUTHENTICATED) {
                    fetch('/save_simulation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.message) {
                            alert('Simulación guardada en tu perfil exitosamente.');
                        } else {
                            alert('Guardado localmente (error al sincronizar con el perfil).');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Simulación guardada localmente.');
                    });
                } else {
                    alert('Simulación guardada localmente. ¡Inicia sesión para guardarla en tu perfil!');
                }
            }
        });
    }

    // Clear
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('¿Limpiar todos los datos?')) {
                form.reset();
                resultsDiv.style.display = 'none';
                document.getElementById('scenarios').style.display = 'none';
                localStorage.removeItem('businessData');
                updateTotalFixed();
                updateVariableHelp();
            }
        });
    }

    // Download
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const data = JSON.parse(localStorage.getItem('businessData'));
            if (data) {
                fetch('/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        alert('Error: ' + result.error);
                    } else {
                        exportToPDF(data, result);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al generar reporte.');
                });
            } else {
                alert('No hay datos guardados para descargar.');
            }
        });
    }

    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        
        const data = getFormData();
        if (data) {
            // Provide immediate feedback
            resultsDiv.innerHTML = '<div style="text-align:center; padding: 2rem;"><p>Calculando resultados... ⏳</p></div>';
            resultsDiv.style.display = 'block';

            // Save to localStorage
            localStorage.setItem('businessData', JSON.stringify(data));

            // Calculate via API
            fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert('Error en el cálculo: ' + result.error);
                } else {
                    displayResults(data, result);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor.');
            });
        }
    });

    // Scenario handling
    document.getElementById('apply-cost-scenario').addEventListener('click', function() {
        applyScenario('cost', parseFloat(document.getElementById('cost-increase').value) / 100);
    });

    document.getElementById('apply-sales-scenario').addEventListener('click', function() {
        applyScenario('sales', parseFloat(document.getElementById('sales-decrease').value) / 100);
    });

    document.getElementById('apply-price-scenario').addEventListener('click', function() {
        applyScenario('price', parseFloat(document.getElementById('price-increase').value) / 100);
    });

    document.getElementById('apply-credit-scenario').addEventListener('click', function() {
        applyScenario('credit', 0); // factor not used for credit type
    });

    document.getElementById('save-scenario-1').addEventListener('click', function() {
        saveComparisonScenario(1);
    });

    document.getElementById('save-scenario-2').addEventListener('click', function() {
        saveComparisonScenario(2);
    });

    document.getElementById('reset-scenario').addEventListener('click', function() {
        document.getElementById('cost-increase').value = 0;
        document.getElementById('sales-decrease').value = 0;
        document.getElementById('price-increase').value = 0;
        document.getElementById('credit-amount').value = 0;
        document.getElementById('scenario-results').innerHTML = '';
        currentScenarioData = null;
    });

    // Load data from localStorage on page load
    const savedData = localStorage.getItem('businessData');
    if (savedData) {
        const data = JSON.parse(savedData);
        populateForm(data);
        // Auto-calculate if data exists
        fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => displayResults(data, result))
        .catch(console.error);
    }

    // Initialize
    updateTotalFixed();
    updateVariableHelp();
}

function updateTotalFixed() {
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const utilities = parseFloat(document.getElementById('utilities').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;
    const salaries = parseFloat(document.getElementById('salaries').value) || 0;
    const total = rent + utilities + insurance + salaries;
    document.getElementById('total-fixed').textContent = total.toFixed(2);
}

function updateVariableHelp() {
    const radios = document.querySelectorAll('input[name="variable-type"]');
    if (radios.length === 0) return;
    
    const type = document.querySelector('input[name="variable-type"]:checked').value;
    const help = document.getElementById('variable-help');
    if (help) {
        if (type === 'percentage') {
            help.textContent = 'Ej: Comisión de venta, regalías (% del ingreso)';
        } else {
            help.textContent = 'Ej: Materia prima, insumos (cantidad fija)';
        }
    }
}

function performRealTimeCalculation() {
    const data = getFormData();
    if (data && data.name && data.sector && data.month && data.income >= 0) {
        // Show subtle loading if results are not yet visible
        const resultsDiv = document.getElementById('results');
        if (resultsDiv.style.display === 'none') {
            // resultsDiv.innerHTML = '<p style="text-align:center;">Analizando datos...</p>';
            // resultsDiv.style.display = 'block';
        }

        // Only calculate if we have minimum required data
        fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                displayResults(data, result);
            }
        })
        .catch(console.error);
    }
}

function getFormData() {
    const data = {
        name: document.getElementById('business-name').value.trim(),
        sector: document.getElementById('sector').value,
        month: document.getElementById('month').value,
        income: parseFloat(document.getElementById('income').value),
        fixedCosts: parseFloat(document.getElementById('total-fixed').textContent),
        variableCosts: parseFloat(document.getElementById('variable-costs').value),
        variableType: document.querySelector('input[name="variable-type"]:checked').value,
        expenses: parseFloat(document.getElementById('expenses').value),
        // Individual fixed costs
        rent: parseFloat(document.getElementById('rent').value) || 0,
        utilities: parseFloat(document.getElementById('utilities').value) || 0,
        insurance: parseFloat(document.getElementById('insurance').value) || 0,
        salaries: parseFloat(document.getElementById('salaries').value) || 0
    };

    // Validation
    let isValid = true;

    if (!data.name) {
        showError('business-name', 'El nombre del emprendimiento es obligatorio.');
        isValid = false;
    }

    if (!data.sector) {
        showError('sector', 'Debe seleccionar un sector.');
        isValid = false;
    }

    if (!data.month) {
        showError('month', 'Debe seleccionar un mes de análisis.');
        isValid = false;
    }

    if (isNaN(data.income) || data.income < 0) {
        showError('income', 'Los ingresos deben ser un número positivo.');
        isValid = false;
    }

    if (data.fixedCosts < 0) {
        showError('fixed-costs', 'Los costos fijos deben ser positivos.');
        isValid = false;
    }

    if (isNaN(data.variableCosts) || data.variableCosts < 0) {
        showError('variable-costs', 'Los costos variables deben ser un número positivo.');
        isValid = false;
    }

    if (data.variableType === 'percentage' && data.variableCosts > 100) {
        showError('variable-costs', 'El porcentaje no puede ser mayor a 100%.');
        isValid = false;
    }

    if (isNaN(data.expenses) || data.expenses < 0) {
        showError('expenses', 'Los gastos operativos deben ser un número positivo.');
        isValid = false;
    }

    return isValid ? data : null;
}

function showError(fieldId, message) {
    const errorEl = document.getElementById('error-' + fieldId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function populateForm(data) {
    document.getElementById('business-name').value = data.name;
    document.getElementById('sector').value = data.sector;
    document.getElementById('month').value = data.month;
    document.getElementById('income').value = data.income;
    document.getElementById('rent').value = data.rent || 0;
    document.getElementById('utilities').value = data.utilities || 0;
    document.getElementById('insurance').value = data.insurance || 0;
    document.getElementById('salaries').value = data.salaries || 0;
    const varType = document.querySelector(`input[name="variable-type"][value="${data.variableType || 'fixed'}"]`);
    if (varType) varType.checked = true;
    document.getElementById('variable-costs').value = data.variableCosts;
    document.getElementById('expenses').value = data.expenses;
    updateTotalFixed();
    updateVariableHelp();
}

let currentScenarioData = null;
let savedScenarios = { 1: null, 2: null };

function applyScenario(type, factor) {
    const baseData = JSON.parse(localStorage.getItem('businessData'));
    if (!baseData) return;

    let scenarioData = { ...baseData };

    if (type === 'cost') {
        scenarioData.rent *= (1 + factor);
        scenarioData.utilities *= (1 + factor);
        scenarioData.insurance *= (1 + factor);
        scenarioData.salaries *= (1 + factor);
        scenarioData.variableCosts *= (1 + factor);
        scenarioData.expenses *= (1 + factor);
    } else if (type === 'sales') {
        scenarioData.income *= (1 - factor);
    } else if (type === 'price') {
        scenarioData.income *= (1 + factor);
    } else if (type === 'credit') {
        scenarioData.creditAmount = parseFloat(document.getElementById('credit-amount').value) || 0;
        scenarioData.creditRate = parseFloat(document.getElementById('credit-rate').value) || 0;
        scenarioData.creditTerm = parseInt(document.getElementById('credit-term').value) || 1;
    }

    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenarioData)
    })
    .then(response => response.json())
    .then(result => {
        currentScenarioData = { data: scenarioData, result: result, type: type, factor: factor };
        displayScenarioResults(baseData, scenarioData, result, type, factor);
    })
    .catch(console.error);
}

function saveComparisonScenario(slot) {
    if (!currentScenarioData) {
        alert('Primero aplica un escenario para guardarlo.');
        return;
    }
    savedScenarios[slot] = { ...currentScenarioData };
    updateComparisonTable();
    alert(`Escenario guardado en el Espacio ${slot}`);
}

function updateComparisonTable() {
    const baseData = JSON.parse(localStorage.getItem('businessData'));
    if (!baseData) return;

    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseData)
    })
    .then(response => response.json())
    .then(baseCalc => {
        const comparisonDiv = document.getElementById('scenario-comparison');
        
        let html = `
            <h5>Comparación Lado a Lado</h5>
            <div class="comparison-grid">
                <div class="comparison-column">
                    <h6>Base</h6>
                    <p>Utilidad Neta: $${baseCalc.netProfit.toFixed(2)}</p>
                    <p>Flujo Caja: $${baseCalc.cashFlow.toFixed(2)}</p>
                    <p>PE: $${baseCalc.breakEven}</p>
                </div>
        `;

        [1, 2].forEach(slot => {
            if (savedScenarios[slot]) {
                const scen = savedScenarios[slot];
                html += `
                    <div class="comparison-column">
                        <h6>Escenario ${slot}</h6>
                        <p>Utilidad Neta: $${scen.result.netProfit.toFixed(2)}</p>
                        <p>Flujo Caja: $${scen.result.cashFlow.toFixed(2)}</p>
                        <p>PE: $${scen.result.breakEven}</p>
                        <small>${scen.type === 'credit' ? 'Simulación Crédito' : 'Eco: ' + (scen.factor*100).toFixed(0) + '%'}</small>
                    </div>
                `;
            } else {
                html += `
                    <div class="comparison-column empty">
                        <h6>Espacio ${slot}</h6>
                        <p>Vacio</p>
                    </div>
                `;
            }
        });

        html += `</div>`;
        comparisonDiv.innerHTML = html;
    })
    .catch(console.error);
}

function displayScenarioResults(baseData, scenarioData, calc, type, factor) {
    // Get base calculation first
    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseData)
    })
    .then(response => response.json())
    .then(baseCalc => {
        const scenarioResults = document.getElementById('scenario-results');
        const scenarioName = type === 'cost' ? `Aumento de costos ${(factor * 100).toFixed(0)}%` :
                            type === 'sales' ? `Disminución de ventas ${(factor * 100).toFixed(0)}%` :
                            type === 'price' ? `Aumento de precio ${(factor * 100).toFixed(0)}%` :
                            `Simulación de Crédito`;

        let extraInfo = '';
        if (type === 'credit' && calc.creditPayment > 0) {
            extraInfo = `<p>Cuota mensual estimada: <strong>$${calc.creditPayment.toFixed(2)}</strong></p>`;
        }

        scenarioResults.innerHTML = `
            <h5>Escenario Actual: ${scenarioName}</h5>
            ${extraInfo}
            <table class="results-table">
                <tr><td>Utilidad Neta Base:</td><td>$${baseCalc.netProfit.toFixed(2)}</td></tr>
                <tr><td>Utilidad Neta Escenario:</td><td>$${calc.netProfit.toFixed(2)}</td></tr>
                <tr><td>Flujo de Caja Escenario:</td><td>$${calc.cashFlow.toFixed(2)}</td></tr>
                <tr><td>Diferencia Utilidad:</td><td>$${(calc.netProfit - baseCalc.netProfit).toFixed(2)}</td></tr>
            </table>
        `;
    })
    .catch(console.error);
}

function displayResults(data, calc) {
    const resultsDiv = document.getElementById('results');
    
    // Clear previous and show loading if needed (optional but helpful)
    // resultsDiv.innerHTML = '<p>Calculando...</p>'; 

    // Map status to CSS classes
    const marginClasses = {
        'saludable': 'alert-saludable',
        'normal': 'alert-normal',
        'precaución': 'alert-precaucion',
        'crítico': 'alert-critico'
    };
    const profitClass = calc.netProfit > 0 ? 'alert-saludable' : (calc.netProfit < 0 ? 'alert-negativo' : 'alert-normal');
    const cashFlowClass = calc.cashFlow >= 0 ? 'alert-saludable' : 'alert-negativo';

    // Break-even visual calculation
    let bePercent = 0;
    if (calc.breakEven !== 'N/A' && data.income > 0) {
        bePercent = (data.income / calc.breakEven) * 100;
        if (bePercent > 100) bePercent = 100;
    }

    resultsDiv.innerHTML = `
        <h4>Resultados Financieros</h4>
        
        <div class="alert-dashboard">
            <div class="alert-card ${profitClass}">
                <small>Utilidad Neta <span class="help-icon" data-concept="utilidad-neta" style="background: rgba(255,255,255,0.2);">?</span></small>
                <div>$${calc.netProfit.toFixed(2)}</div>
                <small>${calc.profitStatus}</small>
            </div>
            <div class="alert-card ${marginClasses[calc.marginStatus] || ''}">
                <small>Margen de Ganancia <span class="help-icon" data-concept="margen-ganancia" style="background: rgba(255,255,255,0.2);">?</span></small>
                <div>${calc.margin.toFixed(2)}%</div>
                <small>${calc.marginStatus.toUpperCase()}</small>
            </div>
            <div class="alert-card ${cashFlowClass}">
                <small>Flujo de Caja <span class="help-icon" data-concept="flujo-caja" style="background: rgba(255,255,255,0.2);">?</span></small>
                <div>$${calc.cashFlow.toFixed(2)}</div>
                <small>${calc.cashFlow >= 0 ? 'Líquido' : 'Crítico'}</small>
            </div>
        </div>

        <div class="results-grid">
            <div class="result-item">
                <h5>Resumen Detallado</h5>
                <table class="results-table">
                    <tr><td>Ingresos:</td><td>$${data.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Costos Fijos:</td><td>$${calc.fixedCosts.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Costos Variables:</td><td>$${calc.variableCosts.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Gastos:</td><td>$${data.expenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                    <tr><td><strong>Utilidad Bruta <span class="help-icon" data-concept="utilidad-bruta">?</span>:</strong></td><td><strong>$${calc.grossProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td></tr>
                    <tr><td><strong>Utilidad Neta <span class="help-icon" data-concept="utilidad-neta">?</span>:</strong></td><td><strong>$${calc.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td></tr>
                    <tr><td><strong>Flujo de Caja <span class="help-icon" data-concept="flujo-caja">?</span>:</strong></td><td><strong>$${calc.cashFlow.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td></tr>
                    <tr><td><strong>Punto de Equilibrio <span class="help-icon" data-concept="punto-equilibrio">?</span>:</strong></td><td><strong>${calc.breakEven === 'N/A' ? 'N/A' : '$' + calc.breakEven.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td></tr>
                </table>

                <div class="be-indicator-section">
                    <h5>Meta Punto de Equilibrio</h5>
                    <div class="be-indicator-container">
                        <div class="be-marker" style="left: 100%;"></div>
                        <div class="be-label" style="left: 100%;">Meta PE</div>
                        <div class="be-progress-bar" style="width: ${bePercent}%"></div>
                    </div>
                    <p style="text-align: center; margin-top: 10px;">
                        ${bePercent >= 100 ? '✅ ¡Has superado el punto de equilibrio!' : `Estás al ${bePercent.toFixed(0)}% de cubrir todos tus costos.`}
                    </p>
                </div>
            </div>
            <div class="result-item">
                <h5>Visualización Gráfica</h5>
                <canvas id="incomeChart" width="300" height="200"></canvas>
                <div style="margin-top: 20px;">
                    <canvas id="costChart" width="300" height="200"></canvas>
                </div>
            </div>
        </div>
        <div class="result-item full-width educational-tips">
            <h5>Recomendaciones Estratégicas</h5>
            <div id="strat-tips">
                ${getEducationalTips(data, calc)}
            </div>
        </div>
        <div class="result-item full-width export-buttons" style="margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
            <h5>Exportar Reporte</h5>
            <button id="export-pdf" class="btn-secondary"><i class="fas fa-file-pdf"></i> PDF</button>
            <button id="export-excel" class="btn-secondary"><i class="fas fa-file-excel"></i> Excel</button>
            <button id="print-report" class="btn-secondary"><i class="fas fa-print"></i> Imprimir</button>
        </div>
    `;
    resultsDiv.style.display = 'block';
    
    // Show scenarios
    document.getElementById('scenarios').style.display = 'block';
    
    // Create charts
    createCharts(data, calc);

    // Add export event listeners with safety checks
    const pdfBtn = document.getElementById('export-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', () => exportToPDF(data, calc));
    
    const excelBtn = document.getElementById('export-excel');
    if (excelBtn) excelBtn.addEventListener('click', () => exportToExcel(data, calc));
    
    const printBtn = document.getElementById('print-report');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
}

function createCharts(data, calc) {
    // Destroy existing charts if they exist
    if (window.incomeChart) window.incomeChart.destroy();
    if (window.costChart) window.costChart.destroy();

    // Income vs Costs chart
    const ctx1 = document.getElementById('incomeChart').getContext('2d');
    window.incomeChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Costos + Gastos'],
            datasets: [{
                label: 'Monto ($)',
                data: [data.income, calc.fixedCosts + calc.variableCosts + data.expenses],
                backgroundColor: ['#27ae60', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Ingresos vs Costos + Gastos'
                }
            }
        }
    });

    // Cost distribution pie chart
    const ctx2 = document.getElementById('costChart').getContext('2d');
    window.costChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Costos Fijos', 'Costos Variables', 'Gastos'],
            datasets: [{
                data: [calc.fixedCosts, calc.variableCosts, data.expenses],
                backgroundColor: ['#3498db', '#e67e22', '#9b59b6']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Costos'
                }
            }
        }
    });
}

function exportToPDF(data, calc) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte Financiero - Simulador', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Emprendimiento: ${data.name}`, 20, 40);
    doc.text(`Sector: ${data.sector}`, 20, 50);
    doc.text(`Mes: ${data.month}`, 20, 60);
    
    doc.text('Desglose de Costos Fijos:', 20, 80);
    doc.text(`Alquiler: $${(data.rent || 0).toFixed(2)}`, 20, 90);
    doc.text(`Servicios: $${(data.utilities || 0).toFixed(2)}`, 20, 100);
    doc.text(`Seguros: $${(data.insurance || 0).toFixed(2)}`, 20, 110);
    doc.text(`Salarios: $${(data.salaries || 0).toFixed(2)}`, 20, 120);
    
    doc.text('Resultados:', 20, 140);
    doc.text(`Ingresos: $${data.income.toFixed(2)}`, 20, 150);
    doc.text(`Total Costos Fijos: $${calc.fixedCosts.toFixed(2)}`, 20, 160);
    doc.text(`Costos Variables: $${calc.variableCosts.toFixed(2)}`, 20, 170);
    doc.text(`Gastos: $${data.expenses.toFixed(2)}`, 20, 180);
    doc.text(`Utilidad Neta: $${calc.netProfit.toFixed(2)}`, 20, 190);
    doc.text(`Flujo de Caja: $${calc.cashFlow.toFixed(2)}`, 20, 200);
    doc.text(`Punto de Equilibrio: ${calc.breakEven === 'N/A' ? 'N/A' : '$' + calc.breakEven}`, 20, 210);
    
    doc.save('reporte_financiero.pdf');
}

function exportToExcel(data, calc) {
    const ws = XLSX.utils.json_to_sheet([{
        'Emprendimiento': data.name,
        'Sector': data.sector,
        'Mes': data.month,
        'Ingresos': data.income,
        'Alquiler': data.rent || 0,
        'Servicios': data.utilities || 0,
        'Seguros': data.insurance || 0,
        'Salarios': data.salaries || 0,
        'Total Costos Fijos': calc.fixedCosts,
        'Costos Variables': calc.variableCosts,
        'Tipo Costos Variables': data.variableType || 'fixed',
        'Gastos': data.expenses,
        'Utilidad Bruta': calc.grossProfit,
        'Utilidad Neta': calc.netProfit,
        'Flujo de Caja': calc.cashFlow,
        'Punto de Equilibrio': calc.breakEven === 'N/A' ? 'N/A' : calc.breakEven,
        'Margen (%)': calc.margin
    }]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
    XLSX.writeFile(wb, 'resultados_financieros.xlsx');
}

function getEducationalTips(data, calc) {
    let tips = [];
    
    // Profitability
    if (calc.netProfit <= 0) {
        tips.push("<strong>⚠️ Supervivencia:</strong> Tu negocio tiene pérdidas. Prioriza reducir costos fijos o aumentar el precio si el mercado lo permite.");
    } else if (calc.margin < 15) {
        tips.push(`<strong>💡 Mejora de Margen:</strong> Tu rentabilidad es baja (${calc.margin.toFixed(1)}%). Intenta negociar con proveedores para bajar los costos variables.`);
    } else {
        tips.push("<strong>✅ Salud Financiera:</strong> Tienes un buen margen. Considera reinvertir parte de la utilidad en marketing para crecer.");
    }

    // Cash Flow
    if (calc.cashFlow < 0) {
        tips.push("<strong>🚨 Alerta de Liquidez:</strong> Aunque tengas utilidad, no tienes efectivo. Revisa si tus clientes te están pagando a plazos muy largos.");
    }

    // Break Even
    if (calc.breakEven !== 'N/A' && data.income < calc.breakEven) {
        const gap = calc.breakEven - data.income;
        tips.push(`<strong>📈 Meta de Ventas:</strong> Necesitas vender <strong>$${gap.toFixed(2)}</strong> adicionales para alcanzar el punto donde no pierdes ni ganas.`);
    }

    // Taxes/Savings tip
    if (calc.netProfit > 0) {
        tips.push("<strong>🏦 Provisión:</strong> Recuerda separar al menos el 10% de tu utilidad neta para imprevistos o impuestos anuales.");
    }

    return tips.map(tip => `<p>${tip}</p>`).join('');
}