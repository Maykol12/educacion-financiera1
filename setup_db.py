from app import create_app
from app.models import db, Concept, Case

app = create_app()

def seed_data():
    with app.app_context():
        db.create_all()
        
        # Seed Concepts
        if not Concept.query.first():
            concepts = [
                Concept(title="Costos Fijos", description="Gastos que no cambian sin importar el volumen de ventas (ej: alquiler, salarios fijos).", help_icon_id="costos-fijos"),
                Concept(title="Costos Variables", description="Gastos que varían según la producción o ventas (ej: materia prima, empaques).", help_icon_id="costos-variables"),
                Concept(title="Gastos Operativos", description="Gastos administrativos como publicidad, transporte, telefonía.", help_icon_id="gastos"),
                Concept(title="Utilidad Bruta", description="Ingresos menos costos variables. Indica eficiencia operativa.", help_icon_id="ingresos"),
                Concept(title="Utilidad Neta", description="Ganancia final después de todos los costos y gastos.", help_icon_id="ingresos"),
                Concept(title="Flujo de Caja", description="Dinero que entra y sale. Crucial para la liquidez del negocio.", help_icon_id="escenarios"),
                Concept(title="Punto de Equilibrio", description="Nivel de ventas donde no hay ganancia ni pérdida.", help_icon_id="escenarios"),
                Concept(title="Margen de Ganancia", description="Porcentaje de ganancia sobre ingresos. >20% saludable.", help_icon_id="escenarios")
            ]
            db.session.bulk_save_objects(concepts)
        
        # Seed Cases
        if not Case.query.first():
            cases = [
                Case(
                    title="Los costos de materia prima suben 20%",
                    description="Esta situación reduce tu utilidad bruta significativamente. ¿Qué harías?",
                    option_a="Subir precios 15%",
                    option_b="Buscar nuevos proveedores",
                    feedback_a="Subir precios puede compensar el costo, pero cuidado con perder clientes.",
                    feedback_b="Buscar nuevos proveedores es ideal para mantener márgenes sin afectar al cliente."
                ),
                Case(
                    title="Ventas caen 30% por temporada baja",
                    description="Tus costos fijos siguen ahí, pero entra menos dinero. ¿Cuál es el plan?",
                    option_a="Reducir costos variables",
                    option_b="Lanzar promoción '2x1'",
                    feedback_a="Reducir variables ayuda, pero recuerda que ya son bajos si vendes poco.",
                    feedback_b="Las promociones pueden reactivar el flujo, pero vigila no vender a pérdida."
                ),
                Case(
                    title="Flujo de caja negativo al final del mes",
                    description="No tienes suficiente dinero en efectivo para pagar todas las facturas mañana.",
                    option_a="Pedir préstamo inmediato",
                    option_b="Negociar pago con proveedores",
                    feedback_a="Un préstamo resuelve hoy, pero genera una deuda con intereses mañana.",
                    feedback_b="Negociar plazos es una práctica común que no genera deuda financiera directa."
                )
            ]
            db.session.bulk_save_objects(cases)
        
        db.session.commit()
        print("Base de datos inicializada y poblada con éxito.")

if __name__ == '__main__':
    seed_data()
