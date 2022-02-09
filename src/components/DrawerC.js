import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SettingsIcon from '@material-ui/icons/Settings';
import BallotIcon from '@material-ui/icons/Ballot';

import { FirebaseContext } from '../firebase';

const DrawerC = (props) => {

    const { usuarioDatos } = useContext(FirebaseContext);

    const MenuIcoContainer = styled.div`
        position: fixed;
        padding: 1px;
        width: 100%;
        background-color: ${props => tipoTema ? '#141E30' : 'white'};
        box-shadow: 2px 2px 5px ${props => tipoTema ? '#243B55' : '#999'};
        z-index: 3;
        display: flex;
        justify-content: space-around;
    `;

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const userPrefersDarkMode = tipoTema;

    let colorFont = 'white';

    if(userPrefersDarkMode === true ) {
        colorFont = 'white'
    } else {
        colorFont = 'black'
    }

    return (
        <div>
            <MenuIcoContainer>
                <Link to={"/"}>
                    <ListItem button>
                        <ListItemIcon>
                        <HomeIcon style={{ color: colorFont }} />
                        </ListItemIcon>
                        <ListItemText style={{ color: colorFont }}  primary={"Inicio"} />
                    </ListItem>
                </Link>
            
                <Link to={"/Horario"}>
                    <ListItem button>
                        <ListItemIcon>
                        <ScheduleIcon style={{ color: colorFont }} />
                        </ListItemIcon>
                        <ListItemText style={{ color: colorFont }}  primary={"Horario"} />
                    </ListItem>
                </Link>
            
                <Link to={"/Calificaciones"}>
                    <ListItem button>
                        <ListItemIcon>
                        <AssessmentIcon style={{ color: colorFont }} />
                        </ListItemIcon>
                        <ListItemText style={{ color: colorFont }}  primary={"Calificaciones"} />
                    </ListItem>
                </Link>
            
                <Link to={"/Pensum"}>
                    <ListItem button>
                        <ListItemIcon>
                        <BallotIcon style={{ color: colorFont }} />
                        </ListItemIcon>
                        <ListItemText style={{ color: colorFont }}  primary={"Pensum"} />
                    </ListItem>
                </Link>
            
                <Link to={"/Tareas"}>
                    <ListItem button>
                        <ListItemIcon>
                        <AssignmentIcon  style={{ color: colorFont }} />
                        </ListItemIcon>
                        <ListItemText style={{ color: colorFont }}  primary={"Tareas"} />
                    </ListItem>
                </Link> 
    
                <Link to={"/Configuraciones"}>
                    <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon style={{ color: colorFont }} />
                    </ListItemIcon>
                    <ListItemText style={{ color: colorFont }}  primary={"Configuraciones"} />
                    </ListItem >
                </Link >
            </MenuIcoContainer>
        </div>
    );
}

export default DrawerC;