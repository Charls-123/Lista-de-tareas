// --- Variables ---
const inputTitulo = document.querySelector('#titulo');
const inputPrioridad = document.querySelector('#prioridad');
const inputEstado = document.querySelector('#estado');
const inputCategoria = document.querySelector('#categoria');
const inputDescription = document.querySelector('#descripcion');

const formulario = document.querySelector('#formulario');
const contenedorError = document.querySelector('#errores');

const contenedorColores = document.querySelector('.paleta-colores');
const contenedorNota = document.querySelector('.section-nota');

const btnEnviar = document.querySelector('.btn-enviar');

let colorSeleccionado = 'amarillo';

let modoEdicion = false;

const datosNota = {
  id: '',
  titulo: '',
  prioridad: '',
  estado: '',
  categoria: '',
  descripcion: '',
  color: colorSeleccionado
};

export const temasFormulario = {
  amarillo: 'bg-nota-amarillo',
  azul: 'bg-nota-azul',
  verde: 'bg-nota-verde',
  rosa: 'bg-nota-rosa',
  naranja: 'bg-nota-naranja',
  morado: 'bg-nota-morado',
  blanco: 'bg-nota-blanco'
};

// LocalStorage

let listaNotas = JSON.parse(localStorage.getItem('Notas')) || [];

// --- Eventos ---
// 1. Ejecutar al cargar la página para crear la paleta de colores de inmediato
document.addEventListener('DOMContentLoaded', () => {
  if (contenedorColores) {
    generarSelectoresColor();
  }

  comprobarModoEdicion();
});

if (formulario) {
  formulario.addEventListener('submit', agregarElementosAlObjeto);
}


// --- Funciones ---
function tomarElementos() { 
  datosNota.id = modoEdicion ? datosNota.id : generarId();
  datosNota.titulo = inputTitulo.value;
  datosNota.prioridad = inputPrioridad.value;
  datosNota.estado = inputEstado.value;
  datosNota.categoria = inputCategoria.value;
  datosNota.descripcion = inputDescription.value;
  datosNota.color = colorSeleccionado;
}

function detectarInputsVacios() {
  removerChilds();

  const divError = document.createElement('div');
  divError.classList.add('input-vacios');

  const mensajeError = document.createElement('strong');
  mensajeError.classList.add('mensaje-error');
  mensajeError.textContent = '¡POR FAVOR LLENE TODOS LOS CAMPOS VACÍOS!';

  divError.appendChild(mensajeError);
  contenedorError.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 2000);
}

function validarInputs() {
  const camposVacios = Object.values(datosNota).some(valor => String(valor).trim() === '');

  if (camposVacios) {
    detectarInputsVacios();
    return false; 
  }
  return true; 
}

function agregarElementosAlObjeto(e) {
  e.preventDefault();

  tomarElementos();

  if (!validarInputs()) {
    return;
  }

  if (modoEdicion) {
    // Modo Edición: Mapeamos para reemplazar la nota con la misma ID
    listaNotas = listaNotas.map(nota => {
      if (nota.id === datosNota.id) {
        return { ...datosNota };
      }
      return nota;
    });

    // Limpiamos la clave temporal de edición y reseteamos la bandera
    localStorage.removeItem('notaEditar');
    modoEdicion = false;

  } else {
    // Modo Creación: Generamos una nota nueva
    listaNotas.push({ ...datosNota });
  }

  // Guardamos la lista actualizada en localStorage
  localStorage.setItem('Notas', JSON.stringify(listaNotas));

  reiniciarFormulario();
  reiniciarObjetoNota();

  // Redireccionamos de vuelta al tablón
  window.location.href = 'tablon.html';
}

function comprobarModoEdicion() {
  const notaAEditar = JSON.parse(localStorage.getItem('notaEditar'));

  if (notaAEditar) {
    modoEdicion = true;

    // 1. Llenamos los inputs HTML con los datos de la nota
    inputTitulo.value = notaAEditar.titulo;
    inputPrioridad.value = notaAEditar.prioridad;
    inputEstado.value = notaAEditar.estado;
    inputCategoria.value = notaAEditar.categoria;
    inputDescription.value = notaAEditar.descripcion;

    // 2. Llenamos el objeto interno con los mismos datos
    Object.assign(datosNota, notaAEditar);
    colorSeleccionado = notaAEditar.color;

    // 3. Aplicamos el color visualmente en la paleta y en la nota
    if (contenedorNota && temasFormulario[colorSeleccionado]) {
      Object.values(temasFormulario).forEach(clase => contenedorNota.classList.remove(clase));
      contenedorNota.classList.add(temasFormulario[colorSeleccionado]);
    }

    // 4. Cambiamos el texto del botón enviar para feedback del usuario
    if (btnEnviar) {
      btnEnviar.textContent = 'Guardar Cambios';
    }
  }
}

function reiniciarFormulario() {
  formulario.reset();
  colorSeleccionado = 'amarillo';
  
  // Regresamos el formulario a su color amarillo base
  Object.values(temasFormulario).forEach(clase => contenedorNota.classList.remove(clase));
  contenedorNota.classList.add('bg-nota-amarillo');
  
  // Volvemos a marcar la bolita activa
  generarSelectoresColor();
}

function generarSelectoresColor() {
  // Limpiamos el contenedor antes de inyectar
  contenedorColores.innerHTML = '';

  Object.entries(temasFormulario).forEach(([nombreColor, claseCss]) => {
    
    // Usamos document.createElement del navegador
    const btnColor = document.createElement('button');
    btnColor.type = 'button'; // Evita que haga submit accidental del formulario
    btnColor.classList.add('color-btn', claseCss);
    btnColor.title = nombreColor;

    if (nombreColor === colorSeleccionado) {
      btnColor.classList.add('activo');
      contenedorNota.classList.add(claseCss);
    }

    btnColor.addEventListener('click', () => {
      seleccionarColor(nombreColor, claseCss, btnColor);
    });

    // Se agrega a contenedorColores, NO a contenedorNota
    contenedorColores.appendChild(btnColor);
  });
}

function seleccionarColor(nombreColor, claseCss, botonClickeado) {
  colorSeleccionado = nombreColor;

  // Quitar activo de todos los botones y dejarlo solo en el clickeado
  document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('activo'));
  botonClickeado.classList.add('activo');

  // Cambiar la clase de fondo al contenedor del formulario
  Object.values(temasFormulario).forEach(clase => contenedorNota.classList.remove(clase));
  contenedorNota.classList.add(claseCss);
}

function reiniciarObjetoNota() {
  // Corregido: datosNota en vez de citaObj
  Object.assign(datosNota, {
    id: generarId(),
    titulo: '',
    prioridad: '',
    estado: '',
    categoria: '',
    descripcion: '',
    color: colorSeleccionado
  });
}

function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

function removerChilds() {
  while (contenedorError.firstChild) {
    contenedorError.removeChild(contenedorError.firstChild);
  }
}