import React from 'react';
import styled from '@emotion/styled';

const CarreraCard = styled.div`

    display: flex;
    flex-direction: column;
    background: #5089C6;
    background-color: rgba(255,255,255,0.4);
    border-color: #5089C6;
    box-shadow: 3px 5px 0px 0px #5089C6;
    margin: 18px;
    padding: 10px;
    border-radius: 20px;

    input:checked ~ .checkmarkTheme {
        background-color: red;
    }

    p {
        padding: 2px;
        margin: 2px;
    }

`;

const SeleccionarCarrera = ({carrera, setDatosExtras, datosExtras}) => {


    return (
        <CarreraCard>
            
            <label className="containerTheme">
                Seleccionar
                <input 
                    type="radio" 
                    name="carrera" 
                    onClick={() => setDatosExtras({
                        ...datosExtras,
                        carrera : carrera.carrera
                    })}
                />
                <span className="checkmarkTheme"></span>
            </label><p><b>{carrera.carrera}</b></p>
            <p>{carrera.faculta}</p>
        </CarreraCard>
    );
}

export default SeleccionarCarrera;