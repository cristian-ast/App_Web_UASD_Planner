import React, { useContext } from "react";
import styled from '@emotion/styled';
import { FirebaseContext } from '../../firebase';

const ContenedorDiv = styled.div`
    position: fixed;
    display: flex;
    padding: 10px;
    bottom: 0; 
    z-index:999999; 
    border-radius: 15px 15px 0 0;

    button {
        border-radius: 5px;
        margin: 10px;
    }

    button:hover {
        background-color: #B5B2B2;
    }
`;

const Opciones = ({setEdiando, Guardar, Cancelar}) => {

    const {  usuarioDatos} = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    return (
        <ContenedorDiv 
            style={{
                backgroundColor : tipoTema ? "#243B55" : '#E2E2E2',
                color: tipoTema ? 'white' : 'black'
            }}
        >
            <button
                type="button" 
                onClick={ () => {setEdiando(false); Guardar();}}
            >Guardar Cambios</button>

            <button
                type="button" 
                onClick={ () => {setEdiando(false); Cancelar();}}
            >Cancelar</button>
        </ContenedorDiv>
    );
}

export default Opciones;