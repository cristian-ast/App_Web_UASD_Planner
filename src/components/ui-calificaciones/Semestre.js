import React from 'react';
import styled from '@emotion/styled';

const CalificacionesCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
        background-color: #ff78ae;
        color: white;
        width: 100%;
        padding-left: 10px;
        border-radius: 5px;
        margin-top: 10px;
    }
`;

const MateriasContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 400px;

    p {
        margin: 10px;
    }
`;

const Semestre = ({semestre}) => {
    return (
        <CalificacionesCard>
            <span>{semestre.periodo}</span>
            {semestre.materias.map(materia => (
                <MateriasContainer key={materia.titulo + materia.calificacion}>
                    <p>{materia.titulo}</p>
                    <p><b>{materia.calificacion}</b></p>
                </MateriasContainer>
            ))}
        </CalificacionesCard>
    );
}

export default Semestre;