import React, { useState, Fragment } from 'react';
import styled from '@emotion/styled';
import Atras from '../../img/atras.png';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

const Contenedor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 20px;
        margin-right: 10px;
    }

    button {
        padding: 5px;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        max-width: 250px;
    }
    
`;

const TerminosDiv = styled.div`
    margin: 20px;
    text-align: justify;
    width: 80%;
    margin: 50px;
    max-width: 500px;


    h2 {
        font-size: 18px; 
        margin-bottom: 50px;
    }
`;

const Segundo = ({setPaso, datosExtras, setDatosExtras, firebase}) => {
    const [ mostrarSpinner, setMostrarSpinner ] = useState(false);

    const GuardarDatosExtrasFirebase = () => {

        if(datosExtras.terminosCondicionesAceptados === false) {
            Swal.fire({
                icon: 'error',
                text: 'Debes aceptar los términos y condiciones para poder utilizar esta herramienta',
            });
            return;
        }

        Guardar();
    }

    async function Guardar() {

        setMostrarSpinner(true);

        try {

            let newDatosExtras = {
                ...datosExtras,
                configuracionCompleta : false
            }
            
            await firebase.agregarDatosExtras(newDatosExtras);
            setMostrarSpinner(false);
            setPaso("tercero");

        } catch (error) {

            console.error('Hubo un error al guardar los datos', error); 

            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al guardar los datos',
            })
            setMostrarSpinner(false);
        }
    }

    return (
        <Contenedor>
            { mostrarSpinner ? <Spinner/> : <Fragment>
                <span>
                    <button
                        onClick={ () => {setPaso("primero")}} 
                        type="button" 
                        className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block bon-atras"
                    >
                        <img src={Atras} alt="Atras Icon"/>
                        Atras
                    </button>
                </span>
            
                <TerminosDiv>
                    <h2>Términos, condiciones</h2>
                    <p>• UASD Planner no es, ni busca ser una aplicación oficial de la Universidad Autónoma de Santo Domingo.</p>
                    <p>• UASD Planner se compromete a no compartir tus datos con terceros por ningún motivo.</p>
                    <p>• UASD Planner no tiene acceso a tu cuenta en el portal de la Universidad Autónoma de Santo Domingo, por lo cuál se nos hace imposible hacer algún cambio que perjudique tú perfil académico.</p>
                    <p>• UASD Planner no es responsable del uso que hagas con esta herramienta.</p>
                    <p>• UASD Planner es una herramienta creado por y para estudiantes, por lo cúal la Universidad Autónoma de Santo Domingo no te brindara níngun soporte o ayuda sobre el uso de esta herramienta. </p>
                    <p>• UASD Planner se reserva el derecho de cambiar los térnimos y condiciones en cualquier momento. En caso de que pase se te notificará con tiempo, de esta manera tendras el derecho de rechazarlos y dejar de usar la herramienta.</p>
                </TerminosDiv>

                <label className="containerCheckboxes">
                    Acepto términos y condiciones
                    <input 
                        type="checkbox" 
                        onChange={e => setDatosExtras({
                            ...datosExtras,
                            terminosCondicionesAceptados : e.target.checked
                        })}
                    />
                    <span className="checkmarkCheckboxes"></span>
                </label>

                <br/>

                <button
                    onClick={ () => {GuardarDatosExtrasFirebase()}} 
                    type="button" 
                    className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
                >
                    Siguiente
                </button>
            
            </Fragment>}

            <br/>
            
        </Contenedor>  
    );
}

export default Segundo;