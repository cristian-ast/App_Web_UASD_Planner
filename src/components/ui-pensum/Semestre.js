import React from 'react';
import styled from '@emotion/styled';
import Materia from './Materia';

const SemestreContenedor = styled.div`
    width: 100%;
`;

const LetreroSemestre = styled.p`
    background-color: #ff78ae;
    color: white;
    width: 100%;
    padding-left: 10px;
    border-radius: 5px;
    margin-top: 10px;
`;

const Semestre = ({semestre, editando, setEdiando, cerrarVentanaMateria, setCerrarVentanaMateria}) => {
    return (
        <SemestreContenedor>
            <LetreroSemestre>{semestre.semestre} {semestre.tipo === "optativas" ? "(Optativas)" : null}</LetreroSemestre>

            {semestre.materias.map(materia => (
                <Materia 
                    key={materia.clave} 
                    materia={materia} 
                    setEdiando={setEdiando}
                    cerrarVentanaMateria = {cerrarVentanaMateria}
                    setCerrarVentanaMateria ={setCerrarVentanaMateria}
                />
            ))}
        </SemestreContenedor>

    );
}

export default Semestre;