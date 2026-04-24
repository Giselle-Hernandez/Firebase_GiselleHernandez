// 1. IMPORTACIONES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 2. COHIGURACION DE FIAEBASEC* AoUf VA LD OE COr

const firebaseConfig = {
  apiKey: "AIzaSyDYY_V3IaDz9Jd0lCpVEMdZkW-Y1Q4f8MQ",
  authDomain: "crud-firebase-app-e6bd1.firebaseapp.com",
  projectId: "crud-firebase-app-e6bd1",
  storageBucket: "crud-firebase-app-e6bd1.firebasestorage.app",
  messagingSenderId: "769186650154",
  appId: "1:769186650154:web:fc531f1c9dea02545d8b53"
};


// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//4. resto del codigo (curd)
let datos = [];

window.agregar =  async function () {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }
   
    await addDoc(collection(db, "productos"), {
        nombre,
        precio
    });
   
    alert("Producto agregado");
    
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    
    leer();
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