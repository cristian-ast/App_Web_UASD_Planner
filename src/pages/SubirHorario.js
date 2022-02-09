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

const SubirHorario = () => {

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

    const [ horario, setHorario ] = useState({
        error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
    });

    const obtenerDatos =  () => {
        
        let oracion = "";
        let datosBruto = [];
        let indiceDatosBruto = 0;

        let totalCreditos = "";

        let materiaUnica = {};
        let materiasInscritas = [];
        let indiceMateriasInscritas = 0;

        let horariosDeLaMateria = [];
        let horarioUnico = {};

        let sinHorario = false; 
        
        let iColores = 0;

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
                
                let revisarSiEsTotalHorasCredito = "";
                let oracioAComparar = datosBruto[i];
                let indiceHorarios = 0;
    
                if(oracioAComparar[0] === "T") {

                    for (let j = 0; j <= 19; j++) {
                        revisarSiEsTotalHorasCredito += oracioAComparar[j];
                    }
                }

                if((revisarSiEsTotalHorasCredito === "Total horas crédito:") || (revisarSiEsTotalHorasCredito === "Total Credit Hours: ")){
                    totalCreditos = datosBruto[i];
                    i++;
                }

                if((datosBruto[i] === "Periodo asociado:") || (datosBruto[i] === "Associated Term:")) {

                    let coloresClases = [
                        "rgb(230, 124, 115)", // rosa
                        "rgb(246, 191, 38)",  // amarillo
                        "rgb(11, 128, 67)",   // verde
                        "rgb(213, 0, 0)",     // rojo
                        "rgb(3, 155, 229)",   // azul
                        "rgb(142, 36, 170)",  // purpura
                        "rgb(63, 81, 181",    // azul marino
                        "#6ECB63",     // verde claro
                        "rgb(244, 81, 30)",   // Naranja
                        "rgb(121, 134, 203)",  // Azul marino claro
                        "#DF711B" // naranja
                    ];
                    
                    let materia = datosBruto[i - 1];
                    i = i + 1;
                    let periodoAsociado = datosBruto[i];
                    i = i + 2;
                    let nrc = datosBruto[i];
                    i = i + 4;
                    let instructorAsignado = datosBruto[i];
                    i = i + 4;
                    let creditos = datosBruto[i];
                    i = i + 2;
                    let nivel = datosBruto[i];
                    i = i + 2;
                    let campus = datosBruto[i];
                    
                    for (let j = i; j < datosBruto.length; j++) {
                        i++;

                        if((datosBruto[j] !== "Periodo asociado:") && (datosBruto[j] !== "Associated Term:")) {

                            if(datosBruto[j] === "Class") {
                                j++;
                                i++;
                                let hora = datosBruto[j];
                                j++;
                                i++;
                                let dia =  datosBruto[j];
                                j++;
                                i++;
                                let donde =  datosBruto[j];
                                j++;
                                i++;
                                let randoDeFecha =  datosBruto[j];
                                j++;
                                i++;
                                let tipoDeHorario =  datosBruto[j];

                                horarioUnico = {
                                    hora,
                                    donde,
                                    dia,
                                    randoDeFecha,
                                    tipoDeHorario
                                }

                                horariosDeLaMateria[indiceHorarios] = horarioUnico;
                                indiceHorarios++;
                                horarioUnico = {};
                            }

                        } else {
                            j = datosBruto.length + 1;
                            i = i - 10;
                        }
                    }

                    materiaUnica = {
                        materia,
                        color: coloresClases[iColores],
                        periodoAsociado,
                        nrc,
                        instructorAsignado,
                        creditos,
                        nivel,
                        campus,
                        horario : horariosDeLaMateria
                    }
                    
                    if(iColores === 10) {
                        iColores = 0;
                    } else {
                        iColores++;
                    }

                    materiasInscritas[indiceMateriasInscritas] = materiaUnica;
                    indiceMateriasInscritas++;
                    materiaUnica = {}
                    horariosDeLaMateria = [];
                }
            }
            
            for (let i = 0; i < materiasInscritas.length; i++) {
                if( materiasInscritas[i].horario.length === 0 ) {
                    sinHorario = true; 
                }
            }
            

            if( (totalCreditos.trim() === "") || (materiasInscritas.length === 0)  || ( sinHorario === true)) {
                setHorario({
                    error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
                });
                Swal.fire({
                    icon: 'error',
                    text: 'Hubo un error al extraer datos del horario',
                });

            } else {
                setHorario({
                    totalHorasCredito: totalCreditos,
                    materias : materiasInscritas
                });

                //setMostrarBotonOmitir(false);
            }

        } catch (error) {
            setHorario({
                error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
            });

            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al lod extraer del horario',
            });
        }
    }

    async function GuardarHorario() {
        setMostrarSpinner(true);

        let newHorario = {
            ...horario,
            estado : true
        }
        try {
            const idUsuario = usuario.uid;
            await firebase.agregarHorario(idUsuario, newHorario);
            setCambiosGuardados(true);
            setMostrarSpinner(false);

        } catch (error) {
            console.error('Hubo un error al guardar el horario', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el horario',
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
                                    <h2> Subir Horario Detalle Alumno</h2>

                                    <br/>
                        
                                    <div>
                                        <p>Entra al Horario Detalle Alumno por el portal oficial de la UASD, copia todos los datos y luego pégalos en el siguente editor de texto.</p>
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
                                        {horario.error ?  
                                            <TextEditor
                                                setNewsContent={setNewsContent}
                                            />
                                        : null}
                                    </div>

                                    <br/>
                                    {horario.error ? 
                                        <button
                                            onClick={ () => { obtenerDatos();}}
                                            type="button" 
                                            className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                        >
                                            Extraer Datos
                                        </button>
                                    : 
                                        <button
                                            onClick={ () => { GuardarHorario()}} 
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

export default SubirHorario;