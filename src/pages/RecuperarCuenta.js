import React, { useState, useEffect, useContext, Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';

import { ThemeModoContext } from '../context/ThemeContext';
import firebase from '../firebase';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

import Spinner from '../components/Spinner';

const CuerpoIniciarSesion = styled.div`
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

const RecuperarCuenta = () => {

    const [ colorTheme ] = useState('dark');
    const { setTipoTema } = useContext(ThemeModoContext);
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const history = useHistory();
    const [ usuario, setUsuario ] = useState({
        email : ""
    });

    const onChange = e => {

        setUsuario({
            ...usuario,
            [e.target.name] : e.target.value
        })
    }

    // async function iniciarSesion(email, password) {
    //     try {
    //         await firebase.iniciarSesion(email, password);
    //         setMostrarSpinner(false);
    //         history.push("/");
    //     } catch (error) {
    //         console.error('Hubo un error al iniciar sesión', error); 
    //         Swal.fire({
    //             icon: 'error',
    //             text: 'Hubo un error al iniciar sesión',
    //         })
    //         setMostrarSpinner(false);
    //     }
    // }

    const validar = async e => {
        e.preventDefault();

        if( usuario.email.trim()=== ""){
            Swal.fire({
                icon: 'error',
                text: 'Error. Trate de nuevo.'
            });
            return;
        } 

        setMostrarSpinner(true);

        try {
            await firebase.recuperarContrasena(usuario.email);
            setMostrarSpinner(false);

            Swal.fire(
                'Revisa tu correo!',
                'Se te ha enviado un link para que pongas una contraseña nueva.',
                'success'
            );

            history.push("/IniciarSesion");

        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Error. Trate de nuevo.'
            });
            setMostrarSpinner(false);
        }
    }

    useEffect(() => {
        setTipoTema(true);
    // eslint-disable-next-line
    }, []);
    
    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <CuerpoIniciarSesion>
            
                <Titulo>Bienvenido a UASD Planner</Titulo>

                { mostrarSpinner ? <Spinner/> : <Fragment>

                <IniciarSesionCorreo>

                    <h2>Escriba el correo electrónico con el cual se resgistro</h2>

                    <label>Email : </label>
                    <input
                        name="email"
                        required 
                        type="email"
                        onChange={ e => onChange(e)}
                    />
                    <label>Luego de enviar su petición revise su correo. </label>
                    
                    <button
                        onClick={ e => validar(e)} 
                        type="submit" 
                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                    >Enviar</button>
                    
                </IniciarSesionCorreo> 

                <IniciarSesionBotones>
                    ¿Recuerdas tú contraseña?
                    <Link to={"/IniciarSesion"}>
                        <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                            Iniciar Sesion
                        </button>
                    </Link>
                    <br/>
                </IniciarSesionBotones>
                </Fragment>}
            </CuerpoIniciarSesion>
            
        </ThemeProvider>
    );
}

export default RecuperarCuenta;