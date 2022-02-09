import React, { useState, useContext, Fragment, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styled from '@emotion/styled';
import ContainerDrawer from '../components/ContainerDrawer';
import Semestre from '../components/ui-calificaciones/Semestre';
import Spinner from '../components/Spinner';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Link } from "react-router-dom";

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
    padding: 20px;
    border-radius: 10px;

    h2 {
        font-size: 18px; 
        font-weight: bold;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    button {
        padding: 5px;
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
    }

`;

const Promedio = styled.div`

    display: flex;

    span {
        font-weight: bold;
    }

    div {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    p {
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #E8F6EF;
        font-weight: bold;
        color: black;
        padding: 20px;
        border-radius: 100px;
        width: 55px;
        height: 55px;
    }
`;

const BotonesDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 200px;

    button {
        
        padding: 8px;
        margin: 10px;
    }

`;

const Calificaciones = () => {

    const { kardex, usuarioDatos, cargandoPrimeraVez } = useContext(FirebaseContext);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;
    
    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');
    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const QuitarPuntosDecilames = creditos => {
        let temp = "";

        for (let i = 0;((i < creditos.length) && ( creditos[i] !== "." )); i++) {
            temp += creditos[i];
        }

        return temp;
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
                <Container>
                    {kardex ? <Fragment>
                        { kardex.estado ? (
                            <Fragment>
                                <br/>
                                <br/>
                                <Seccion>
                                    <h2>Datos generales</h2>
                                    {cargandoPrimeraVez ? <p>Buscando cambios...</p> : null}
                                    <Promedio>
                                        <div>
                                            <span>Promedio</span>
                                            <p>{kardex.totalesDeHistoricoAcadamico.pGA}</p>
                                        </div>
                                        
                                        <div>
                                            <span>Créditos Aprovados</span>
                                            <p>{QuitarPuntosDecilames(kardex.totalesDeHistoricoAcadamico.horasAprobadas)}</p>
                                        </div>
                                        
                                    </Promedio>
                                </Seccion>
                                <Seccion>
                                    <h2>Calificaciones</h2>

                                    {kardex.periodos.map( semestre => (
                                        <Semestre
                                            semestre={semestre}
                                            key={semestre.periodo}
                                        />
                                    ))}
                                    
                                </Seccion>
                            </Fragment>
                            
                        ) : (<Fragment>


                            <br/>
                            <br/>
                            <Seccion
                                style={{
                                    padding: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {cargandoPrimeraVez ? <Spinner/> : <Fragment>
                                    <h4>No hay calificaciones</h4>
                                    <br/>
                                    <p>Para agregar los datos de tus calificaciones debes subir tú Kárdex.</p>

                                    <Link to={"/SubirKardex"}>
                                        <BotonesDiv>
                                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                                Subir Kárdex
                                            </button>
                                        </BotonesDiv>
                                    </Link>

                                    <br/>

                                    <p>Si ya has subido el Kárdex sólo actualiza la página.</p>

                                    <BotonesDiv>
                                        <button onClick={ () => window.location.reload(true)} type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                            <RefreshIcon/> Actualizar
                                        </button>
                                    </BotonesDiv>
                                    
                                </Fragment> }
                                
                            </Seccion>
                            
                        </Fragment>)} 
                    </Fragment> : null}
                </Container>
            </ContainerDrawer>
        </ThemeProvider>
    );
}

export default Calificaciones;