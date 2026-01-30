document.addEventListener('DOMContentLoaded', () => {
    const creditForm = document.getElementById('credit-only-form');
    const resultsDiv = document.getElementById('credit-results');
    const amortizationTable = document.getElementById('amortization-table').querySelector('tbody');
    const clearBtn = document.getElementById('clear-credit');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (creditForm) {
        creditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const monto = parseFloat(document.getElementById('monto').value);
            const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
            const plazo = parseInt(document.getElementById('plazo').value);
            const tipoAmortizacion = document.getElementById('tipo-amortizacion').value;
            
            if (isNaN(monto) || monto <= 0 || isNaN(tasaAnual) || isNaN(plazo) || plazo <= 0) {
                alert('Por favor completa todos los campos con valores válidos.');
                return;
            }

            const tasaMensual = tasaAnual / 12;
            let totalPagar = 0;
            let totalIntereses = 0;
            
            // Build amortization table
            amortizationTable.innerHTML = '';
            let saldo = monto;
            
            if (tipoAmortizacion === 'francesa') {
                const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
                document.getElementById('res-cuota').textContent = formatCurrency(cuota);
                
                for (let i = 1; i <= plazo; i++) {
                    const interesMes = saldo * tasaMensual;
                    const capitalMes = cuota - interesMes;
                    const saldoFinal = Math.max(0, saldo - capitalMes);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="text-align:center">${i}</td>
                        <td style="text-align:right">${formatCurrency(saldo)}</td>
                        <td style="text-align:right">${formatCurrency(cuota)}</td>
                        <td style="text-align:right">${formatCurrency(interesMes)}</td>
                        <td style="text-align:right">${formatCurrency(capitalMes)}</td>
                        <td style="text-align:right">${formatCurrency(saldoFinal)}</td>
                    `;
                    amortizationTable.appendChild(row);
                    
                    totalIntereses += interesMes;
                    saldo = saldoFinal;
                }
                totalPagar = monto + totalIntereses;
            } else {
                // Alemana: Abono a capital fijo
                const capitalFijo = monto / plazo;
                document.getElementById('res-cuota').textContent = 'Variable'; // UI will show "Variable" or range
                
                let primeraCuota = 0;
                for (let i = 1; i <= plazo; i++) {
                    const interesMes = saldo * tasaMensual;
                    const cuotaMes = capitalFijo + interesMes;
                    const saldoFinal = Math.max(0, saldo - capitalFijo);
                    
                    if (i === 1) primeraCuota = cuotaMes;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="text-align:center">${i}</td>
                        <td style="text-align:right">${formatCurrency(saldo)}</td>
                        <td style="text-align:right">${formatCurrency(cuotaMes)}</td>
                        <td style="text-align:right">${formatCurrency(interesMes)}</td>
                        <td style="text-align:right">${formatCurrency(capitalFijo)}</td>
                        <td style="text-align:right">${formatCurrency(saldoFinal)}</td>
                    `;
                    amortizationTable.appendChild(row);
                    
                    totalIntereses += interesMes;
                    saldo = saldoFinal;
                }
                totalPagar = monto + totalIntereses;
                document.getElementById('res-cuota').textContent = formatCurrency(primeraCuota) + '...'; // Indicar que decrece
            }
            
            // Display Alert Cards
            document.getElementById('res-total').textContent = formatCurrency(totalPagar);
            document.getElementById('res-intereses').textContent = formatCurrency(totalIntereses);
            
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('¿Limpiar datos del simulador?')) {
                creditForm.reset();
                resultsDiv.style.display = 'none';
                amortizationTable.innerHTML = '';
            }
        });
    }
});
