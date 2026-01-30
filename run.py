from app import create_app
from setup_db import crear_base_datos # Importamos tu script de creación

app = create_app()

if __name__ == '__main__':
    crear_base_datos() # Esto creará las tablas automáticamente al iniciar
    app.run()
