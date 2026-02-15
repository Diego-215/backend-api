const API_URL = 'http://localhost:4000/api/productos';
const input = document.getElementById('BusquedaInput');
const mensaje = document.getElementById('mensaje');
const limpiarBoton = document.getElementById('limpiarBoton');

async function obtenerProductos (){
    try{
        mensaje.textContent = 'cargando...';

        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();

        mostrarProductos(data.resultado);
        mensaje.textContent = '';
    }catch(error){
        console.log('ERROR', error);
    }
}

async function buscarProductos(q) {
    try {
        mensaje.textContent = 'Buscando...';

        const respuesta = await fetch(`${API_URL}/search?q=${q}`);
        const data = await respuesta.json();

        if (data.resultado.length === 0) {
            mensaje.textContent = `No encontramos productos que coincidan con "${q}"`;
        } else {
            mensaje.textContent = '';
        }

        mostrarProductos(data.resultado);

    } catch (error) {
        console.log(error);
        mensaje.textContent = 'Error de búsqueda';
    }
}

function mostrarProductos (productos){
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const fila = `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.categoria}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
        </tr>
        `;
        tbody.innerHTML += fila;
    });
}

input.addEventListener('input', () => {
    const valor = input.value.trim();

    if(valor === ''){
        obtenerProductos();
    }
    else{
        buscarProductos(valor);
    }
});

limpiarBoton.addEventListener('click', ()=> {
    input.value = '';
    mensaje.textContent = '';
    obtenerProductos();
});

window.onload = () => {
    obtenerProductos();
}