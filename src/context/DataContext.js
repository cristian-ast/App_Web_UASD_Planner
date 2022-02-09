import React, { createContext, useState } from 'react';

// crear el Contex
export const DataContext = createContext();

// provider es donde se encuenran las funciones y state
const DataProvider = (props) => {

    const usuarioDatos = JSON.parse(localStorage.getItem('usuarioDatos'));
    const [ materiasModificadas, setMateriasModificadas ] = useState( usuarioDatos ? usuarioDatos.datos.materiasModificadas : null);

    return (
        <DataContext.Provider
            value={{ 
                materiasModificadas,
                setMateriasModificadas
            }}
        >
            {props.children}
        </DataContext.Provider>
    )
}

export default DataProvider;