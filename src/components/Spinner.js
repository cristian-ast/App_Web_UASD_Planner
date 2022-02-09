import React, { useContext } from "react";
import { FirebaseContext } from '../firebase';

const Spinner = () => {

    const { usuarioDatos } = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    return (
        <div className="spinner">
            <div style={{ backgroundColor: tipoTema ? "white" : "#333"}} className="rect1"></div>
            <div style={{ backgroundColor: tipoTema ? "white" : "#333"}} className="rect2"></div>
            <div style={{ backgroundColor: tipoTema ? "white" : "#333"}} className="rect3"></div>
            <div style={{ backgroundColor: tipoTema ? "white" : "#333"}} className="rect4"></div>
            <div style={{ backgroundColor: tipoTema ? "white" : "#333"}} className="rect5"></div>
        </div>
    );
}

export default Spinner;