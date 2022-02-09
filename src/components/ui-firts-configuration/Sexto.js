import React, { useEffect, useState, Fragment, useContext } from 'react';
import styled from '@emotion/styled';
import Listo from '../../img/listo2.png';
import { useHistory } from "react-router-dom";
import firebase from '../../firebase';
import useAutenticacion from '../../context/useAutenticacion';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import { FirebaseContext } from '../../firebase';

const Contenedor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 64px;
        margin-top: 20px;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
        text-align: justify;
        width: 80%;
        margin: 50px;
        max-width: 500px;

        h2 {
            font-size: 18px; 
            margin-bottom: 40px;
        }
    }
    
    button {
        padding: 5px;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        max-width: 250px;
    }
    
`;

const Sexto = () => {

    const {setDatos, setUsuarioDatos, setPensum, setKardex, setHorario} = useContext(FirebaseContext);


    const history = useHistory();
    const usuario = useAutenticacion();

    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);

    async function obtenerDatos() {

        setMostrarSpinner(true);

        if(usuario) {
          try {
            const respuesta = await firebase.obtenerDatosUsuario(usuario.uid);
            const kardex = respuesta.kardex.datos;

            let materiasModificadas = [];

            if(kardex.estado) {
                // eslint-disable-next-line
                kardex.periodos.map( periodo => {
                    // eslint-disable-next-line
                    periodo.materias.map( materiaKardex => {   
                        if((materiaKardex.calificacion >= "70") && (materiaKardex.calificacion !== "AUS")) {
                            const materia = {
                                clave : materiaKardex.materia + "-" + materiaKardex.curso,
                                estado : "Aprovada"
                            };
                            materiasModificadas.push(materia);
                        } else {
                            const materia = {
                                clave : materiaKardex.materia + "-" + materiaKardex.curso,
                                estado : "Restante"
                            };
                            materiasModificadas.push(materia);
                        }
                    });
                });
            }

            let nuevaRespuesta = respuesta;
            nuevaRespuesta.usuarioDatos.datos.materiasModificadas = materiasModificadas;
            nuevaRespuesta.usuarioDatos.datos.configuracionCompleta = true;

            await firebase.agregarMateriasModificadas(nuevaRespuesta.usuarioDatos.datos.idUsuario, nuevaRespuesta.usuarioDatos.datos);

            if(respuesta.usuarioDatos) {localStorage.setItem('usuarioDatos', JSON.stringify(nuevaRespuesta.usuarioDatos));}
            if(respuesta.pensum) {localStorage.setItem('pensum', JSON.stringify(respuesta.pensum));}
            if(respuesta.kardex) {localStorage.setItem('kardex', JSON.stringify(respuesta.kardex));}
            if(respuesta.horario) {localStorage.setItem('horario', JSON.stringify(respuesta.horario));}

            setDatos(nuevaRespuesta);

            setUsuarioDatos(nuevaRespuesta.usuarioDatos.datos);
            setPensum(respuesta.pensum.datos);
            setKardex(respuesta.kardex.datos);
            setHorario(respuesta.horario.datos);

            let newDatosExtras = {
                ...respuesta.usuarioDatos.datos,
                configuracionCompleta : true
            }
            
            await firebase.agregarDatosExtras(newDatosExtras);

            setMostrarSpinner(false);
    
          } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error completar la configuracion. Intenta de nuevo',
            });
            console.error('Hubo un error al cargar los datos del usuario', error); 
            window.location.reload(true);
          }
        }
      }
    
      useEffect(() => {
        obtenerDatos();
      // eslint-disable-next-line
      }, [usuario]);

    // Terminando de configurar
    // Agregar las materias a materia modificadas

    return (
        <Contenedor>
            { mostrarSpinner ? <Fragment>
                <div>
                    <h2>Terminando la configuración...</h2>
                </div>
                <Spinner/>
                
                </Fragment> : <Fragment> 
                <img src={Listo} alt="Listo ico" />
                
                <div>
                    <h2>Pecfecto</h2>
                    <p>Ya hemos terminados de configurar tu cuenta. Todos los datos los puedes modificar en configuracion. </p>
                    <p>Recuerda actualizar estos datos siempre que selecciones materias o que te publiquen tus notas.</p>
                </div>

                <br/>

                <button
                    type="button" 
                    className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                    onClick={ () => history.push("/")}
                >
                    Listo
                </button>

                <br/>
            </Fragment> }
        </Contenedor>  
    );
}

export default Sexto;