const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 9000;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Frontend corriendo en http://localhost:${PORT}`);
    console.log(`Backend esperando en http://localhost:8082`);
    console.log('Puedes probar la conexión entre ambos haciendo clic en "Probar API"');
});