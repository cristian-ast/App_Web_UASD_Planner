import React, { useEffect, useContext, useState, Fragment }  from 'react';
import styled from '@emotion/styled';
import TextEditor from '../components/TextEditor';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";
import { ThemeModoContext } from '../context/ThemeContext';
import { FirebaseContext } from '../firebase';

import Spinner from '../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ContenedorPrincipal = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 800px;
    
    button {
        padding: 5px;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        max-width: 250px;
    }
`;

const Contenedor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 20px;
        margin-right: 10px;
    }

    div {
        margin: 20px;
        text-align: justify;
        width: 80%;
        margin: 50px;
        max-width: 500px;


        h2 {
            font-size: 18px; 
        }
    }
`;

const AgregarPemsum = () => {
    
    const { tipoTema } = useContext(ThemeModoContext);
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ colorTheme, setColorTheme ] = useState('dark');
    const { firebase } = useContext(FirebaseContext);
    const [ enviar, setEnviar ] = useState(false);

    const [ newsContent, setNewsContent ] = useState("");
    
    const [ pensum, setPensum ] = useState({
        faculta : "",
        escuela : "",
        carrera : "",
        semestres : [{
            semestre : "",
            tipo: "",
            materias :[{
                clave : "",
                asignatura : "",
                creditos : ""
            }]
        }]
    });

    useEffect(() => {
        if(tipoTema === true ) {
            setColorTheme('dark');
        } else {
            setColorTheme('light');
        }
    // eslint-disable-next-line
    }, []);

    const obtenerDatos =  () => {
        
        let oracion = "";
        let datosBruto = [];
        let indiceDatosBruto = 0;

        let faculta = "";
        let escuela = "";
        let carrera = "";

        let buscandoSemestre = false;
        let buscandoMateria = false;
        let buscandoDatosMateria = false;
        let buscandoIndiceSiguienteMateria = false;

        let materiasDelSemestre = [];
        let indiceDelSemestre = 0;
        let periodoSemestre = "";
        let tipoSemestre = "normal";

        let todosLosSemestres = [];
        let inciceTodosLosSemestres = 0;

        let materiaUnica = {};

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

                if(datosBruto[i] === "Universidad Autónoma de Santo Domingo") {
                    i++;
                    faculta = datosBruto[i];
                    i++;
                    escuela = datosBruto[i];
                    i = i + 2;
                    carrera = datosBruto[i];

                    buscandoSemestre = true;
                    while(buscandoSemestre) {
                        i++ 

                        if(datosBruto[i] === "Equivalencias") {
                            
                            buscandoMateria = true;
                            while(buscandoMateria) { 
                                
                                i++;
                                let esteSemestre = {};
                                periodoSemestre = datosBruto[i];

                                buscandoDatosMateria = true;
                                while(buscandoDatosMateria) { 
                                        
                                    i++;
                                    let clave = datosBruto[i];
                                        
                                    i++;
                                    let asignatura = datosBruto[i];
                                        
                                    i = i + 3;
                                    let creditos = datosBruto[i];
        
                                    materiaUnica = {
                                        clave,
                                        asignatura,
                                        creditos
                                    }

                                    materiasDelSemestre[indiceDelSemestre] = materiaUnica;
                                    indiceDelSemestre++;
                                    materiaUnica = {};

                                    buscandoIndiceSiguienteMateria = true;
                                    while(buscandoIndiceSiguienteMateria) {
                                        i++;

                                        if(datosBruto[i] === "Asignaturas Optativas") {tipoSemestre = "optativas"}

                                        if( i >= datosBruto.length) {
                                            
                                            buscandoSemestre = false;
                                            buscandoMateria = false;
                                            buscandoDatosMateria = false;
                                            buscandoIndiceSiguienteMateria = false;

                                        } else {

                                            let comparar = "";
                                            let palabraCompleta = datosBruto[i];
                                            let indiceCompara = datosBruto[i].length;

                                            if(indiceCompara > 7) {
                                                comparar += palabraCompleta[indiceCompara - 8];
                                                comparar += palabraCompleta[indiceCompara - 7];
                                                comparar += palabraCompleta[indiceCompara - 6];
                                                comparar += palabraCompleta[indiceCompara - 5];
                                                comparar += palabraCompleta[indiceCompara - 4];
                                                comparar += palabraCompleta[indiceCompara - 3];
                                                comparar += palabraCompleta[indiceCompara - 2];
                                                comparar += palabraCompleta[indiceCompara - 1];
                                            }

                                            if (
                                                (comparar === "Semestre") || 
                                                (datosBruto[i] === "Tesis de Grado")|| 
                                                (comparar === "e-Médica") || 
                                                (comparar === "sico Med")|| 
                                                (comparar === "nternado")|| 
                                                (comparar === "e-Intern")|| 
                                                (comparar === "otatorio")
                                            ) {
                                                i--;
                                                buscandoDatosMateria = false;
                                                buscandoIndiceSiguienteMateria = false;
                                               
                                            } else {
    
                                                if(datosBruto[i].length === 8) {
                                                    buscandoIndiceSiguienteMateria = false;
                                                    i--;
                                                }
                                            }
                                        }
                                    }
                                }

                                if((periodoSemestre === "Tesis de Grado" )) {
                                   
                                    esteSemestre = {
                                        semestre : periodoSemestre,
                                        tipo: "normal",
                                        materias : materiasDelSemestre
                                    }

                                } else {
                                    
                                    esteSemestre = {
                                        semestre : periodoSemestre,
                                        tipo: tipoSemestre,
                                        materias : materiasDelSemestre
                                    }

                                }

                                materiasDelSemestre = [];
                                indiceDelSemestre = 0;
                                
                                todosLosSemestres[inciceTodosLosSemestres] = esteSemestre;
                                inciceTodosLosSemestres++;
                            }
                        }
                    }     
                }
            }

            if (
                (faculta.trim() === "") || 
                (escuela.trim() === "") || 
                (carrera.trim() === "") || 
                (todosLosSemestres.length < 2)
            ) {
                setPensum({
                    error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
                });
    
                Swal.fire({
                    icon: 'error',
                    text: 'Hubo un error al extraer datos del Pensum',
                });
            } else {
                setPensum({
                    ...pensum,
                    carrera,
                    escuela,
                    faculta,
                    semestres : todosLosSemestres
                });

                setEnviar(true);
            }
                
        } catch (error) {
            
            setPensum({
                error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
            });

            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al extraer datos del Pensum',
            });

            setEnviar(false);
        }
    }

    async function GuardarPensum() {
        setMostrarSpinner(true);
        try {
            await firebase.agregarPensum(pensum);
            setMostrarSpinner(false);

            Swal.fire({
                icon: 'success',
                title: 'Pensum subido exitosamente',
                showConfirmButton: false,
                timer: 1500
            })

            setEnviar(false);

            setNewsContent("");

            setPensum({
                faculta : "",
                escuela : "",
                carrera : "",
                semestres : [{
                    semestre : "",
                    tipo: "",
                    materias :[{
                        clave : "",
                        asignatura : "",
                        creditos : ""
                    }]
                }]
            });

        } catch (error) {
            console.error('Hubo un error al guardar el Pensum', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el Pensum',
            })
            setMostrarSpinner(false);
            setEnviar(false);
        }
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <Container>
                <ContenedorPrincipal> 
                    <Contenedor>
                        <div>
                            <h2>Obterner datos del Pensum</h2>
                        </div>
                    </Contenedor>  
                    <div className="extratorContainer">
                    { mostrarSpinner ? <Spinner/> : <Fragment>
                        <div className="textEditorContainer">
                            { enviar ? null :
                                <TextEditor
                                    setNewsContent={setNewsContent}
                                /> 
                            }
                        </div>
                    </Fragment>}
                        <br/>
                            { mostrarSpinner ? null : <Fragment>
                                { enviar ? 
                                    <button
                                    onClick={ () => {GuardarPensum()}}
                                        type="button" 
                                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                    >
                                        Enviar al servidor
                                    </button>
                                :
                                    <button
                                        onClick={ () => { obtenerDatos()}}
                                        type="button" 
                                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                                    >
                                        Extraer Datos
                                    </button>
                                }
                            </Fragment>}
                        <br/>
                    </div>
                </ContenedorPrincipal>
            </Container>
        </ThemeProvider>
    );
}

export default AgregarPemsum;