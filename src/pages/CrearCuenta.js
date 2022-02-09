import React, { useEffect, useState, useContext, Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css'
import firebase from '../firebase';
import { useHistory } from "react-router-dom";
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

import { ThemeModoContext } from '../context/ThemeContext';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import Spinner from '../components/Spinner';

const CuerpoCrearCuenta = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    color: white;
  
`;

const Titulo = styled.h1`
    font-size: 20px;
    font-weight: bold;
    margin-top: 50px;
`;

const IniciarSesionCorreo = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    width: 80%;
    max-width: 400px;
    background-color: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 10px;

    h2 {
        font-size: 18px; 
        text-align: center;
    }

    label, button, input {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    button, input {
        padding: 5px;
        border-radius: 10px;
    }

    input {
        border: none;
        outline: none;
        font-weight: bold;
    }
`;

const IniciarSesionBotones =  styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 50px;

    button {
        padding-top: 5px;
        padding-bottom: 5px;
    }
`;

const CrearCuenta = () => {

    const [ colorTheme ] = useState('dark');
    const { setTipoTema } = useContext(ThemeModoContext);

    const history = useHistory();

    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);

    const [ nuevoUsuario, setNuevoUsuario ] = useState({
        email : "",
        password : "",
        repitePassword : ""
    });

    

    const onChange = e => {

        setNuevoUsuario({
            ...nuevoUsuario,
            [e.target.name] : e.target.value
        })
    }

    async function crearCuenta(email, password) {
        try {
            const id = await firebase.registrar(email, password);

            const datosExtras = {
                carrera : null,
                tema : null,
                idUsuario : id,
                terminosCondicionesAceptados : false,
                tareas : [],
                materiasModificadas : []
            };

            await firebase.agregarDatosExtras(datosExtras);

            if(datosExtras) {
                localStorage.setItem('usuarioDatos', JSON.stringify({
                    id : null,
                    datos : datosExtras
                }));
            }

            setMostrarSpinner(false);
            history.push("/ConfigurarPrimeraVez");

        } catch (error) {
            console.error('Hubo un error al crear el usuario', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al crear el usuario',
            })
            setMostrarSpinner(false);
        }
    }

    const  validar = e => {
        e.preventDefault();

        if((nuevoUsuario.email.trim()=== "") || (nuevoUsuario.password.trim()=== "") || (nuevoUsuario.repitePassword.trim()=== "")) {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos son obligatorios'
            });
            return;
        } else {
            if(nuevoUsuario.password.length < 8) {
                Swal.fire({
                    icon: 'error',
                    text: 'La contraseña debe ser de al menos 8 caracteres'
                });
                return;
            } else {
                if(nuevoUsuario.password !== nuevoUsuario.repitePassword) {
                Swal.fire({
                    icon: 'error',
                    text: 'La contraseña debe ser igual en ambos campos',
                });
                return;
            }
            }
        }

        setMostrarSpinner(true);

        crearCuenta(nuevoUsuario.email, nuevoUsuario.password);
    }

    useEffect(() => {
        setTipoTema(true);
    // eslint-disable-next-line
    }, []);

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <CuerpoCrearCuenta>
            
                <Titulo>Bienvenido a UASD Planner</Titulo>

                { mostrarSpinner ? <Spinner/> : <Fragment>

                <IniciarSesionCorreo>
                    <h2>Crear Cuenta</h2>
                    <label>Email : </label>
                    <input 
                        name="email"
                        required 
                        type="email"
                        onChange={ e => onChange(e)}
                    />
                    <label>Contraseña : </label>
                    <input 
                        name="password"
                        required 
                        type="password"
                        onChange={ e => onChange(e)}
                    />
                    <label>Repite la Contraseña : </label>
                    <input 
                        name="repitePassword"
                        required 
                        type="password"
                        onChange={ e => onChange(e)}
                    />
                    <br/>
                    <button 
                        onClick={ e => validar(e)} 
                        type="submit" 
                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                    >Entrar</button>
                </IniciarSesionCorreo> 

                <IniciarSesionBotones>
                    ¿Ya tienes una cuenta?
                    <Link to={"/IniciarSesion"}>
                        <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                            Iniciar Sesion
                        </button>
                    </Link>
                    
                    <br/>
                </IniciarSesionBotones>
                
                </Fragment>}
            </CuerpoCrearCuenta>
            
        </ThemeProvider>
    );
}

export default CrearCuenta;