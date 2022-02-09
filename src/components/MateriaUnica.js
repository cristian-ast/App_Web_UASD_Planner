import React, { Fragment } from 'react';
import styled from '@emotion/styled';

const ContenedorPrincipal = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const MateriaCard = styled.div`
    border-radius: 5px;
    width: 100%;
    padding: 10px;
    margin: 10px;
    border-left: 10px solid;

    span {
        padding: 5px;
        border-radius: 5px;
        color: white;
        text-shadow: 2px 2px 4px #000000;
    }
`;

const DivDatos = styled.div`
    margin: 20px;
    font-weight: bolder; 
    padding: 10px;
    border-radius: 10px;
    margin-left: 0;
`;

const DivMateriaCampus = styled.div`
    width: 100%;
    text-align: center;
`;

const MateriaUnica = ({materiaActiva, setMostrarElemento, setMateriaActiva}) => {


    const ObtenerDia = diaEnCaracteres => {

        let temp = "";

        for (let i = 0; i < diaEnCaracteres.length; i++) {
            if(diaEnCaracteres[i] === "L") {
                if(diaEnCaracteres.length === i + 1) {
                    temp += "Lunes ";
                    return temp;
                } else {
                    temp += "Lunes ";
                }
            } else {
                if(diaEnCaracteres[i] === "M") {
                    if(diaEnCaracteres.length === i + 1) {
                        temp += "Martes ";
                        return temp;
                    } else {
                        temp += "Martes ";
                    }
                } else {
                    if(diaEnCaracteres[i] === "I") {
                        if(diaEnCaracteres.length === i + 1) {
                            temp += "Miércoles ";
                            return temp;
                        } else {
                            temp += "Miércoles ";
                        }
                    } else {
                        if(diaEnCaracteres[i] === "J") {
                            if(diaEnCaracteres.length === i + 1) {
                                temp += "Jueves ";
                                return temp;
                            } else {
                                temp += "Jueves ";
                            }
                        } else {
                            if(diaEnCaracteres[i] === "V") {
                                if(diaEnCaracteres.length === i + 1) {
                                    temp += "Viernes ";
                                    return temp;
                                } else {
                                    temp += "Viernes ";
                                }
                            } else {
                                if(diaEnCaracteres[i] === "S") {
                                    if(diaEnCaracteres.length === i + 1) {
                                        temp += "Sábado ";
                                        return temp;
                                    } else {
                                        temp += "Sábado ";
                                    }
                                } else {
                                    if(diaEnCaracteres[i] === "P") {
                                        return "Nínguno";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return (
        <ContenedorPrincipal>
            <MateriaCard 
                style={{
                    borderLeftColor: materiaActiva.color
                }}
            >

                <DivDatos>
                    <DivMateriaCampus>
                        <p>{materiaActiva.materia} </p>
                        <p>{materiaActiva.campus} </p>
                    </DivMateriaCampus>
                    <br/>
                    <p><span style={{ backgroundColor: materiaActiva.color}}> NRC :</span> {materiaActiva.nrc}</p>
                    <p><span style={{ backgroundColor: materiaActiva.color}}>Créditos :</span> {materiaActiva.creditos}</p>
                    <p><span style={{ backgroundColor: materiaActiva.color}}>Maestro :</span> {materiaActiva.instructorAsignado}</p>
                    <br/>
                    <DivMateriaCampus>
                        <p> <span style={{ backgroundColor: materiaActiva.color}}> Horarios </span></p>
                    </DivMateriaCampus>
                    <hr/>
                    {materiaActiva.horario.map(hora => (
                        <Fragment>
                            <p><span style={{ backgroundColor: materiaActiva.color}}>Dia :</span> {ObtenerDia(hora.dia)}</p>
                            <p><span style={{ backgroundColor: materiaActiva.color}}>Hora :</span> {hora.hora}</p>
                            <p><span style={{ backgroundColor: materiaActiva.color}}>Lugar :</span> {hora.donde}</p>
                            <hr/>
                        </Fragment>
                    ))}
                </DivDatos>
                
            </MateriaCard>
        </ContenedorPrincipal>
    );
}

export default MateriaUnica;