import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import Atras from '../../img/atras.png';
import TextEditor from '../TextEditor';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

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
            margin-bottom: 50px;
        }
    }
`;

const Cuarto = ({setPaso, usuario, firebase }) => {
    
    const [ newsContent, setNewsContent ] = useState("");
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ kardex, setKardex ] = useState({
        error : "Los datos obtenidos son iválidos. Por favor trata de nuevo"
    });

    const [ mostrarBotonOmitir, setMostrarBotonOmitir ] = useState(true);

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
            
                if((datosBruto[i] === "Programa:") || (datosBruto[i] === "Program:")){
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

                setMostrarBotonOmitir(false);

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
            setMostrarSpinner(false);
            setPaso("quinto");

        } catch (error) {
            console.error('Hubo un error al guardar el kardex', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el kardex',
            })
            setMostrarSpinner(false);
        }
    }

    async function OmitirPaso() {
        setMostrarSpinner(true);

        try {
            const idUsuario = usuario.uid;
            await firebase.agregarKardex(idUsuario, {estado : false});
            setMostrarSpinner(false);
            setPaso("quinto");

        } catch (error) {
            console.error('Hubo un error al omitir paso', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al omitir paso',
            })
            setMostrarSpinner(false);
        }
    }

    return (
        <ContenedorPrincipal> 
            { mostrarSpinner ? <Spinner/> : <Fragment>
                
            <Contenedor>
                
                <span>
                    <button
                        onClick={ () => {setPaso("tercero")}} 
                        type="button" 
                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block bon-atras"
                    >
                        <img src={Atras} alt="Atras Icon"/>
                        Atras
                    </button>

                    
                </span>
                
                
                <div>
                    <h2>Obterner datos del Kárdex</h2>
                    <p>Entra al Kárdex Academico por el portal oficial de la UASD, copia todos los datos y luego pégalos en el siguente editor de texto </p>
                    <p><strong>Nota: Si no lo copias todo, la app no funcionará bien. </strong></p>

                    {mostrarBotonOmitir ?
                        <button
                            onClick={ () => {OmitirPaso()}}
                            type="button" 
                            className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block"
                        >
                            Configurar más tarde
                        </button> 
                    : null}
                </div> 
        
            </Contenedor>  

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
                        Siguiente
                    </button>
                }
                
                <br/>
            </div>
            </Fragment>}
        </ContenedorPrincipal>
    );

}

export default Cuarto;