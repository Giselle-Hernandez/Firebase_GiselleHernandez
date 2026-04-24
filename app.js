// 1. IMPORTACIONES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; //importa la función initializeApp desde el archivo de Firebase para poder usarla en este código

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

window.agregar =  async function () { //window es la ventana del navegador y es un objeto global
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

async function leer() { //funcion asincrona de nombre leer sin parametros externos  
    datos = []; //limpia la variable de datos

    const querysnapshot  = await getDocs(collection(db, "productos")); // crea una constante de nombre querysnapshot y le dice que sera igual a lo que obtenga de la base db y de la coleccion productos

    querysnapshot.forEach((docu)=> { //es un ciclo que dice que por cada documento que hay en la base de datos que haga lo siguiente 
        datos.push({ //agrega un nuevo objeto dentro de la lista datos 
            id: docu.id, //extrae el id y lo guarda
            ...docu.data() //extrae tosos los datos del documento 
        });
    });
  
    mostrar(datos); //envia todos los datos a la funcion que los muestra en pantalla
}
   
function mostrar(lista) { //declara una funcion de nombre mostrar y tiene como parametro "lista"
    const tabla = document.getElementById("tabla"); //declara una constante de nombre tabla y que es igual a lo que se obtiene del documento con id tabla 
    tabla.innerHTML=""; //elimina lo que hay dentro de la tabla
    
    lista.forEach(d => { //por cada elemento de la lista se hace lo siguiente
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

window.eliminar = async function (id) { //hacemos que la funcion de eliminar sea global y es asincrona que recibe el id del producto que se quiere borrar
    await deleteDoc(doc(db,"productos", id)); //pausa la ejecucion hasta que se confirme que el producto ha sido borrado
    leer(); //actualiza la lista con la funcion de leer
};

window.editar = async function (id) { //hace que la funcion de editar sea global y es asincrona y como parametro recibe el id del producto que se quiere editar
    const nuevoNombre = prompt("Nuevo nombre: "); //declara la constante de nombre nuevoNOmbre y va a almacenar lo que el usuario guarde en la ventana emergente 
    const nuevoPrecio = prompt("Nuevo precio: ");

    if (!nuevoNombre || !nuevoPrecio) return; //verifica que los campos no esten vacios

    await updateDoc(doc(db, "productos", id), { //espera a que firebase actualice el documento
        nombre: nuevoNombre, //ahora nombre tiene el valor de nuevo nombre 
        precio: nuevoPrecio
    });

    leer(); //actualiza la tabla en la pantalla
};

window.filtrar = function (){ //hace que la funcion filter sea global y no tiene parametros externos
    const texto = document.getElementById("buscar").value.toLowerCase(); //crea una constante de nombre texto que va a ser igual al valor en minusculas de lo que hay en el documento con el id buscar

    const filtrados = datos.filter(d => //declara una constante de nombre filtrados que va a ser igual a una nueva lista basada en la original
        d.nombre.toLowerCase().includes(texto) //condicion de busqueda toma el valor del nombre del producto actual, lo convierte a minusculas y revisa si incluye lo que el usuario escribio
    );

    mostrar(filtrados);//muestra la nueva lista a la funcion de mostrar para que la muestre en la pantalla
};

leer(); //en cuanto termina de ejecutar el archivo va a firebase, trae los productos y los muestra de inmediato