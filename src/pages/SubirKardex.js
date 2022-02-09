import React, { useState, useContext, useEffect, Fragment } from 'react';
import styled from '@emotion/styled';
import ContainerDrawer from '../components/ContainerDrawer';
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'
import { useHistory } from "react-router-dom";

import Spinner from '../components/Spinner';

import TextEditor from '../components/TextEditor';

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

const SubirKardex = () => {

    const { usuarioDatos, firebase, usuario } = useContext(FirebaseContext);

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const [ cambiosGuardados, setCambiosGuardados ] = useState(false);

    const [ newsContent, setNewsContent ] = useState("");

    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');

    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const [ kardex, setKardex ] = useState({
        error : "Los datos obtenidos son iválidos. Por favor trata de nuevo"
    });

    const obtenerDatos =  () => {
        let programa = "0";
        let escuela = "0";
        let campus = "0";
        let carrera = "0";
        let horasIntentadas = "0";
        let horasAprobadas = "0";
        let horasGanadas = "0";
        let horasPGA = "0";
        let puntosDeCalidad = "0";
        let pGA = "0";

        let periodos = [];
        let periodo = {};
        let nombreDelPeriodo = "";
        let materiasDelPeriodo = [];
        let materiaUnica = {};
        let numeroDelPeriodo = 0;

        let oracion = "";
        let datosBruto = [];
        let indiceDatosBruto = 0;

        for (let index = 0; index < newsContent.length; index++) {
            if(newsContent[index] === ">" ){
                index++;
                if(index < newsContent.length) {
                    while (newsContent[index] !== "<") {     
                        oracion += newsContent[index];
                        index++;
                    }
                }
                if(oracion.trim() !== "") {
                    datosBruto[indiceDatosBruto] = oracion;
                    indiceDatosBruto++;
                }
                oracion = "";
            }
        }
        
        try {
            for (let i = 0; i < datosBruto.length; i++) {

                if((datosBruto[i] === "Programa:") || (datosBruto[i] === "Program:")) {
                    i++;
                    programa = datosBruto[i];
                    i = i + 2;
                    escuela = datosBruto[i]; 
                    i = i + 2;
                    campus = datosBruto[i];
                    i = i + 2;
                    carrera = datosBruto[i];
    
                }
    
                let revisarSiEsPeriodo = "";
                let revisarSiEsPeriodoIngles = "";
                let oracioAComparar = datosBruto[i];
    
                if((oracioAComparar[0] === "P") || (oracioAComparar[0] === "T")) {
                    
                    revisarSiEsPeriodo += oracioAComparar[0];
                    revisarSiEsPeriodo += oracioAComparar[1];
                    revisarSiEsPeriodo += oracioAComparar[2];
                    revisarSiEsPeriodo += oracioAComparar[3];
                    revisarSiEsPeriodo += oracioAComparar[4];
                    revisarSiEsPeriodo += oracioAComparar[5];
                    revisarSiEsPeriodo += oracioAComparar[6];
                    revisarSiEsPeriodo += oracioAComparar[7];

                    revisarSiEsPeriodoIngles += oracioAComparar[0];
                    revisarSiEsPeriodoIngles += oracioAComparar[1];
                    revisarSiEsPeriodoIngles += oracioAComparar[2];
                    revisarSiEsPeriodoIngles += oracioAComparar[3];
                    revisarSiEsPeriodoIngles += oracioAComparar[4];
                    
                }
                
                if((revisarSiEsPeriodo === "Periodo:") || (revisarSiEsPeriodoIngles === "Term:")){
                    
                    let indiceDeLaMateria = 0;
    
                    nombreDelPeriodo = datosBruto[i];
                    
                    
                    i = i + 15;
    
                    while (datosBruto[i].length === 3) {
    
                        materiaUnica = {
                            materia: datosBruto[i],
                            curso: datosBruto[i + 1],
                            campus: datosBruto[i + 2],
                            nivel: datosBruto[i + 3],
                            titulo: datosBruto[i + 4],
                            calificacion: datosBruto[i + 5],
                            horasCredito: datosBruto[i + 6],
                            puntosDeCalidad: datosBruto[i + 7]
                            
                        }
                        materiasDelPeriodo[indiceDeLaMateria] = materiaUnica;
                        indiceDeLaMateria++;
                        materiaUnica = {};
    
                        i = i + 8;
                    }
                        
                    periodo = {
                        periodo : nombreDelPeriodo,
                        materias: materiasDelPeriodo
                    }
    
                    periodos[numeroDelPeriodo] = periodo;
                    numeroDelPeriodo++;
                    
                    periodo = {};
                    materiasDelPeriodo = [];
                }
    
                if((datosBruto[i] === "Global:") || (datosBruto[i] === "Overall:")){
                    i++;
                    horasIntentadas = datosBruto[i];
                    i++;
                    horasAprobadas = datosBruto[i];
                    i++;
                    horasGanadas = datosBruto[i];
                    i++;
                    horasPGA = datosBruto[i];
                    i++;
                    puntosDeCalidad = datosBruto[i];
                    i++;
                    pGA = datosBruto[i];
    
                    break;
                }
            }
    
            if(
                (campus.trim() === "") ||
                (carrera.trim() === "") ||
                (escuela.trim() === "") ||
                (programa.trim() === "") ||
                (periodos.length === 0) ||
                (horasIntentadas.trim() === "") ||
                (horasAprobadas.trim() === "") ||
                (horasGanadas.trim() === "") ||
                (horasPGA.trim() === "") ||
                (puntosDeCalidad.trim() === "") ||
                (pGA.trim() === "")
            ) {
                setKardex({
                    error : "Los datos obtenidos son iválidos. Por favor trata de nuevo"
                })

                Swal.fire({
                    icon: 'error',
                    text: 'Hubo un error al extraer datos del kardex',
                })
            } else {
                setKardex({
                    informacionDelAlumno: {
                        programa: programa,
                        escuela: escuela,
                        campus : campus,
                        carrera : carrera
                    },
                    periodos : periodos,
                    totalesDeHistoricoAcadamico: {
                        horasIntentadas: horasIntentadas,
                        horasAprobadas: horasAprobadas,
                        horasGanadas: horasGanadas,
                        horasPGA: horasPGA,
                        puntosDeCalidad: puntosDeCalidad,
                        pGA : pGA
                    }
                });

            }
        } catch (error) {
            setKardex({
                error : "Los datos obtenidos son iválidos. Por favor trata de nuevo"
            });

            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al extraer datos del kardex',
            })
        }
    }

    async function GuardarKardex() {
        setMostrarSpinner(true);

        let newKardex = {
            ...kardex,
            estado : true
        }

        try {
            const idUsuario = usuario.uid;
            await firebase.agregarKardex(idUsuario, newKardex);

            if(usuario) {
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
      
                await firebase.agregarMateriasModificadas(nuevaRespuesta.usuarioDatos.datos.idUsuario, nuevaRespuesta.usuarioDatos.datos);
      
                if(respuesta.usuarioDatos) {localStorage.setItem('usuarioDatos', JSON.stringify(nuevaRespuesta.usuarioDatos));}
            }

            setCambiosGuardados(true);
            setMostrarSpinner(false);

        } catch (error) {
            console.error('Hubo un error al guardar el kardex', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el kardex',
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
                                    <h2> Subir Kárdex Académico</h2>

                                    <br/>
                        
                                    <div>
                                        <p>Entra al Kárdex Academico por el portal oficial de la UASD, copia todos los datos y luego pégalos en el siguente editor de texto.</p>
                                        <br/>
                                        <p><strong>Nota: Si no lo copias todo, la app no funcionará bien. </strong></p>

                                        <EnlacesExternos>
                                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block" disabled>
                                                <b>Ver video</b>
                                            </button>
                                        </EnlacesExternos>

                                    </div> 
                                </div>
                                

                                <div className="extratorContainer">
                                    <div className="textEditorContainer">
                                        {kardex.error ?  
                                            <TextEditor
                                                setNewsContent={setNewsContent}
                                            />
                                        : null}
                                    </div>

                                    <br/>
                                    {kardex.error ? 
                                        <button
                                            onClick={ () => { obtenerDatos();}}
                                            type="button" 
                                            className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                        >
                                            Extraer Datos
                                        </button>
                                    : 
                                        <button
                                            onClick={ () => { GuardarKardex()}} 
                                            type="button" 
                                            className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                        >
                                            Guardar
                                        </button>
                                    }
                                    
                                    <br/>
                                </div>
                            </Fragment>}
                        </Fragment>}
                    </Seccion>
                </Container>
            </ContainerDrawer>

        </ThemeProvider>
    );
}

export default SubirKardex;