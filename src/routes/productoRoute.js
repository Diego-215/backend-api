const express = require('express');
const { poblarProductos, poblarCategorias, buscarA, buscarCategoria, buscarTabla,  obtenerTodos} = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.post('/categorias', poblarCategorias);
router.get('/a', buscarA);
router.get('/categorias/:id', buscarCategoria);
router.get('/search', buscarTabla);
router.get('/', obtenerTodos);

module.exports = router;