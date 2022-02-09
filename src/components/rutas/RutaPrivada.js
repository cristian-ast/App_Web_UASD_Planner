import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';

const RutaPrivada = ({ component: Component, ...props}) => {

    let autenticado = false;

    const usuarioDatosBruto = JSON.parse(localStorage.getItem('usuarioDatos'));
    const { usuario } = useContext(FirebaseContext);

    if(usuarioDatosBruto) {
        autenticado = true;
    } else {
        if (usuario) {
            autenticado = true;
        }
    }
    
    return (
        <Route { ...props } render = { props => !autenticado ? (
            <Redirect to="/IniciarSesion" />
        ) : (
            <Component {...props} />
        )} />
    );
}

export default RutaPrivada;