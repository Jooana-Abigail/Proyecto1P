// Array de colores de fondo
const coloresFondo = ['#8326a0', '#ff69b4', '#800020', '#808080'];

// Funcion para cambiar el color de fondo
function cambiarColorFondo() {
    const colorAleatorio = coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
    document.body.style.backgroundColor = colorAleatorio;
}

// Cambiar el color de fondo cada vez que se carga la pagina
window.addEventListener('load', cambiarColorFondo);

// Cambiar el color de fondo al hacer clic en un boton de filtro (solo como ejemplo)
document.getElementById('filtro-todas').addEventListener('click', cambiarColorFondo);
document.getElementById('filtro-activas').addEventListener('click', cambiarColorFondo);
document.getElementById('filtro-completadas').addEventListener('click', cambiarColorFondo);


const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];
/* EVENTOS */
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    })
})()

/* FUNCIONES */
function validarFormulario(e) {
    e.preventDefault();
    //validar los campos
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return
    }

    //creamos el objeto tarea
    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    //agregamos al array sin mutar dicho arreglo
    task = [...task, objTarea];
    formulario.reset();

    //agregamos al HTML
    agregarHTML();

}


function agregarHTML() {

    //limpiar el HTML
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }

    if (task.length > 0) {
        task.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">x</button>
                    <button class="completada" data-id="${item.id}">?</button>
                    <button class="editar" data-id="${item.id}">Editar</button>

                </div>
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "SIN TAREAS"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    //persistir los datos con localStorage
    localStorage.setItem("tareas", JSON.stringify(task))

}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}


//completar tarea
function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item
            }
        })

        //editamos el arreglo
        task = nuevasTareas;
        agregarHTML();
    }

}
   
    tareas.addEventListener("click", editarTarea);

    
    function editarTarea(e) {
        if (e.target.classList.contains("editar")) {
            const tareaID = Number(e.target.getAttribute("data-id"));
            
            const tareaSeleccionada = task.find(item => item.id === tareaID);
            
            const nuevoNombreTarea = prompt("Editar tarea:", tareaSeleccionada.tarea);
            if (nuevoNombreTarea !== null) {
               
                tareaSeleccionada.tarea = nuevoNombreTarea;
                
                agregarHTML();
            }
        }
    }
function filtrarTareas(estado) {
    let tareasFiltradas = [];
    if (estado === "todas") {
        tareasFiltradas = task;
    } else if (estado === "activas") {
        tareasFiltradas = task.filter(item => !item.estado);
    } else if (estado === "completadas") {
        tareasFiltradas = task.filter(item => item.estado);
    }
    renderizarTareas(tareasFiltradas);
}


document.getElementById("filtro-todas").addEventListener("click", () => filtrarTareas("todas"));
document.getElementById("filtro-activas").addEventListener("click", () => filtrarTareas("activas"));
document.getElementById("filtro-completadas").addEventListener("click", () => filtrarTareas("completadas"));


function renderizarTareas(tareasMostrar) {
     while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }

    if (tareasMostrar.length > 0) {
        tareasMostrar.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">x</button>
                    <button class="completada" data-id="${item.id}">?</button>
                    <button class="editar" data-id="${item.id}">Editar</button>
                </div>
            `;
            tareas.appendChild(elemento);
        });
    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~"
        tareas.appendChild(mensaje);
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    localStorage.setItem("tareas", JSON.stringify(task));
}


document.addEventListener("DOMContentLoaded", () => {
    let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
    task = datosLS;
    renderizarTareas(task);
});
