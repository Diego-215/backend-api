const express = require('express');
const { poblarProductos, poblarCategorias, buscarA, buscarCategoria, buscarTabla,  obtenerTodos, crearProducto} = require('../controllers/externalController');
const router = express.Router();
const midleware = require('../midleware/authMidleware');

router.post('/poblar', poblarProductos);
router.post('/categorias', poblarCategorias);
router.get('/a', buscarA);
router.get('/categorias/:id', buscarCategoria);
router.get('/search', buscarTabla);
router.get('/', obtenerTodos);
router.post('/crear', midleware, crearProducto);

module.exports = router;