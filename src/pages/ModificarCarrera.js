import React, { useState, useContext, useEffect, Fragment } from 'react';
import styled from '@emotion/styled';
import ContainerDrawer from '../components/ContainerDrawer';
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import { useHistory } from "react-router-dom";


import Spinner from '../components/Spinner';
import SeleccionarCarrera from '../components/SeleccionarCarrera';


import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

import { FirebaseContext } from '../firebase';

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
`;

const Seccion = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 90%;
    max-width: 700px;
    background-color: rgba(255,255,255,0.2);
    padding: 3px;
    border-radius: 10px;

    h2 {
        font-size: 18px; 
        font-weight: bold;
        padding-top: 10px;
        text-align: center;
    }

    h3 {
        font-size: 16px; 
        text-align: center;
    }

    button {
        width: 200px;
        padding: 8px;
        margin: 10px;
    }

`;

const EnlacesExternos = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
        width: 100%;
        max-width: 250px;
        margin-bottom: 30px;
    }

    button {
        border-radius: 10px;
        margin-top: 10px;
        
        max-width: 250px;
    }
`;

const ModificarCarrera = () => {

    const { usuarioDatos, firebase, usuario, setUsuarioDatos } = useContext(FirebaseContext);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const [ datosExtras, setDatosExtras ] = useState({
        carrera : null,
        tema : null,
        idUsuario : usuario ? usuario.uid : null,
        terminosCondicionesAceptados : false,
        tareas : [],
        materiasModificadas : []
    });

    const [ cambiosGuardados, setCambiosGuardados ] = useState(false);

    const [ carrerasEncontradas, setCarrerasEncontradas ] = useState([]);

    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');

    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    async function RevisarCarreras(nombre) {

        setMostrarSpinner(true);

        try {

            let carrerasTemp = await firebase.obtenerCarrera(nombre);
            let datosAGuardar = [];
            const busqueda = nombre.toLowerCase();

            setMostrarSpinner(false);

            const filtro = carrerasTemp.filter( carrera => {
                return (
                    carrera.datos.carrera.toLowerCase().includes(busqueda)
                )
            });

            //setCarreras(filtro);

            for (let i = 0; i < filtro.length; i++) {
                datosAGuardar.push(filtro[i]);
                if (i > 4 ) {
                    i = filtro.length + 1;
                } 
            }

            setCarrerasEncontradas(datosAGuardar);

        } catch (error) {
            console.error('Hubo un error al guardar el horario', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el horario',
            })
            setMostrarSpinner(false);
        }
    }

    const guardarDatosExtras = () => {

        if(datosExtras.carrera === null){
            Swal.fire({
                icon: 'error',
                text: 'Debes seleccionar una carrera para continuar',
            });
            return;
        }

        GuardarCarrera();
        
    }

    useEffect(() => {
        RevisarCarreras("");
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(usuario) {
            setDatosExtras({
                ...datosExtras,
                idUsuario : usuario.uid
            });
        }
    // eslint-disable-next-line
    }, [usuario]);

    useEffect(() => {
        if(usuario) {
            setDatosExtras({
                ...datosExtras,
                idUsuario : usuario.uid
            })
        }
    // eslint-disable-next-line
    }, []);

    const GuardarCarrera = async () => {

        setMostrarSpinner(true);

        try {
            const carrera = datosExtras.carrera;

            const respuesta = await firebase.obtenerDatosUsuario(usuario.uid);

            let nuevaRespuesta = respuesta;
            nuevaRespuesta.usuarioDatos.datos.carrera = carrera;

            await firebase.agregarMateriasModificadas(nuevaRespuesta.usuarioDatos.datos.idUsuario, nuevaRespuesta.usuarioDatos.datos);

            if(respuesta.usuarioDatos) {localStorage.setItem('usuarioDatos', JSON.stringify(nuevaRespuesta.usuarioDatos));}

            setUsuarioDatos(nuevaRespuesta.usuarioDatos.datos)

            setCambiosGuardados(true);
            setMostrarSpinner(false);

        } catch (error) {
            console.error('Hubo un error al cambiar de carrera', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al cambiar de carrera',
            })
            setMostrarSpinner(false);
        }
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
                <Container>
                    <br/>
                    <br/>

                    <Seccion>
                        { mostrarSpinner ? <Spinner/> : <Fragment>
                            {cambiosGuardados ? 

                            <Fragment>
                                <h2> Cambios Guardados con exito.</h2>
                            </Fragment> : <Fragment>
                                
                                <div 
                                    style={{
                                        padding : 20,
                                        textAlign: 'justify'
                                    }}
                                >
                                    <h2> Modificar tu carrera</h2>

                                    <br/>
                        
                                    <div>
                                        <p>Actualmente esta aplicación solo soporta las siguientes carreras :</p>
                                    </div> 
                
                                        <h2>Elige tu carrera : </h2>

                                        { mostrarSpinner ? <Spinner/> : <Fragment>
                                            <div>
                                                {carrerasEncontradas.map( (carrera) => (
                                                    <SeleccionarCarrera 
                                                        key={carrera.id} 
                                                        carrera={carrera.datos} 
                                                        setDatosExtras={setDatosExtras}
                                                        datosExtras={datosExtras}
                                                    />
                                                ))}
                                            </div>
                                                
                                            <EnlacesExternos>
                                                <button
                                                    onClick={ () => { guardarDatosExtras()}} 
                                                    type="button" 
                                                    className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                                >
                                                    Guardar
                                                </button>
                                            </EnlacesExternos>
                                            
                                        </Fragment>}

                                </div>

                                
                            </Fragment>}
                        </Fragment>}
                    </Seccion>
                </Container>
            </ContainerDrawer>

        </ThemeProvider>
    );
}

export default ModificarCarrera;