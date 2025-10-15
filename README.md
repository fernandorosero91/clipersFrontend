# Frontend - Clippers

Un frontend minimalista para la plataforma de reclutamiento Clippers.

## Estructura del Proyecto

```
frontend/
├── css/
│   └── styles.css          # Estilos CSS del frontend
├── js/
│   └── app.js             # Lógica JavaScript del frontend
├── images/                # Directorio para imágenes (vacío)
├── index.html             # Página principal del frontend
├── .gitignore             # Archivos a ignorar en Git
└── README.md              # Este archivo
```

## Características

- Diseño minimalista y responsive
- Conexión con la API del backend
- Sección de prueba de conexión con el backend
- Navegación intuitiva
- Compatible con todos los navegadores modernos

## Configuración

### URL del Backend

La configuración de la URL del backend está en `js/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

Si necesitas cambiar la URL del backend, modifica esta variable.

## Uso

### Desarrollo Local (Backend + Frontend)

#### Método 1: Script Automatizado (Recomendado)
1. **Haz doble clic en `start-both-robust.bat`**
   - Este script verifica que Java y Node.js estén instalados
   - Inicia ambos servicios con los tiempos de espera adecuados
   - Abre las terminales necesarias para cada servicio

2. **Abre el navegador** en http://localhost:9000
3. **Prueba la conexión** haciendo clic en "Probar API"

#### Método 2: Inicio Manual
1. **Inicia el backend de Spring Boot**:
   ```bash
   cd clipersBackend
   mvn spring-boot:run
   ```
   - Espera a que veas el mensaje "Started ClippersApplication" en la consola
   - Verifica que http://localhost:8080/swagger-ui.html esté accesible

2. **Inicia el frontend** (en otra terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Abre el navegador** en http://localhost:9000
4. **Prueba la conexión** haciendo clic en "Probar API"

### Solución de Problemas Comunes

#### Error: "Backend no encontrado"
- Asegúrate de que el backend esté corriendo en http://localhost:8080
- Verifica que no haya otro servicio usando el puerto 8080
- Revisa los mensajes de error en la terminal del backend

#### Error: "Error interno del servidor (500)"
- Revisa los logs del backend en la terminal
- Asegúrate de que todas las dependencias del backend estén instaladas
- Verifica que la base de datos esté configurada correctamente (si es necesario)

#### Error: "CORS"
- El backend ya está configurado para aceptar conexiones desde http://localhost:9000
- Si usas otro puerto, actualiza la configuración en WebConfig.java

### Uso Simple (Solo Frontend)

1. Abre el archivo `index.html` directamente en tu navegador
2. Haz clic en el botón "Probar API" para verificar la conexión con el backend
3. Navega por las diferentes secciones del sitio

## Despliegue

Este frontend está diseñado para ser desplegado de forma independiente del backend. Puedes:

1. Subir los archivos a un servidor estático (como GitHub Pages, Netlify, etc.)
2. Servir los archivos localmente con un servidor web simple

## Notas

- Este frontend no incluye un sistema de build, por lo que los archivos se pueden usar directamente
- No se requieren dependencias externas
- El frontend está completamente separado del backend y puede ser desplegado independientemente

## Contribución

Este es un proyecto minimalista, por lo que las contribuciones deben mantener la simplicidad del diseño y la funcionalidad.

## Licencia

© 2024 Clippers. Todos los derechos reservados.