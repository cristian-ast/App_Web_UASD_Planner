import React, { useState, useContext, Fragment, useEffect } from 'react';
import styled from '@emotion/styled';
import ContainerDrawer from '../components/ContainerDrawer';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";
import TareaCard from '../components/ui-tareas/TareaCard';
import '../bootstrap-buttons-15/css/ionicons.min.css';
import '../bootstrap-buttons-15/css/style.css';
import { v4 as uuid } from 'uuid';
import { useHistory } from "react-router-dom";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RefreshIcon from '@material-ui/icons/Refresh';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Spinner from '../components/Spinner';

import FlechaDB from "../img/flechaDB.png";
import FlechaDW from "../img/flechaDW.png";
import FlechaUB from "../img/flechaUB.png";
import FlechaUW from "../img/flechaUW.png";

import firebase, { FirebaseContext } from '../firebase';
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

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
`;

const Seccion = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 90%;
    max-width: 700px;
    background-color: rgba(255,255,255,0.2);
    padding: 20px;
    border-radius: 10px;

    h2 {
        font-size: 18px; 
        font-weight: bold;
        padding-top: 10px;
        text-align: center;
    }

    h3 {
        font-size: 16px; 
        text-align: center;
    }

    button {
        width: 100%;
        max-width: 150px;
        border-radius: 10px;
        padding: 4px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    button:hover {
        background-color: #B5B2B2;
    }

`;

const ContenedorBotonMas = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    button {
        margin: 8px;
        padding: 3px;
        border-radius: 10px;
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

const FlechaImg = styled.img`
    width: 20px;
`;

const CabereraCompletas = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
`;

const BorrarCompletasDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Tareas = () => {

    const { usuarioDatos, horario, cargandoPrimeraVez, usuario, setUsuarioDatos} = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const [ tareas, setTareas ] = useState( usuarioDatos ? usuarioDatos.tareas : null);
    const [ subiendoTarea, setSubiendoTarea ] = useState(false);

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');

    // Obteniendo la fecha actual con el formato correcto ****************
    const date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }

    if (month < 10) {
        month = '0' + month;
    }

    const dateNow = year+'-' + month + '-'+dt;

    /**********************************************************************/

    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
        setTareas(usuarioDatos ? usuarioDatos.tareas : null)
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const [ newTasks, setNewTasks ] = useState( { 
        materia : JSON.stringify({
            nombre : "Nínguna",
            color : "#9D9D9D"
        }),
        estado : "Incompleta",
        hora : "07:00",
        fecha : dateNow,
        id : 0
    });

    const [ mostartCompletas, setMostrarCompletas ] = useState(false);
    const [ siCompletas, setSiCompletas ] = useState(false);

    const [ refrecando, setRefrescando ] = useState(false);

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        setNewTasks({
            ...newTasks,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = async e => {
        
        e.preventDefault();
        
        let temp = [];

        if(tareas) {
            for (let i = 0; i < tareas.length; i++) {
                temp[i] = tareas[i];
            }
        }

        let nuevaTareas = newTasks;
        nuevaTareas.materia = JSON.parse(newTasks.materia);
        nuevaTareas.id = uuid();

        if(temp) {
            temp.push(nuevaTareas);
        } else {
            temp = [];
            temp[0] = nuevaTareas
        }

        let nuevoDatosUsuario = usuarioDatos;
        nuevoDatosUsuario.tareas = temp;

        setSubiendoTarea(true);

        try {
            await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);
            setSubiendoTarea(false);

            let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
            usuarioDatos.datos = nuevoDatosUsuario;

            localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));
            setTareas(temp);

        } catch (error) {
            console.log(error);
            setSubiendoTarea(false);
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al subir los cambios',
            });
        }

        setNewTasks({ 
            materia : JSON.stringify({
                nombre : "Nínguna",
                color : "#9D9D9D"
            }),
            hora : "07:00",
            fecha : dateNow,
            estado : "Incompleta"
        });

        handleClose();
    }

    const ObtenerIcono = () => {
        if (tipoTema) {
            if(mostartCompletas) {
                return FlechaDW;
            } else {
                return FlechaUW;
            }
        } else {
            if(mostartCompletas) {
                return FlechaDB;
            } else {
                return FlechaUB;
            }
        }
    }

    useEffect(() => {
        setSiCompletas(false);
        if(tareas){
            // eslint-disable-next-line
            tareas.map( tarea => {
                if(tarea.estado === "Completa") {
                    setSiCompletas(true);
                }
            })
        }
    }, [tareas]);

    useEffect(() => {
        setSiCompletas(false);
        if(tareas) {
            // eslint-disable-next-line
            tareas.map( tarea => {
                if(tarea.estado === "Completa") {
                    setSiCompletas(true);
                }
            });
        }
    // eslint-disable-next-line
    }, []);

    const onClickBorrarCompletas = () => {
        Swal.fire({
            title: '¿Estas Seguro de Borrar las tareas Completas?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, deseo borrarlas!',
            cancelButtonText: "Cancelar"
        }).then( async (result) => {
            if (result.isConfirmed) {
                
                let temp = [];

                // eslint-disable-next-line
                tareas.map(tareaContext => {
                    if(tareaContext.estado === "Incompleta") {
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
                    nuevoDatosUsuario.tareas = temp;

                    setSubiendoTarea(true);
                    handleOpen();

                    try {
                        await firebase.agregarMateriasModificadas(nuevoDatosUsuario.idUsuario, nuevoDatosUsuario);
                        setTareas(null);

                        handleClose();
                        setSubiendoTarea(false);
                        
                        let usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
                        usuarioDatos.datos = nuevoDatosUsuario;

                        localStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));

                    } catch (error) {
                        console.log(error);
                        handleClose();
                        setSubiendoTarea(false);
                        Swal.fire({
                            icon: 'error',
                            text: 'Hubo un error al subir los cambios',
                        });
                    }
                }

                Swal.fire(
                    '¡Borradas!',
                    'Las tareas han sido borradas.',
                    'success'
                )
            }
        })
    }

    const RefrescarUsuarioDatos = async () => {
        if(usuario) {
            setRefrescando(true);
            try {

              const respuesta = await firebase.obtenerDatosUsuario(usuario.uid);
              let newUsuariosDatos = respuesta.usuarioDatos ? respuesta.usuarioDatos.datos : null;
              setUsuarioDatos({...newUsuariosDatos});
      
            } catch (error) {
              console.error('Hubo un error al cargar los datos del usuario', error); 
              
            }
            setRefrescando(false);
        }
    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
                <Container>
                    <br/>
                    <br/>
                    <Seccion>
                        
                        {cargandoPrimeraVez ? <p>Buscando cambios...</p> : null}

                        {refrecando ? <p>Buscando cambios...</p> : null}
                        
                        <ContenedorBotonMas>

                            <button onClick={ () => RefrescarUsuarioDatos()} type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <RefreshIcon/> Actualizar
                            </button>

                            <button onClick={handleOpen} type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <AddCircleOutlineIcon/> Nueva Tarea 
                            </button>
                            
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
                                    {subiendoTarea ? <Spinner/> : 
                                        <EditarDiv  onSubmit={onSubmit}>
                                            <h2>Crear Tarea</h2>
                                            <hr/>
                                            <Label100PC>Descripción : <br/>
                                                <textarea 
                                                    name="descripcion" 
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
                                                            nombre : "Nínguna",
                                                            color : "#9D9D9D"
                                                        })}
                                                    >
                                                        Nínguna
                                                    </option>
                                                    { horario ? 
                                                        <Fragment>
                                                            {horario.estado ? 
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
                                                            </Fragment> :null}
                                                        </Fragment>
                                                    : null}
                                                </Select>
                                            </label>
                                            <br/>
                                            <div>
                                                <label>Hora : <br/>
                                                    <input 
                                                        type="time" 
                                                        onChange={ (e) => onChange(e)}
                                                        name="hora" 
                                                        id="hora"
                                                        defaultValue={"07:00"}
                                                    />
                                                </label>
                                                <label>Fecha : <br/>
                                                    <input 
                                                        type="date" 
                                                        onChange={ (e) => onChange(e)}
                                                        name="fecha" 
                                                        id="fecha" 
                                                        defaultValue={dateNow}
                                                    />
                                                </label>
                                            </div>
                                            <hr/>
                                            <div>
                                                <button type="reset" >Borrar</button>
                                                <button type="submit" >Guardar</button>
                                            </div>
                                        </EditarDiv> 
                                    }
                                </div>
                            </Modal>
                        </ContenedorBotonMas>
                    </Seccion>

                    <Seccion>
                        <b>Pendientes : </b> 
                        { tareas ? tareas.map(tarea => (
                            <Fragment key={tarea.id}>
                                { tarea.estado === "Incompleta" ? 
                                    <TareaCard 
                                        tarea={tarea}
                                        setSubiendoTarea = {setSubiendoTarea}
                                        subiendoTarea = {subiendoTarea}
                                        tareas = {tareas}
                                        setTareas = {setTareas}
                                        key={tarea.id}
                                    />  
                                : null} 
                            </Fragment>
                        )) : null}  
                    </Seccion>
                    <Seccion>
                        <CabereraCompletas onClick={ () => {
                            mostartCompletas ? setMostrarCompletas(false) : setMostrarCompletas(true)
                        }}>
                            <b>Completas : </b> <FlechaImg src={ObtenerIcono()} alt="Flecha" />
                        </CabereraCompletas>
                        { mostartCompletas ? <Fragment>
                            { tareas ? tareas.map(tarea => (
                                <Fragment key={tarea.id}>
                                    { tarea.estado === "Completa" ? 
                                        <TareaCard 
                                            tarea={tarea}
                                            setSubiendoTarea = {setSubiendoTarea}
                                            subiendoTarea = {subiendoTarea}
                                            tareas = {tareas}
                                            setTareas = {setTareas}
                                            key={tarea.id}
                                        /> 
                                    : null}
                                </Fragment>
                            )) : null}  
                            { siCompletas ? 
                                <BorrarCompletasDiv>
                                    <button 
                                        onClick={onClickBorrarCompletas}  
                                        type="button" 
                                        className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block"
                                    >Borrar completas</button>
                                </BorrarCompletasDiv>
                            : null}
                        </Fragment> : null}
                    </Seccion>
                </Container>
            </ContainerDrawer>
        </ThemeProvider>
    );
}

export default Tareas;