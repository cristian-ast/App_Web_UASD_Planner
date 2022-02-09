import { initializeApp } from 'firebase/app';
import firebaseConfig from './config';

import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    updateDoc,
    doc  
} from 'firebase/firestore';

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
    updatePassword  
} from "firebase/auth";

import firebase from '.';

class Firebase {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth();
        this.db = getFirestore();
    }

    // Registrar un usuario
    async registrar(email, password) {

        await createUserWithEmailAndPassword(this.auth, email, password);
        const id = firebase.auth.currentUser.uid;

        return id;
    }

    // Iniciar Sesion 
    async iniciarSesion(email, password) {
        await signInWithEmailAndPassword(this.auth, email, password);
    }

    // Cierra la sesión del usuario
    async cerrarSesion() {
        await signOut(this.auth);
    }

    async recuperarContrasena(email) {

        await sendPasswordResetEmail(this.auth, email);
    }

    async cambiarContrasena(oldPassword, newPassword) {

        const user = this.auth.currentUser;

        await signInWithEmailAndPassword(this.auth, user.email, oldPassword);

        await updatePassword(user, newPassword);
    }
    
    // Agregar kardex
    async agregarKardex(idUsuario, kardex) {

        let datos = {
            ...kardex,
            idUsuario
        };

        let datosObtenidos = [];
        const kardexsRef = collection(this.db, "kardexs");
        const q = query(kardexsRef, where("idUsuario", "==", idUsuario));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        if (datosObtenidos.length === 0 ) {
            
            await addDoc(collection(this.db, "kardexs"), datos);

        } else {

            const referencia = doc(this.db, "kardexs", datosObtenidos[0].id);
            
            await updateDoc(referencia, datos);

        }

    }

    // Agregar kardex
    async agregarHorario(idUsuario, horario) {

        let datos = {
            ...horario,
            idUsuario
        };

        let datosObtenidos = [];
        const horariosRef = collection(this.db, "horarios");
        const q = query(horariosRef, where("idUsuario", "==", idUsuario));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        if (datosObtenidos.length === 0 ) {
            await addDoc(collection(this.db, "horarios"), datos);
        } else {
            const referencia = doc(this.db, "horarios", datosObtenidos[0].id);
            await updateDoc(referencia, datos);
        }
    }

    // Agregar pensum
    async agregarPensum(pensum) {

        let datosObtenidos = [];
        const pensumRef = collection(this.db, "pensums");
        const q = query(pensumRef, where("carrera", "==", pensum.carrera));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        if (datosObtenidos.length === 0 ) {
            await addDoc(collection(this.db, "pensums"), pensum);
        } else {
            const referencia = doc(this.db, "pensums", datosObtenidos[0].id);
            await updateDoc(referencia, pensum);
        }
        
    }

    // Obtener Carreras
    async obtenerCarrera() {
        
        let datosObtenidos = [];
        const pensumRef = collection(this.db, "pensums");
        const q = query(pensumRef);
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        return datosObtenidos;
    }

    // Agregar Datos extras del usuaeio
    async agregarDatosExtras(datos) {

        const id = firebase.auth.currentUser.uid;

        let datosObtenidos = [];

        const usuarioRef = collection(this.db, "usuarios");
        const q3 = query(usuarioRef, where("idUsuario", "==", id));
        const querySnapshot3 = await getDocs(q3);

        querySnapshot3.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        if (datosObtenidos.length === 0 ) {
            await addDoc(collection(this.db, "usuarios"), datos);
        } else {
            const referencia = doc(this.db, "usuarios", datosObtenidos[0].id);
            await updateDoc(referencia, datos); 
        }
    }
    
    // Agregar las materias modificadas en los datos del usuario
    async agregarMateriasModificadas(id, datos) {

        let datosObtenidos = [];

        const usuarioRef = collection(this.db, "usuarios");
        const q3 = query(usuarioRef, where("idUsuario", "==", id));
        const querySnapshot3 = await getDocs(q3);

        querySnapshot3.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        const referencia = doc(this.db, "usuarios", datosObtenidos[0].id);
        await updateDoc(referencia, datos);
    }

    // Agregar las tareas en los datos del usuario
    async agregarTareas(id, datos) {

        let datosObtenidos = [];

        const usuarioRef = collection(this.db, "usuarios");
        const q3 = query(usuarioRef, where("idUsuario", "==", id));
        const querySnapshot3 = await getDocs(q3);

        querySnapshot3.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({id, datos});
        });

        const referencia = doc(this.db, "usuarios", datosObtenidos[0].id);
        await updateDoc(referencia, datos);
    }

    // Obtener Datos del usuario
    async obtenerDatosUsuario(id) {

        let datosObtenidos = [];
        let datos = {
            pensum : null,
            kardex : null,
            horario : null,
            usuarioDatos : null
        }

        //////////////////////////////////////////////////////////////
        const kardexRef = collection(this.db, "kardexs");
        const q1 = query(kardexRef, where("idUsuario", "==", id));
        const querySnapshot1 = await getDocs(q1);

        querySnapshot1.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        datos.kardex = datosObtenidos[0];

        ///////////////////////////////////////////////////////////////
        datosObtenidos = [];
        const horarioRef = collection(this.db, "horarios");
        const q2 = query(horarioRef, where("idUsuario", "==", id));
        const querySnapshot2 = await getDocs(q2);

        querySnapshot2.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        datos.horario = datosObtenidos[0];

        ///////////////////////////////////////////////////////////////
        datosObtenidos = [];
        const usuarioRef = collection(this.db, "usuarios");
        const q3 = query(usuarioRef, where("idUsuario", "==", id));
        const querySnapshot3 = await getDocs(q3);

        querySnapshot3.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });

        datos.usuarioDatos = datosObtenidos[0];

        ///////////////////////////////////////////////////////////////
        datosObtenidos = [];
        const pensumRef = collection(this.db, "pensums");
        const q4 = query(pensumRef, where("carrera", "==", datos.usuarioDatos.datos.carrera));
        const querySnapshot4 = await getDocs(q4);

        querySnapshot4.forEach((doc) => {
            const datos = doc.data();
            const id = doc.id;
            datosObtenidos.push({ id, datos});
        });
        datos.pensum = datosObtenidos[0];

        return datos;

    }

}

const firebase2 = new Firebase();
export default firebase2;