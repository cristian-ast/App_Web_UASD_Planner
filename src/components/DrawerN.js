import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';

import HomeIcon from '@material-ui/icons/Home';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SettingsIcon from '@material-ui/icons/Settings';
import BallotIcon from '@material-ui/icons/Ballot';

import { FirebaseContext } from '../firebase';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  paperLight: {
    background: '#E2E2E2',
    color: 'black'
  },
  paperDark: {
    background: '#243B55',
    color: 'white'
  }
});

const DrawerN = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const MenuIcoContainer = styled.div`
    position: fixed;
    padding: 10px;
    width: 100%;
    background-color: ${props => tipoTema ? '#141E30' : 'white'};
    box-shadow: 2px 2px 5px ${props => tipoTema ? '#243B55' : '#999'};
    z-index: 3;
  `;

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
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
   
      </List>
      <Divider />
      <List>
        
      <Link to={"/Configuraciones"}>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon style={{ color: colorFont }} />
          </ListItemIcon>
          <ListItemText style={{ color: colorFont }}  primary={"Configuraciones"} />
        </ListItem >
      </Link >

      </List>
    </div>
  );

  const { usuarioDatos } = useContext(FirebaseContext);
  const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

  const userPrefersDarkMode = tipoTema;

  let colorFont = 'white';

  if(userPrefersDarkMode === true ) {
    colorFont = 'white'
  } else {
    colorFont = 'black'
  }

  const styles = useStyles();

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <MenuIcoContainer>
            <MenuIcon 
              onClick={toggleDrawer(anchor, true)}  
              style={{ 
                cursor: 'pointer', 
              }}
            />
          </MenuIcoContainer>
          <Drawer 
            anchor={anchor} 
            open={state[anchor]} 
            onClose={toggleDrawer(anchor, false)}
            classes={{ paper: userPrefersDarkMode ? styles.paperDark : styles.paperLight }
          }>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default DrawerN;