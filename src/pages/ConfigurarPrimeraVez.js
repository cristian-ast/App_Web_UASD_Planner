import React, { useState, useEffect, useContext } from "react";
import styled from '@emotion/styled';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes"

import Primero from '../components/ui-firts-configuration/Primero';
import Segundo from '../components/ui-firts-configuration/Segundo';
import Tercero from '../components/ui-firts-configuration/Tercero';
import Cuarto from '../components/ui-firts-configuration/Cuarto';
import Quinto from '../components/ui-firts-configuration/Quinto';
import Sexto from '../components/ui-firts-configuration/Sexto';

import { ThemeModoContext } from '../context/ThemeContext';
import { FirebaseContext } from '../firebase';

const Contenedor = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const Titulo = styled.h1`
    font-size: 20px;
    font-weight: bold;
    margin-top: 50px;

    span {
        font-weight: 400;
        font-size: 18px;
    }
`;

const ConfigurarPrimeraVez = () => {
    
    const { setTipoTema } = useContext(ThemeModoContext);
    const { usuario, firebase } = useContext(FirebaseContext);

    const [ datosExtras, setDatosExtras ] = useState({
        carrera : null,
        tema : null,
        idUsuario : usuario ? usuario.uid : null,
        terminosCondicionesAceptados : false,
        tareas : [],
        materiasModificadas : []
    });

    const [ paso, setPaso ] = useState("primero");

    const [ sapoActual, setPasoActual ] = useState("Paso 1 de 5");

    const [theme, setTheme] = useState('dark');

    const [tema, setTema ] = useState({name : 'Oscuro'})

    useEffect(() => {
        themeToggler();
        
    // eslint-disable-next-line
    },[tema])
    
    const themeToggler = () => {

        if(tema.name === 'Oscuro') {
            setTheme('dark');
            setTipoTema(true);
            setDatosExtras({
                ...datosExtras,
                tema : true
            })
        } else {
            setTheme('light');
            setTipoTema(false);
            setDatosExtras({
                ...datosExtras,
                tema : false
            })
        } 
    }

    useEffect(() => {
        RevisarElPasoActual();
    // eslint-disable-next-line
    },[paso])

    const RevisarElPasoActual = () => {
        if(paso === "primero") {
            setPasoActual("Paso 1 de 5");
        } else {
            if(paso === "segundo") {
                setPasoActual("Paso 2 de 5");
            } else {
                if(paso === "tercero") {
                    setPasoActual("Paso 3 de 5");
                } else {
                    if(paso === "cuarto") {
                        setPasoActual("Paso 4 de 5");
                    } else {
                        if(paso === "quinto") {
                            setPasoActual("Paso 5 de 5");
                        } else {
                            setPasoActual("Todo listo");
                        }
                    }
                }
            }
        }
    }
    
    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>

            <Contenedor>
                <Titulo>Creando cuenta : <span><i>{sapoActual}</i></span></Titulo>
               
                
                { paso === "primero" ? <Primero 
                    setPaso={setPaso} 
                    setTema={setTema}
                    firebase={firebase}
                    usuario={usuario} 
                    datosExtras={datosExtras}
                    setDatosExtras={setDatosExtras}
                /> : null}

                { paso === "segundo" ? <Segundo 
                    setPaso={setPaso} 
                    datosExtras={datosExtras}
                    setDatosExtras={setDatosExtras}
                    firebase={firebase}
                /> : null}

                { paso === "tercero" ? <Tercero 
                    setPaso={setPaso} 
                /> : null}

                { paso === "cuarto" ? <Cuarto 
                    setPaso={setPaso}
                    firebase={firebase}
                    usuario={usuario} 
                /> : null}

                { paso === "quinto" ? <Quinto 
                    setPaso={setPaso} 
                    firebase={firebase}
                    usuario={usuario} 
                /> : null}

                { paso === "sexto" ? <Sexto 
                    setPaso={setPaso} 
                /> : null}
            </Contenedor>

        </ThemeProvider>
        
    );
}

export default ConfigurarPrimeraVez;