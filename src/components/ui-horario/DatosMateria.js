import React, { Fragment, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import styled from '@emotion/styled';
import { FirebaseContext } from '../../firebase';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '90%',
        maxWidth: 600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        borderRadius: 15,
        color: "#000000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const MateriaCard = styled.div`
    border-radius: 5px;
    width: 100%;

    span {
        padding: 1px;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 5px;
        color: white;
        text-shadow: 2px 2px 4px #000000;
    }
`;

const DivDatos = styled.div`
    line-height: 1.1;
    border-radius: 10px;
    margin-left: 0;
`;

const DivMateriaCampus = styled.div`
    width: 100%;
    line-height: normal;
    text-align: center;

    p {
        margin: 0;
    }
`;

const DatosMateria = ({clase, english}) => {

    const { usuarioDatos } = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const ObtenerDia = diaEnCaracteres => {

        let temp = "";

        if(english) {
            for (let i = 0; i < diaEnCaracteres.length; i++) {
                if(diaEnCaracteres[i] === "M") {
                    if(diaEnCaracteres.length === i + 1) {
                        temp += "Lunes ";
                        return temp;
                    } else {
                        temp += "Lunes ";
                    }
                } else {
                    if(diaEnCaracteres[i] === "T") {
                        if(diaEnCaracteres.length === i + 1) {
                            temp += "Martes ";
                            return temp;
                        } else {
                            temp += "Martes ";
                        }
                    } else {
                        if(diaEnCaracteres[i] === "W") {
                            if(diaEnCaracteres.length === i + 1) {
                                temp += "Miércoles ";
                                return temp;
                            } else {
                                temp += "Miércoles ";
                            }
                        } else {
                            if(diaEnCaracteres[i] === "R") {
                                if(diaEnCaracteres.length === i + 1) {
                                    temp += "Jueves ";
                                    return temp;
                                } else {
                                    temp += "Jueves ";
                                }
                            } else {
                                if(diaEnCaracteres[i] === "F") {
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
        } else {
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
    }

    return (
        <Fragment>
            <div onClick={handleOpen}
                key={`${clase.gridColumn}-${clase.gridRow}-${clase.cantidadHoras}`}
                style={{
                    gridColumn: clase.gridColumn,
                    gridRow: `${clase.gridRow} / span ${clase.cantidadHoras}`,
                    backgroundColor: clase.color,
                    borderColor: clase.color
                }}
                className="event"
            > 
                <p style={{fontSize: 11}}>{clase.materia}</p> 
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div 
                    style={{
                        ...modalStyle,
                        backgroundColor : tipoTema ? "rgb(36, 59, 85)" : 'rgb(226, 226, 226)',
                        color: tipoTema ? 'white' : 'black'
                    }} 
                    className={classes.paper}
                >
                    <MateriaCard >
                        <DivDatos>
                            <DivMateriaCampus>
                                <p><b>{clase.datos.materia}</b></p>
                                <p>{clase.datos.campus} </p>
                            </DivMateriaCampus>
                            <br/><br/>
                            <p><span style={{ backgroundColor: clase.color}}> NRC :</span> {clase.datos.nrc} / <span style={{ backgroundColor: clase.color}}>Créditos :</span> {clase.datos.creditos}</p>
                            
                            <p><span style={{ backgroundColor: clase.color}}>Maestro :</span> {clase.datos.instructorAsignado}</p>
                            <br/>
                            <DivMateriaCampus>
                                <p> <span style={{ backgroundColor: clase.color}}> Horarios </span></p>
                            </DivMateriaCampus>
                            <hr/>
                            {clase.datos.horario.map(hora => (
                                <Fragment key={`${hora.dia}-${hora.hora}-${hora.donde}`}>
                                    <p><span style={{ backgroundColor: clase.color}}>Dia :</span> {ObtenerDia(hora.dia)} : {hora.hora}</p>
                                    <p><span style={{ backgroundColor: clase.color}}>Lugar :</span> {hora.donde}</p>
                                    <hr/>
                                </Fragment>
                            ))}
                        </DivDatos>
                    </MateriaCard>
                </div>
            </Modal> 
        </Fragment>
    );
}

export default DatosMateria;