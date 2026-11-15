import { temasFormulario } from "./app.js";

//Variables 
const contenedorNotas = document.querySelector('#contenedor-notas');

let datosNotas = JSON.parse(localStorage.getItem('Notas')) || [];

//Eventos
document.addEventListener('DOMContentLoaded', cargarNotas);

//Funciones
function cargarNotas() {

    contenedorNotas.innerHTML = '';

    datosNotas.forEach(nota => {
        console.log(nota)

        //Contenedor de las notas
        const divNota = document.createElement('div')
        divNota.classList.add('notas-contenido', `${temasFormulario[nota.color]}`);

        //Contenedor de los select
        const divSelect = document.createElement('div');
        divSelect.classList.add('contenedor-selects');

        //Selects
        const prioridad = document.createElement('strong');
        prioridad.classList.add(`prioridad-${nota.prioridad}`, 'prioridad');
        prioridad.textContent = nota.prioridad.toUpperCase();

        const estado = document.createElement('strong');
        if (nota.estado) {
            const claseEstado = `estado-${nota.estado.toLowerCase().replace(/\s+/g, '-')}`;
            estado.classList.add(claseEstado, 'estado');
            estado.textContent = nota.estado.toUpperCase();
        }

        divSelect.appendChild(estado);
        divSelect.appendChild(prioridad);

        //Titulo
        const titulo = document.createElement('h2');
        titulo.classList.add('titulo')
        titulo.innerText = nota.titulo;

        //Categoria
        const categoria = document.createElement('h3');
        categoria.classList.add('categoria');
        categoria.innerHTML = nota.categoria;
        
        //descripcion
        const descripcion = document.createElement('strong');
        descripcion.classList.add('descripcion')
        descripcion.innerText = nota.descripcion;

        //Contenedor Botones
        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('contenedor-botones');

        //boton Terminado
        const botonHecho = document.createElement('button');
        botonHecho.classList.add('btn-hecho', 'btn');
        botonHecho.innerText = "Terminada";

        botonHecho.addEventListener('click', () => { 
            notaHecha(nota.id)
        })

        //boton Modificar
        const botonModificar = document.createElement('button');
        botonModificar.classList.add('btn-modificar', 'btn');
        botonModificar.innerText = "Modificar"

        botonModificar.addEventListener('click', () => {
            prepararEdicion(nota);
        });

        //boton Eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('btn-eliminar', 'btn');
        botonEliminar.innerText = "Eliminar"

        botonEliminar.addEventListener('click', () => { 
            notaEliminada(nota.id)
        })

        contenedorBotones.appendChild(botonHecho);
        contenedorBotones.appendChild(botonModificar);
        contenedorBotones.appendChild(botonEliminar);


        //Agregar al contenedor de notas
        divNota.appendChild(divSelect);
        divNota.appendChild(titulo);
        divNota.appendChild(categoria);
        divNota.appendChild(descripcion);
        divNota.appendChild(contenedorBotones)

        //agregar el contenedor de notas al contendor principal
        contenedorNotas.appendChild(divNota);
    });
}

function notaHecha(idSeleccionado) { 
    // 1. Mapeamos el arreglo para actualizar únicamente la nota que coincide con el ID
    datosNotas = datosNotas.map(nota => {
        if (nota.id === idSeleccionado) {
        return { ...nota, estado: 'Terminada' }; // O 'Completado'
        }
        return nota; // Las demás notas se quedan sin cambios
    });

    // 2. Guardamos el arreglo actualizado en localStorage
    localStorage.setItem('Notas', JSON.stringify(datosNotas));

    // 3. Volvemos a renderizar el tablero para reflejar la nueva clase o sección
    cargarNotas();
}

function notaEliminada(id) {
    datosNotas = datosNotas.filter(nota => nota.id !== id);

    localStorage.setItem('Notas', JSON.stringify(datosNotas));

    cargarNotas();
}

function prepararEdicion(nota) {
    localStorage.setItem('notaEditar', JSON.stringify(nota));
    window.location.href = 'index.html';
}