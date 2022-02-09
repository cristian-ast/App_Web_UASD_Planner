import React, { useState, Fragment } from 'react';
import styled from '@emotion/styled';
import TextEditor from '../TextEditor';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';

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

const Quinto = ({setPaso, usuario, firebase}) => {
    
    const [ newsContent, setNewsContent ] = useState("");
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ horario, setHorario ] = useState({
        error : "Los datos obtenidos son iválidos. Por favor trata de nuevo."
    });

    const [ mostrarBotonOmitir, setMostrarBotonOmitir ] = useState(true);

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

                if((revisarSiEsTotalHorasCredito === "Total horas crédito:") || (revisarSiEsTotalHorasCredito === "Total Credit Hours: ")) {
                    
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
                        

                        if((datosBruto[j] !== "Periodo asociado:") && (datosBruto[j] !== "Associated Term:")){

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

                setMostrarBotonOmitir(false);
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
            setMostrarSpinner(false);
            setPaso("sexto");

        } catch (error) {
            console.error('Hubo un error al guardar el horario', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el horario',
            })
            setMostrarSpinner(false);
        }
    }

    async function OmitirPaso() {
        setMostrarSpinner(true);

        try {
            const idUsuario = usuario.uid;
            await firebase.agregarHorario(idUsuario, {estado : false});
            setMostrarSpinner(false);
            setPaso("sexto");

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
                    <div>
                        <h2>Obterner datos del Horario Detalle Alumno</h2>
                        <p>Entra al Horario Detalle Alumno por el portal oficial de la UASD, copia todos los datos y luego pégalos en el siguente editor de texto </p>
                        <p><strong>Nota: Si no lo copias todo, la app no funcionará bien. </strong></p>

                        {mostrarBotonOmitir ?
                            <button
                                onClick={ () => { OmitirPaso()}}
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
                    {horario.error ? 
                        <TextEditor
                            setNewsContent={setNewsContent}
                        />
                    : null }
                </div>

                <br/>

                {horario.error ? 
                    <button
                        onClick={ () => { obtenerDatos();}}
                        type="button" 
                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                    >
                        Guardar Datos
                    </button>
                : 
                    <button
                        onClick={ () => {GuardarHorario()}} 
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

export default Quinto;