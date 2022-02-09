import React from 'react';
import styled from '@emotion/styled';

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
    
    button {
        padding: 5px;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        max-width: 250px;
    }
    
`;

const Tercero = ({setPaso}) => {
    return (
        <Contenedor>
            
            <div>
                <h2>Importante</h2>
                <p>Para obtener tus datos debes ir al autoservicio por el portal oficial de la Universidad Autonoma de Santo Domingo.</p>
                <p>Luego debes copiar todos los datos de tu Kárdex y Horario detalle alumno.</p>
                <p>Esto se debe hacer por separado, luego debes pegar esa información donde te indiquemos. </p>
            </div>


            <br/>

            <button
                onClick={ () => {setPaso("cuarto")}} 
                type="button" 
                className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block"
            >
                Entiendo
            </button>

            <br/>
            
        </Contenedor>  
    );
}

export default Tercero;