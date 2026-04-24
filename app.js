// 1. IMPORTACIONES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; //trae las herramientas de los servicios de google. initializeApp crea la conexion

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 2. Este es el codigo que copiamos tal cual de firebase

const firebaseConfig = { 
  apiKey: "AIzaSyDYY_V3IaDz9Jd0lCpVEMdZkW-Y1Q4f8MQ",
  authDomain: "crud-firebase-app-e6bd1.firebaseapp.com",
  projectId: "crud-firebase-app-e6bd1",
  storageBucket: "crud-firebase-app-e6bd1.firebasestorage.app",
  messagingSenderId: "769186650154",
  appId: "1:769186650154:web:fc531f1c9dea02545d8b53"
};


// 3. Initialize Firebase
const app = initializeApp(firebaseConfig); //Inicializa la app de Firebase usando una configuración específica.
const db = getFirestore(app); //activa la base de datos y la guarda en la variable db


//4. resto del codigo (curd)
let datos = []; //crea un arreglo de nombre datos 

window.agregar =  async function () { //window es la ventana del navegador
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    } //verifica que los campos no esten vacios 
   
    await addDoc(collection(db, "productos"), {
        nombre,
        precio
    }); //a firebase ve a la colección llamada productos y guarda este objeto con nombre y precio
   
    alert("Producto agregado"); //envia un alert (los cuadritos pequeños)
    
    document.getElementById("nombre").value = ""; //obtiene lo que el usuario ingreso
    document.getElementById("precio").value = "";
    
    leer(); //despues de guardar llama a la funcion para actualizar lo que hay en pantalla
};

async function leer() { 
    datos = [];

    const querysnapshot  = await getDocs(collection(db, "productos"));

    querysnapshot.forEach((docu)=> {
        datos.push({
            id: docu.id,
            ...docu.data()
        });
    });
  
    mostrar(datos);
}
   
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML="";
    
    lista.forEach(d => {
        tabla.innerHTML += `
            <tr>
                <td>${d.nombre}</td>
                <td>${d.precio}</td>
                <td>
                    <button onclick="eliminar('${d.id}')">Eliminar</button>
                    <button onclick="editar('${d.id}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

window.eliminar = async function (id) {
    await deleteDoc(doc(db,"productos", id));
    leer();
};

window.editar = async function (id) {
    const nuevoNombre = prompt("Nuevo nombre: ");
    const nuevoPrecio = prompt("Nuevo precio: ");

    if (!nuevoNombre || !nuevoPrecio) return;

    await updateDoc(doc(db, "productos", id), {
        nombre: nuevoNombre,
        precio: nuevoPrecio
    });

    leer();
};

window.filtrar = function (){
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = datos.filter(d =>
        d.nombre.toLowerCase().includes(texto)
    );

    mostrar(filtrados);
};

leer();