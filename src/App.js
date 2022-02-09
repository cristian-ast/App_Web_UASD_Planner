import './App.css';
import React, { useEffect, useState } from "react";
import firebase, { FirebaseContext } from './firebase';
import useAutenticacion from './context/useAutenticacion';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import IniciarSesion from './pages/IniciarSesion';
import ConfigurarPrimeraVez from './pages/ConfigurarPrimeraVez';
import CrearCuenta from './pages/CrearCuenta';
import RecuperarCuenta from './pages/RecuperarCuenta';
import Dashboard from './pages/Dashboard';
import Horario from './pages/Horario';
import Calificaciones from './pages/Calificaciones';
import Pensum from './pages/Pensum';
import Tareas from './pages/Tareas';
import Configuraciones from './pages/Configuraciones';
import AgregarPensum from './pages/AgregarPensum';
import SubirKardex from './pages/SubirKardex';
import SubirHorario from './pages/SubirHorario';
import ModificarCarrera from './pages/ModificarCarrera';
import CambiarClave from './pages/CambiarClave';
import RutaPrivada from './components/rutas/RutaPrivada';

import ThemeModoProvider from './context/ThemeContext';
import DataProvider from './context/DataContext';

function App() {

  const usuarioDatosBruto = JSON.parse(localStorage.getItem('usuarioDatos'));
  const pensumBruto = JSON.parse(localStorage.getItem('pensum'));
  const kardexBruto = JSON.parse(localStorage.getItem('kardex'));
  const horarioBruto = JSON.parse(localStorage.getItem('horario'));
  
  const [usuarioDatos, setUsuarioDatos] = useState(usuarioDatosBruto ? usuarioDatosBruto.datos : null);
  const [pensum, setPensum] = useState(pensumBruto ? pensumBruto.datos : null);
  const [kardex, setKardex] = useState(kardexBruto ? kardexBruto.datos : null);
  const [horario, setHorario] = useState(horarioBruto ? horarioBruto.datos : null);

  const [datosResividos, setDatosResividos] = useState(false);
  
  const [ cargandoPrimeraVez, setCargandoPrimeraVez ] = useState(true);

  const usuario = useAutenticacion();

  const [ datos, setDatos ] = useState({
    pensum : pensumBruto,
    kardex : kardexBruto,
    horario : horarioBruto,
    usuarioDatos : usuarioDatosBruto
  });

  async function obtenerDatos() {
    if(usuario) {
      try {
        const respuesta = await firebase.obtenerDatosUsuario(usuario.uid);
        setDatos({...respuesta});
        setDatosResividos(true);
        setCargandoPrimeraVez(false);

      } catch (error) {
        console.error('Hubo un error al cargar los datos del usuario', error); 
        setCargandoPrimeraVez(false);
      }
    }
  }

  useEffect(() => {
    obtenerDatos();
    if(usuarioDatos == null) {
      setCargandoPrimeraVez(true);
    }
  // eslint-disable-next-line
  }, [usuario]);

  useEffect(() => {

    if(datos) {
      if(datos.usuarioDatos) {localStorage.setItem('usuarioDatos', JSON.stringify(datos.usuarioDatos));}
      if(datos.pensum) {localStorage.setItem('pensum', JSON.stringify(datos.pensum));}
      if(datos.kardex) {localStorage.setItem('kardex', JSON.stringify(datos.kardex));}
      if(datos.horario) {localStorage.setItem('horario', JSON.stringify(datos.horario));}
      
      let newUsuariosDatos = datos.usuarioDatos ? datos.usuarioDatos.datos : null
      let newPensun = datos.pensum ? datos.pensum.datos : null;
      let newKardex = datos.kardex ? datos.kardex.datos : null;
      let newHorario = datos.horario ? datos.horario.datos : null;

      setUsuarioDatos({...newUsuariosDatos});
      setPensum({...newPensun});
      setKardex({...newKardex});
      setHorario({...newHorario});
    }
    
  }, [datos]);

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario, 
        cargandoPrimeraVez,
        usuarioDatos,
        kardex,
        horario,
        pensum,
        datosResividos,
        setDatos,
        setUsuarioDatos,
        setPensum,
        setKardex,
        setHorario
      }}
    >
      <ThemeModoProvider>
        <DataProvider>
          <Router>
            <Switch>
              
              <Route exact path="/IniciarSesion" component={IniciarSesion} />
              <Route exact path="/CrearCuenta" component={CrearCuenta} />
              <Route exact path="/RecuperarCuenta" component={RecuperarCuenta} />
              
              <RutaPrivada exact path="/" component={Dashboard} />
              <RutaPrivada exact path="/ConfigurarPrimeraVez" component={ConfigurarPrimeraVez} />
              <RutaPrivada exact path="/Horario" component={Horario} />
              <RutaPrivada exact path="/Calificaciones" component={Calificaciones} />
              <RutaPrivada exact path="/Pensum" component={Pensum} />
              <RutaPrivada exact path="/Tareas" component={Tareas} />
              <RutaPrivada exact path="/Configuraciones" component={Configuraciones} />
              <RutaPrivada exact path="/AgregarPensum" component={AgregarPensum} />
              <RutaPrivada exact path="/SubirKardex" component={SubirKardex} />
              <RutaPrivada exact path="/SubirHorario" component={SubirHorario} />
              <RutaPrivada exact path="/ModificarCarrera" component={ModificarCarrera} />
              <RutaPrivada exact path="/CambiarClave" component={CambiarClave} />
              
            </Switch>
          </Router>
        </DataProvider>
      </ThemeModoProvider>
    </FirebaseContext.Provider>
  );
}

export default App;