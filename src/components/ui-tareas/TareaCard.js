import React, { Fragment, useContext, useState } from 'react';
import styled from '@emotion/styled';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import firebase, { FirebaseContext } from '../../firebase';

import Spinner from '../Spinner';

import moment from 'moment';
import 'moment/locale/es' 

import Swal from 'sweetalert2/dist/sweetalert2.all.min.js'

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


const Contenedor = styled.div`
    width: 100%;
    display: flex;

    p {
        margin: 0;
        padding: 0;
    }
`;

const DatosDiv = styled.div`
    width: 100%;
    display: block;
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #6c757d;
    margin-top: 5px;
    margin-bottom: 8px;

    p {
        margin: 5px;
    }
`;

const MateriaDiv = styled.div`
    font-size: 14px;
    color: white;
    margin-bottom: 10px;

    span {
        background-color: rgb(3, 155, 229);
        border-radius: 10px;
        padding: 2px;
        padding-left: 10px;
        padding-right: 10px;
    }
`;

const HoraP = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    p {
        margin: 2;
        display: flex;
    }
`;

const BotonTarea = styled.button`
    padding: 3px;
    width: 85px;
    border-radius: 10px;
    margin: 5px;
    
    :hover {
        background-color: #B5B2B2;
    }
`;

const EditarDiv = styled.form`
    width: 100%;

    h2 {
        font-size: 20px;
        font-weight: bolder;
    }

    input {
        padding: 3px;
        border-radius: 5px;
        width: 100%;
    }

    textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        border-radius: 5px;
    }

    button {
        padding: 3px;
        width: 85px;
        border-radius: 10px;
    }

    button:hover {
        background-color: #B5B2B2;
    }

    div {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }
`;

const Label100PC = styled.label`
    width: 100%;
`;

const Select = styled.select`
    padding: 3px;
    border-radius: 5px;
`;

const TareaCard = ({tarea, setSubiendoTarea, tareas, setTareas, subiendoTarea}) => {

    
    const { usuarioDatos, horario} = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [ editando, setEditando ] = useState(false);

    const [ tareaEditando, setTareaEditando ] = useState({
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        hora: tarea.hora,
        materia : JSON.stringify({
            nombre : tarea.materia.nombre,
            color : tarea.materia.color,
        }),
        estado : tarea.estado,
        id : tarea.id
    })

    const userPrefersDarkMode = tipoTema;

    let colorFont = 'white';

    if(userPrefersDarkMode === true ) {
        colorFont = 'white'
    } else {
        colorFont = 'black'
    }

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditando(false);
    };

    const onClickBorrar = () => {

        handleClose();

        Swal.fire({
            title: '¿Estas Seguro de Borrar esta tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, deseo borrarla!',
            cancelButtonText: "Cancelar"
        }).then( async (result) => {
            if (result.isConfirmed) {

                let temp = [];

                // eslint-disable-next-line
                tareas.map(tareaContext => {
                    if(tarea.id !== tareaContext.id) {
                        temp.push(tareaContext);
                    }
                });

                if(temp.length > 0) {

                    let nuevoDatosUsuario = usuarioDatos;
                    nuevoDatosUsuario.tareas = temp;

                    setSubiendoTarea(true);
                    handleOpen();

                    try {
                        await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);
                        setTareas(temp);

                        handleClose();
                        setSubiendoTarea(false);
                        
                        let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
                        usuarioDatos.datos = nuevoDatosUsuario;

                        localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

                        Swal.fire(
                            '¡Borrada!',
                            'La tarea han sido borrada.',
                            'success'
                        )

                    } catch (error) {
                        console.log(error);
                        
                        handleClose();
                        setSubiendoTarea(false);
                        
                        Swal.fire({
                            icon: 'error',
                            text: 'Hubo un error al subir los cambios',
                        });
                    }

                } else {

                    let nuevoDatosUsuario = usuarioDatos;
                    nuevoDatosUsuario.tareas = [];

                    setSubiendoTarea(true);

                    try {
                        await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);
                        setTareas(temp);
                        setSubiendoTarea(false);
                        
                        let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
                        usuarioDatos.datos = nuevoDatosUsuario;

                        localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

                        Swal.fire(
                            '¡Borrada!',
                            'La tarea han sido borrada.',
                            'success'
                        );

                    } catch (error) {

                        console.log(error);

                        setSubiendoTarea(false);

                        Swal.fire({
                            icon: 'error',
                            text: 'Hubo un error al subir los cambios',
                        });
                    }
                }
            }
        });
    }

    const onClickEditar = () => {
        setEditando(true);
    }

    const onClickMarcar = async () => {

        let tareaTemp = {
            ...tareaEditando,
            estado : tareaEditando.estado === "Incompleta" ? "Completa" : "Incompleta"
        }

        let temp = [];
        tareaTemp.materia = JSON.parse(tareaEditando.materia);

        // eslint-disable-next-line
        tareas.map(tareaContext => {
            if(tarea.id === tareaContext.id) {
                temp.push(tareaTemp);
            } else {
                temp.push(tareaContext);
            }
        });

        let nuevoDatosUsuario = usuarioDatos;
        nuevoDatosUsuario.tareas = temp;

        setSubiendoTarea(true);

        try {
            await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);

            setTareas(temp);
            setSubiendoTarea(false); 

            let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
            usuarioDatos.datos = nuevoDatosUsuario;

            localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

        } catch (error) {

            console.log(error);
            setSubiendoTarea(false);
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al subir los cambios',
            });
        }
        
        handleClose();
    }

    const ExtraerNombreSinClave = materia => {
        let temp = "";
        for (let i = 0; i < materia.length; i++) {
            if (materia[i] === "-") {
                return temp;
            }
            temp += materia[i];
        }
        return temp;
    }

    const onChange = e => {
        setTareaEditando({
            ...tareaEditando,
            [e.target.name] : e.target.value
        });
    }

    const onSubmit = async (e) => {
        
        e.preventDefault();
        
        let tareaTemp = {
            ...tareaEditando
        }
        let temp = [];

        tareaTemp.materia = JSON.parse(tareaEditando.materia);

        // eslint-disable-next-line
        tareas.map(tareaContext => {
            if(tarea.id !== tareaContext.id) {
                temp.push(tareaContext);
            } else {
                temp.push(tareaTemp);
            }
        });

        let nuevoDatosUsuario = usuarioDatos;
        nuevoDatosUsuario.tareas = temp;

        setSubiendoTarea(true);

        try {
            await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);

            setTareas(temp);
            setSubiendoTarea(false); 

            let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
            usuarioDatos.datos = nuevoDatosUsuario;

            localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

        } catch (error) {

            console.log(error);
            setSubiendoTarea(false);
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al subir los cambios',
            });
        }

        handleClose();
    }

    return (
        <Fragment>
            <Contenedor>
                <DatosDiv
                    onClick={handleOpen}
                    style={{ boxShadow : tipoTema ? "2px 2px 5px #243b55" : "2px 2px 5px #999"}}
                >
                        <MateriaDiv>
                            <span style={{
                                backgroundColor: tarea.materia.color,
                                marginRight: 5
                            }}><b>{tarea.materia.nombre}</b></span>

                            <i style={{
                                color: usuarioDatos.tema ? 'white' : 'black',
                            }}>{moment(tarea.fecha).format('dddd, D')}</i>

                        </MateriaDiv>
                        <h5 
                            style={{ 
                                fontSize: 16
                            }} 
                        >{tarea.descripcion}</h5>
                        
                    </DatosDiv>
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
                            { editando ? <Fragment>
                                {subiendoTarea ? <Spinner/> : 
                                    <EditarDiv  onSubmit={onSubmit}>
                                        <h2>Editando</h2>
                                        <hr/>
                                        <Label100PC>Descripción : <br/>
                                            <textarea 
                                                name="descripcion" 
                                                value={tareaEditando.descripcion}
                                                id="descripcion"
                                                onChange={ (e) => onChange(e)} 
                                                required
                                            ></textarea>
                                        </Label100PC>
                                        <br/>
                                        <label>Materia : <br/>
                                            <Select 
                                                name="materia" 
                                                id="materia" 
                                                onChange={ (e) => onChange(e)}
                                                required
                                            >
                                                <option 
                                                    value={JSON.stringify({
                                                        nombre : tarea.materia.nombre,
                                                        color : tarea.materia.color,
                                                    })}
                                                >
                                                    {tarea.materia.nombre}
                                                </option>
                                                { horario ? 
                                                    <Fragment>
                                                        {horario.materias.map( materia => (
                                                            <option 
                                                                key={materia.id} 
                                                                value={JSON.stringify({
                                                                    nombre : ExtraerNombreSinClave(materia.materia),
                                                                    color : materia.color
                                                                })}
                                                            >
                                                                {ExtraerNombreSinClave(materia.materia)}
                                                            </option>
                                                        ))}
                                                    </Fragment>
                                                : null}
                                            </Select>
                                        </label>
                                        <br/>
                                        <div>
                                            <label>Hora : <br/>
                                                <input 
                                                    type="time"
                                                    value={tareaEditando.hora}
                                                    onChange={ (e) => onChange(e)}
                                                    name="hora" 
                                                    id="hora" 
                                                    required
                                                />
                                            </label>
                                            <label>Fecha : <br/>
                                                <input 
                                                    type="date" 
                                                    value={tareaEditando.fecha}
                                                    onChange={ (e) => onChange(e)}
                                                    name="fecha" 
                                                    id="fecha" 
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <hr/>
                                        <div>
                                            <button type="reset" onClick={ () => setEditando(false)}>Cancelar</button>
                                            <button type="submit" >Guardar</button>
                                        </div>
                                    </EditarDiv>
                                }
                            </Fragment> : <Fragment>
                                {subiendoTarea ? <Spinner/> : <Fragment>
                                    <h5>{tarea.descripcion}</h5>
                                    <br/>
                                    <p><span 
                                        style={{
                                            backgroundColor : tarea.materia.color,
                                            padding: 3,
                                            borderRadius: 10,
                                            color: 'white'
                                        }} 
                                    >{tarea.materia.nombre}</span></p>
                                    <HoraP>
                                    <p>
                                        <DateRangeIcon style={{ color: colorFont, marginRight: 5 }} /> 
                                        {moment(tarea.fecha).format('dddd, D MMMM')}
                                    </p>
                                    
                                    <p>
                                        <ScheduleIcon style={{ color: colorFont, marginRight: 5 }} />
                                        {moment(tarea.hora, "h:mm").format('h:mm a')}
                                    </p>
                                    </HoraP>

                                    <hr/>

                                    <BotonTarea onClick={onClickBorrar} >Borrar</BotonTarea>
                                    <BotonTarea onClick={onClickEditar}>Editar</BotonTarea>
                                    <BotonTarea onClick={onClickMarcar} style={{ width : 200}}>Marcar como {tarea.estado === "Incompleta" ? "Completa" : "Incompleta"}</BotonTarea>
                                </Fragment>} 
                            </Fragment>}
                        </div>
                    </Modal>
            </Contenedor>
        </Fragment>
    );
}

export default TareaCard;