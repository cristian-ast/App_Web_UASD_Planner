import React, { createContext, useState } from 'react';

export const ThemeModoContext = createContext();

const ThemeModoProvider = (props) => {

    const [ tipoTema, setTipoTema ] = useState(true);

    return (
        <ThemeModoContext.Provider
            value={{
                tipoTema,
                setTipoTema
            }}
        >
            {props.children}
        </ThemeModoContext.Provider>
    )
}

export default ThemeModoProvider;