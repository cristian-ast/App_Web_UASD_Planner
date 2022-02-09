import React, { useEffect, useState, useContext, Fragment } from 'react';
import styled from '@emotion/styled';
import { useHistory } from "react-router-dom";

import ContainerDrawer from '../components/ContainerDrawer';
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css'
import firebase, { FirebaseContext } from '../firebase';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import Spinner from '../components/Spinner';

const CuerpoCambiarClave = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    color: white;
  
`;

const CambiarClaveForm = styled.form`
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

const CambiarClave = () => {

    const { usuarioDatos } = useContext(FirebaseContext);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [color, setColor ] = useState(tipoTema ? 'white' : 'black');

    useEffect(() => {
        setColor(tipoTema ? 'white' : 'black');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const [ colorTheme ] = useState(tipoTema ? 'dark' : 'light');

    const [ cambiosGuardados, setCambiosGuardados ] = useState(false);
   
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ nuevoUsuario, setNuevoUsuario ] = useState({
        oldPassword : "",
        password : "",
        repitePassword : ""
    });

    const onChange = e => {

        setNuevoUsuario({
            ...nuevoUsuario,
            [e.target.name] : e.target.value
        })
    }

    async function enviarCambios(oldPassword, password) {
        try {
            await firebase.cambiarContrasena(oldPassword, password);

            setMostrarSpinner(false);
            setCambiosGuardados(true);

        } catch (error) {

            console.error('Hubo un error al cambiar la cantraseña de usuario', error); 

            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al cambiar la cantraseña del usuario',
            })

            setMostrarSpinner(false);
        }
    }

    const  validar = e => {
        e.preventDefault();

        if((nuevoUsuario.oldPassword.trim()=== "") || (nuevoUsuario.password.trim()=== "") || (nuevoUsuario.repitePassword.trim()=== "")) {
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

        enviarCambios(nuevoUsuario.oldPassword, nuevoUsuario.password);
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
                <CuerpoCambiarClave>
                    { mostrarSpinner ? <Spinner/> : <Fragment>
                        {cambiosGuardados ? 

                        <Fragment>

                            <br/>
                            <br/>
                            <br/>

                            <h2
                                style={{
                                    color : color
                                }}
                            > 
                                Cambios Guardados con exito.
                            </h2>

                        </Fragment> : <Fragment>

                        <br/>

                        <CambiarClaveForm>

                            <h2
                                style={{
                                    color : color
                                }}
                            > 
                                Cambiar Contraseña
                            </h2>

                            <label
                                style={{
                                    color : color
                                }}
                            > 
                                Contraseña antigua : 
                            </label>

                            <input 
                                name="oldPassword"
                                required 
                                type="password"
                                onChange={ e => onChange(e)}
                            />
                            <label
                                style={{
                                    color : color
                                }}
                            >
                                Contraseña nueva :
                            </label>

                            <input 
                                name="password"
                                required 
                                type="password"
                                onChange={ e => onChange(e)}
                            />
                            <label
                                style={{
                                    color : color
                                }}
                            >
                                Repite la Contraseña nueva : 
                            </label>

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
                            >Enviar</button>
                        </CambiarClaveForm> 
                        </Fragment>}
                    </Fragment>}
                </CuerpoCambiarClave>
            </ContainerDrawer>
            
        </ThemeProvider>
    );
}

export default CambiarClave;