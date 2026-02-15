const { request, response, json } = require('express');
const pool = require('../config/db');


const poblarProductos = async (request, response) => {
    try {
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const products = await apiFetch.json();

        let inserciones = 0;
        // Destructurar el objeto
        for(const product of products){
            const { title, price, description, image, category} = product;

            const stock = Math.floor(Math.random() * 50) + 1;
            
            const catRes = await pool.query('SELECT id FROM categoria WHERE nombre = $1', 
                [category]
            );
 
            const id_categoria = catRes.rows.length > 0 ? catRes.rows[0].id : null;
            
            await pool.query (
                ` INSERT INTO productos (nombre, precio, stock, descripcion, imagen_url, id_categoria)
                  VALUES ($1, $2, $3, $4, $5, $6)`,
                  [title, price, stock, description, image, id_categoria]
            );

            inserciones++;
        }
        response.status(200).json(
            {
                mensaje: "Carga masiva exitosa", 
                cantidad: inserciones
            }
        );
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};

const poblarCategorias = async (request, response) => {
    try {
        const apiFetch = await fetch('https://fakestoreapi.com/products/categories');
        const categorias = await apiFetch.json();

        let inserciones = 0;

        for (const categoria of categorias) {

            const existe = await pool.query(
                'SELECT id FROM categoria WHERE nombre = $1',
                [categoria]
            );

            if (existe.rows.length === 0) {
                await pool.query(
                    'INSERT INTO categoria (nombre) VALUES ($1)',
                    [categoria]
                );
                inserciones++;
            }
        }

        response.status(200).json({
            mensaje: "Categorías cargadas correctamente",
            cantidad: inserciones
        });

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
};

const buscarA = async (request, response) => {
    try{
        const resultado = await pool.query(
            `SELECT*FROM productos WHERE nombre ILIKE '%a%' `
        );

        response.status(200).json({
            cantidad: resultado.rows.length,
            productos: resultado.rows
        })

    }catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

const buscarCategoria = async (request, response) => {
    try{
        const {id} = request.params;

        const resultado = await pool.query(
            `SELECT c.id AS categoria_id, c.nombre AS categoria_nombre, p.id AS producto_id, 
            p.nombre AS producto_nombre, p.precio, p.stock FROM categoria c
            LEFT JOIN productos p ON c.id = p.id_categoria WHERE c.id = $1`, 
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json({
            categoria_id: resultado.rows[0].categoria_id,
            categoria_nombre: resultado.rows[0].categoria_nombre,
            productos: resultado.rows.filter(row => row.producto_id !== null)
        });

    }catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

const buscarTabla = async (request, response) => {
    try {
        const { q } = request.query;

        if (!q) {
            return response.status(400).json({
                error: 'Debes proporcionar un término de búsqueda'
            });
        }

        const busqueda = `%${q}%`;

        const resultado = await pool.query(
            `SELECT p.nombre, p.descripcion, c.nombre AS categoria, p.precio,
            p.stock FROM productos p LEFT JOIN categoria c ON p.id_categoria = c.id
             WHERE p.nombre ILIKE $1 OR p.descripcion ILIKE $1`,
            [busqueda]
        );

        response.status(200).json({
            resultado: resultado.rows
        });

    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};


const obtenerTodos = async (request, response) => {
    try {
        const resultado = await pool.query(
            `SELECT p.nombre, p.descripcion, c.nombre AS categoria, p.precio,
                p.stock FROM productos p LEFT JOIN categoria c ON p.id_categoria = c.id`
        );

        response.status(200).json({
            resultado: resultado.rows
        });

    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};



module.exports = { poblarProductos, poblarCategorias, buscarA, buscarCategoria, buscarTabla, obtenerTodos};