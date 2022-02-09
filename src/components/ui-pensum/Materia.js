import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Gris from '../../img/gris.png';
import Verde from '../../img/verde.png';
import Amarillo from '../../img/amarillo.png';
import { DataContext } from '../../context/DataContext';
import { FirebaseContext } from '../../firebase';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

const MateriasContenedor = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;

    p {
        margin: 0;
    }

    :hover {
        background-color: rgba(255,255,255,0.3);
    }
`;

const AsignaturaDiv = styled.div`
    width: 80%;
`;

const CreditosDiv = styled.div`
    width: 20%;
    text-align: center;
`;

const EstadoImg = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;


const Select = styled.select`
    padding: 3px;
    margin-left: 10px;
    border-radius: 5px;
`;

const Materia = ({materia, setEdiando, cerrarVentanaMateria, setCerrarVentanaMateria}) => {

    const { materiasModificadas, setMateriasModificadas } = useContext(DataContext); //setMateriasModificadas

    const { kardex, horario, usuarioDatos} = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const RevisarEstadoMateria = () => {

        let estado = "Restante";

        if(kardex.estado) {
            // eslint-disable-next-line
            kardex.periodos.map( periodo => {
                // eslint-disable-next-line
                periodo.materias.map( materiaKardex => {   
                    const comparar = materiaKardex.materia + "-" + materiaKardex.curso;
                    if(materia.clave === comparar) {
                        estado = "Aprovada";
                    }
                });
            });
        }
        
        if(horario.estado) {
            // eslint-disable-next-line
            horario.materias.map( materiaHorario => {
                // Estraer la clave de ma materia del nombre
                let temp = "";
                for (let i = 0; i < materiaHorario.materia.length; i++) {
                    if(materiaHorario.materia[i] === "-") {
                        i = i + 2;
                        temp += materiaHorario.materia[i];
                        i++;
                        temp += materiaHorario.materia[i];
                        i++;
                        temp += materiaHorario.materia[i];
                        temp += "-";
                        i = i + 2;
                        temp += materiaHorario.materia[i];
                        i++;
                        temp += materiaHorario.materia[i];
                        i++;
                        temp += materiaHorario.materia[i];
                        i++;
                        temp += materiaHorario.materia[i];
                    }

                    if(materia.clave === temp) {
                        estado = "Activa";
                    }
                }
            });
        }
        
        if(materiasModificadas){
            if (materiasModificadas.length > 0) {
                // eslint-disable-next-line
                materiasModificadas.map( materiaMod => {
                    
                    if(materia.clave === materiaMod.clave) {
                        if(materiaMod.estado === "Aprovada") {
                            estado = "Aprovada"
                        } else {
                            if(materiaMod.estado === "Activa") {
                                estado = "Activa"
                            }
                        }
                    }
                });
            }
        }

        if(estado === "Aprovada") {
            return Verde
        } else {
            if(estado === "Activa")  {
                return Amarillo
            } else {
                return Gris
            }
        }
    }

    
    const [ estadoMateria, setEstadoMateria ] = useState(Gris);

    useEffect(() => {
        setEstadoMateria(RevisarEstadoMateria());
    // eslint-disable-next-line
    }, []);

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChangeEstado = e => {

        setEdiando(true);
        
        setEstadoMateria(e.target.value);

        let temp = materiasModificadas;

        if(temp === null) {
            temp = [];
        }

        let estadoM = "Restante";

        if(e.target.value === Verde) {
            estadoM = "Aprovada";
        } else {
            if(e.target.value === Amarillo) {
                estadoM = "Activa";
            }
        }

        let i = 0;
        
        if(temp) {
            for ( i ; i < temp.length; i++) {
                if(materia.clave === temp[i].clave) {
                    temp[i] = {
                        clave : materia.clave,
                        estado : estadoM
                    }

                    setMateriasModificadas(temp);
                    return;
                }
            }
        }

        temp.push({
            clave : materia.clave,
            estado : estadoM
        });
        
        setMateriasModificadas(temp);
    }

    useEffect(() => {
        if (cerrarVentanaMateria) {
            handleClose();
            setCerrarVentanaMateria();
        }
    // eslint-disable-next-line 
    }, [cerrarVentanaMateria])

    return (
        <Fragment>
            <MateriasContenedor onClick={handleOpen}>
                <EstadoImg src={estadoMateria} alt="Estado de la materia ico"/>
                <AsignaturaDiv><p>{materia.asignatura}</p></AsignaturaDiv>
                <CreditosDiv><p>{materia.creditos}</p></CreditosDiv>
            </MateriasContenedor>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div style={{
                    ...modalStyle,
                    backgroundColor : tipoTema ? "#243B55" : '#E2E2E2',
                    color: tipoTema ? 'white' : 'black'
                }} className={classes.paper}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <EstadoImg src={estadoMateria} alt="Estado de la materia ico"/>
                        <h5 style={{ margin: 0 }}><b>{materia.asignatura}</b> </h5> 
                    </div>
                    <hr/>
                    <p>Clave : <b>{materia.clave}</b></p>
                    <p>Créditos : <b>{materia.creditos}</b></p>
                    
                    <label htmlFor="tipo">Cambiar estado de la materia : </label>
                    <Select 
                        name="tipo" 
                        id="tipo" 
                        value={estadoMateria}
                        onChange={onChangeEstado}
                    >
                        <option value={Gris}>Restante</option>
                        <option value={Verde}>Aprovada</option>
                        <option value={Amarillo}>Activa</option>
                    </Select>
                </div>  
            </Modal>
        </Fragment>
    );
}

export default Materia;