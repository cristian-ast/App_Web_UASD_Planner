import React, { useState, useContext, Fragment, useEffect } from 'react';
import styled from '@emotion/styled';
import Semestre from '../components/ui-pensum/Semestre';
import Opciones from '../components/ui-pensum/Opciones';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import { useHistory } from "react-router-dom";


import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import RefreshIcon from '@material-ui/icons/Refresh';

import Spinner from '../components/Spinner';
import { DataContext } from '../context/DataContext';
import firebase, { FirebaseContext } from '../firebase';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";
import ContainerDrawer from '../components/ContainerDrawer';

import Gris from '../img/gris.png';
import Verde from '../img/verde.png';
import Amarillo from '../img/amarillo.png';

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

`;

const TablaPensum = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const FilaTablaPensum = styled.div`
    width: 100%;
    display: flex;
`;

const AsignaturaDiv = styled.div`
    width: 80%;
`;

const CreditosDiv = styled.div`
    width: 20%;
    text-align: center;
`;

const ContenedorOpciones = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const EstadoMateriaCard = styled.div`
    display: flex;
    width: 50%;
    flex-direction: column;

    div {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    p {
        margin: 0;
    }
`;

const EstadoImg = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;

const EstadoPensumCard = styled.div`
    text-align: center;
    width: 100%;

    button {
        width: 100px;
        border-radius: 10px;
        margin-top: 10px;
        padding: 2px;
        font-weight: bold;
        margin-left: 10px;
    }

    button:hover {
        background-color: #B5B2B2;
    }
`;

const ContenedorBotonMas = styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
    margin-bottom: 20px;

    button {
        width: 130px;
        margin: 8px;
        padding: 3px;
        border-radius: 10px;
    }
`;

const Pensum = () => {

    const { materiasModificadas, setMateriasModificadas } = useContext(DataContext);
    const { pensum, cargandoPrimeraVez, usuarioDatos } = useContext(FirebaseContext);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    useEffect(() => {
        if(usuarioDatos) {
            setMateriasModificadas(usuarioDatos.materiasModificadas);
        }
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

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
    const [ subiendoTarea, setSubiendoTarea ] = useState(false);

    // eslint-disable-next-line
    const [ info, setInfo ] = useState({
        aprovadas : 0,
        activas : 0,
        restantes : 0
    });

    const [ cerrarVentanaMateria, setCerrarVentanaMateria ] = useState(false); 

    const ContarMaterias = () => {

        let restantes = 0;
        let aprovadas = 0;
        let activas = 0;

        if(pensum){
            // eslint-disable-next-line
            pensum.semestres.map(semestre => {
                if(semestre.tipo === "normal") {
                    // eslint-disable-next-line
                    semestre.materias.map(() => {
                        restantes++;
                    });
                }
            });
        };

        if(usuarioDatos) {
            // eslint-disable-next-line
            usuarioDatos.materiasModificadas.map( materia => {
                if(materia.estado === "Aprovada") {
                    aprovadas++;
                    restantes--;
                } else {
                    if(materia.estado === "Activa") {
                        activas++;
                        restantes--;
                    }
                }
            });
        };
        
        setInfo({
            aprovadas,
            activas,
            restantes
        });
    }

    useEffect(() => {
        ContarMaterias();
    // eslint-disable-next-line
    }, [])


    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const [ editando, setEdiando ] = useState(false);

    const Guardar = async () => {

        setCerrarVentanaMateria(true);

        let nuevoDatosUsuario = usuarioDatos;
        nuevoDatosUsuario.materiasModificadas = materiasModificadas;

        setSubiendoTarea(true);
        handleOpen();

        try {
            await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);

            let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
            usuarioDatos.datos = nuevoDatosUsuario;

            localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

            ContarMaterias();

            setCerrarVentanaMateria(false);

        } catch (error) {

            console.error('Hubo un error al subir los cambios', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al subir los cambios',
            });
            setCerrarVentanaMateria(false);
            Cancelar();
        }

        handleClose();
        setSubiendoTarea(false);
    }

    const Cancelar = () => {
        window.location.reload(true);
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
            <Container>
                {cargandoPrimeraVez ? <Spinner/> : <Fragment>
                    { pensum ? (
                        <Fragment>
                            {subiendoTarea ? 
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
                            : null}
                            <br/>
                            <br/>
                            <Seccion>
                                { editando ? 
                                    <Opciones 
                                        setEdiando={setEdiando}
                                        Guardar={Guardar}
                                        Cancelar={Cancelar}
                                    /> 
                                : null}
                                <h2>Pensum de {pensum.carrera}</h2>

                                <h3><i>{pensum.escuela}</i></h3> 
                                <h3><i>{pensum.faculta}</i></h3>

                                <hr/>

                                <ContenedorOpciones>
                                    <EstadoMateriaCard>
                                        <div>
                                            <EstadoImg src={Verde} alt="Estado de la materia ico"/>
                                            <p>Aprovadas</p>
                                        </div>
                                        <div>
                                            <EstadoImg src={Amarillo} alt="Estado de la materia ico"/>
                                            <p>Activas</p>
                                        </div>
                                        <div>
                                            <EstadoImg src={Gris} alt="Estado de la materia ico"/>
                                            <p>Restantes</p>
                                        </div>
                                    </EstadoMateriaCard>
                                    <EstadoPensumCard>
                                        <ContenedorBotonMas>
                                            <button onClick={ () => window.location.reload(true)} type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                                <RefreshIcon/> Actualizar
                                            </button>
                                        </ContenedorBotonMas>
                                    
                                    </EstadoPensumCard>
                                </ContenedorOpciones>
                            </Seccion>
                            <Seccion>
                                <TablaPensum>
                                    <FilaTablaPensum>
                                        <AsignaturaDiv>Asignatura</AsignaturaDiv>
                                        <CreditosDiv>Créditos</CreditosDiv>
                                    </FilaTablaPensum>
                                    
                                    {pensum.semestres.map( semestre => (
                                        <FilaTablaPensum key={`${semestre.semestre}-${semestre.tipo}`}>
                                            <Semestre
                                                setEdiando={setEdiando} 
                                                semestre={semestre}
                                                cerrarVentanaMateria = {cerrarVentanaMateria}
                                                setCerrarVentanaMateria = {setCerrarVentanaMateria}
                                            />
                                        </FilaTablaPensum>
                                    ))}
                                </TablaPensum>
                            </Seccion>
                        </Fragment>
                    ) : (<Seccion><p>No hay datos del pensum</p></Seccion>)}
                </Fragment>}
                </Container>
            </ContainerDrawer>
        </ThemeProvider>
    );
}

export default Pensum;