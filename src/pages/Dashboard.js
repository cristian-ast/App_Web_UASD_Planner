import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styled from '@emotion/styled';
import MovilDashboard from '../components/ui-dashboard/MovilDashboard';
import LaptopDashboard from '../components/ui-dashboard/LaptopDashboard';
import { FirebaseContext } from '../firebase';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

const MovilDashboardContainer = styled.div`
    
    display: block;

    @media only screen and (min-width: 950px) {
        display: none;
    }
`;

const LaptopDashboardContainer = styled.div`
    
    display: none;

    @media only screen and (min-width: 950px) {
        display: block;
    }
`;

const Dashboard = () => {

    const { usuarioDatos } = useContext(FirebaseContext);

    const history = useHistory();

    console.log(usuarioDatos);

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');

    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <MovilDashboardContainer>
                <MovilDashboard/>
            </MovilDashboardContainer>

            <LaptopDashboardContainer>
                <LaptopDashboard/>
            </LaptopDashboardContainer>

        </ThemeProvider>
    );
}

export default Dashboard;