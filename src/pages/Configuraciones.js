import React, { useState, useContext, useEffect } from 'react';

import { Link } from "react-router-dom";
import styled from '@emotion/styled';
import ContainerDrawer from '../components/ContainerDrawer';
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';

import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { FirebaseContext } from '../firebase';

import Spinner from '../components/Spinner';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '90%',
      maxWidth: 600,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 15,
      color: "#000000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

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

const BotonesDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;


const Configuraciones = () => {
    const { 
        usuario, 
        firebase, 
        usuarioDatos, 
        setDatos,
        setUsuarioDatos,
        setPensum,
        setKardex,
        setHorario 
    } = useContext(FirebaseContext);

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ subiendoTarea, setSubiendoTarea ] = useState(false);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');

    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    // eslint-disable-next-line
    const [tema, setTema ] = useState({name : tipoTema ? 'Oscuro' : 'Claro'});

    const CambiarTema = async newTema => {

        setTema({name : newTema});

        if((newTema === 'Oscuro')){

            setColorTheme('dark');

            if(usuarioDatos.tema === false) {

                handleOpen();
                setSubiendoTarea(true);

                let usuarioDatosCopia = usuarioDatos;
                usuarioDatosCopia.tema = true;

                setUsuarioDatos(usuarioDatosCopia);
                // Mandar a base de datos
                try {
                    await firebase.agregarMateriasModificadas(usuarioDatosCopia.idUsuario, usuarioDatosCopia);
                    
                } catch (error) {
                    console.error(error);

                    usuarioDatosCopia.tema = false;
                    setUsuarioDatos(usuarioDatosCopia);

                    setColorTheme('light');
                    setTema({name : "Claro"});

                    Swal.fire({
                        icon: 'error',
                        text: 'Hubo un error al subir los cambios',
                    });
                }

                handleClose();
                setSubiendoTarea(false);
            }
        } else {
            if((newTema === 'Claro')){

                setColorTheme('light');

                if(usuarioDatos.tema === true) {

                    handleOpen();
                    setSubiendoTarea(true);

                    let usuarioDatosCopia = usuarioDatos;
                    usuarioDatosCopia.tema = false;
                    
                    setUsuarioDatos(usuarioDatosCopia);
                    // Mandar a base de datos
                    try {
                        await firebase.agregarMateriasModificadas(usuarioDatosCopia.idUsuario, usuarioDatosCopia);
                        
                    } catch (error) {
                        console.error(error);

                        usuarioDatosCopia.tema = true;
                        setUsuarioDatos(usuarioDatosCopia);

                        setColorTheme('dark');
                        setTema({name : "Oscuro"});

                        Swal.fire({
                            icon: 'error',
                            text: 'Hubo un error al subir los cambios',
                        });
                    }

                    handleClose();
                    setSubiendoTarea(false);
                }
            }
        }
    }

    const CerrarSesion = async () => {
        setMostrarSpinner(true);
        try {
            await firebase.cerrarSesion();

            setMostrarSpinner(false);

            localStorage.clear();

            setDatos(null);
            setUsuarioDatos(null);
            setPensum(null);
            setKardex(null);
            setHorario(null);

            history.push("/IniciarSesion");

        } catch (error) {
            console.error('Hubo un error al cerrar sesión', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al cerrar sesión',
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
                        <h2> Configuraciones</h2>
                        { mostrarSpinner ? <Spinner/> : null}
                        <hr/>
                        <div>
                            
                            <p>Correo : <b>{ usuario ? usuario.email : "Cargando..."}</b></p>

                            <BotonesDiv>
                                <Link to={"/CambiarClave"}>
                                    <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                        Cambiar Contraseña
                                    </button>
                                </Link>
                                
                                <button onClick={CerrarSesion} type="button" className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block">
                                    Cerrar Sesion
                                </button>
                            </BotonesDiv>
                            
                        </div>
                        <hr/>
                        <div>
                            <p>Cambiar Tema</p>
                            <div>
                                <label className="containerTheme"> <p style={{ fontSize: 14}}>Claro</p>
                                    <input 
                                        type="radio" 
                                        name="radio" 
                                        checked = {colorTheme === 'light' ? true : false}
                                        onClick={ () => {
                                            CambiarTema("Claro");
                                        }}/>
                                    <span className="checkmarkTheme"></span>
                                </label>

                                <label className="containerTheme"> <p  style={{ fontSize: 14}}>Oscuro</p>
                                    <input 
                                        type="radio" 
                                        name="radio" 
                                        checked = { colorTheme === 'dark' ? true : false}
                                        onClick={ () => {
                                            CambiarTema("Oscuro");
                                        }}/>
                                    <span className="checkmarkTheme"></span>
                                </label>
                            </div>
                            <Modal
                                open={open}
                                onClose={handleClose}
                            >
                                <div 
                                    style={{
                                        ...modalStyle,
                                        backgroundColor : tipoTema ? "rgb(36, 59, 85)" : 'rgb(226, 226, 226)',
                                        color: tipoTema ? 'white' : 'black'
                                    }} 
                                    className={classes.paper}
                                >
                                    {subiendoTarea ? <Spinner/> : null}
                                </div>
                                
                            </Modal>
                            <hr/>
                            <div>
                                <BotonesDiv>

                                    <Link to={"/SubirKardex"}>
                                        <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                            Actualizar Kárdex
                                        </button>
                                    </Link>
                                    
                                    <Link to={"/SubirHorario"}>
                                        <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                            Actualizar Horario
                                        </button>
                                    </Link>
                                    
                                    <Link to={"/ModificarCarrera"}>
                                        <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                            Cambiar Carrera
                                        </button>
                                    </Link>
                                    
                                </BotonesDiv>
                                
                            </div>
                        </div>
                    </Seccion>
                </Container>
            </ContainerDrawer>

        </ThemeProvider>
    );
}

export default Configuraciones;
