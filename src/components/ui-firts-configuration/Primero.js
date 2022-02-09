import React, { useState, Fragment, useEffect } from 'react';
import styled from '@emotion/styled';
import SeleccionarCarrera from '../SeleccionarCarrera';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

const Contenedor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    
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
        max-width: 250px;
    }
`;

const ContenedorPrincipalBuscar = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    margin-left: 10px;
    margin-right: 10px;
    width: 100%;
    padding: 20px;
    
`;

// const ContenedorBuscarCarrera = styled.div`

//     display: flex;
//     width: 100%;
//     justify-content: center;

//     input {
//         border: none;
//         outline: none;
//         font-weight: bold;
//         width: 100%;
//         box-shadow: 2px 2px 5px #999;
//     }

// `;

const ContenedorSwitchTheme = styled.div`
    width: 70%;
    background-color: rgba(255,255,255,0.2);
    padding: 20px;
    border-radius: 10px;
    margin-top: 50px;
    margin-bottom: 50px;

`;

const Primero = ({setPaso, setTema, firebase, usuario, datosExtras, setDatosExtras}) => {

    //const [ carreras, setCarreras ] = useState([]);
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);
    const [ carrerasEncontradas, setCarrerasEncontradas ] = useState([]);

    async function RevisarCarreras(nombre) {

        setMostrarSpinner(true);

        try {

            let carrerasTemp = await firebase.obtenerCarrera(nombre);
            let datosAGuardar = [];
            const busqueda = nombre.toLowerCase();

            setMostrarSpinner(false);

            const filtro = carrerasTemp.filter( carrera => {
                return (
                    carrera.datos.carrera.toLowerCase().includes(busqueda)
                )
            });

            //setCarreras(filtro);

            for (let i = 0; i < filtro.length; i++) {
                datosAGuardar.push(filtro[i]);
                if (i > 4 ) {
                    i = filtro.length + 1;
                } 
            }

            setCarrerasEncontradas(datosAGuardar);

        } catch (error) {
            console.error('Hubo un error al guardar el horario', error); 
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar el horario',
            })
            setMostrarSpinner(false);
        }
    }

    // const onChangeText = e => {
        
    //     const nombre = e.target.value;
    //     let carrerasTemp = carreras;
    //     const busqueda = nombre.toLowerCase();
    //     let datosAGuardar = [];
            
    //     const filtro = carrerasTemp.filter( carrera => {
    //         return (
    //             carrera.datos.carrera.toLowerCase().includes(busqueda)
    //         )
    //     });

    //     for (let i = 0; i < filtro.length; i++) { 
    //         datosAGuardar.push(filtro[i]); 
    //         if (i > 3 ) {
    //             i = filtro.length + 1;
    //         } 
    //     }

    //     setCarrerasEncontradas(datosAGuardar);
    // }

    const guardarDatosExtras = () => {

        if(datosExtras.carrera === null){
            Swal.fire({
                icon: 'error',
                text: 'Debes seleccionar una carrera para continuar',
            });
            return;
        } else {
            if(datosExtras.tema === null) {
                Swal.fire({
                    icon: 'error',
                    text: 'Debes seleccionar un tema para continuar',
                });
                return;
            } else {
                if(datosExtras.idUsuario === null) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Usuario no autorizado para realizar este proceso',
                    });
                    return;
                }
            }
        }

        setPaso("segundo");
        
    }

    useEffect(() => {
        RevisarCarreras("");
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(usuario) {
            setDatosExtras({
                ...datosExtras,
                idUsuario : usuario.uid
            });
        }
    // eslint-disable-next-line
    }, [usuario]);

    useEffect(() => {
        if(usuario) {
            setDatosExtras({
                ...datosExtras,
                idUsuario : usuario.uid
            })
        }
    // eslint-disable-next-line
    }, []);

    return (
        <Contenedor>
            <ContenedorPrincipalBuscar>
                
                <h2>Elige tu carrera : </h2>

                { mostrarSpinner ? <Spinner/> : <Fragment>
                    <div>
                        {carrerasEncontradas.map( (carrera) => (
                            <SeleccionarCarrera 
                                key={carrera.id} 
                                carrera={carrera.datos} 
                                setDatosExtras={setDatosExtras}
                                datosExtras={datosExtras}
                            />
                        ))}
                    </div>
                </Fragment>}

            </ContenedorPrincipalBuscar>
            
            
            <ContenedorSwitchTheme>
                <h2>¿Con cuál tema te sientes más agusto?</h2>

                <label className="containerTheme">Claro
                    <input 
                        type="radio" 
                        name="radio" 
                        onClick={ () => {
                            setTema({name : "Claro"});
                            setDatosExtras({
                                ...datosExtras,
                                tema : false
                            });
                        }}/>
                    <span className="checkmarkTheme"></span>
                </label>

                <label className="containerTheme">Oscuro
                    <input 
                        type="radio" 
                        name="radio" 
                        onClick={ () => {
                            setTema({name : "Oscuro"});
                            setDatosExtras({
                                ...datosExtras,
                                tema : true
                            })
                        }}/>
                    <span className="checkmarkTheme"></span>
                </label>
            </ContenedorSwitchTheme>
            
            {usuario ? 
                <button 
                    onClick={ () => { guardarDatosExtras()}} 
                    type="button" 
                    className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                >
                    Siguiente
                </button>
            :null}
            <br/>
            
        </Contenedor>
    );
}

export default Primero;