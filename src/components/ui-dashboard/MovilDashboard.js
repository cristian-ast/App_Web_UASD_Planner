import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";
import '../../bootstrap-buttons-15/css/ionicons.min.css';
import '../../bootstrap-buttons-15/css/style.css'
import ContainerDrawer from '../../components/ContainerDrawer';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import BallotIcon from '@material-ui/icons/Ballot';

import { FirebaseContext } from '../../firebase';

const DashboarContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Seccion = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 90%;
    max-width: 400px;
    background-color: rgba(255,255,255,0.2);
    padding: 20px;
    border-radius: 10px;

    h2 {
        font-size: 18px; 
        font-weight: bold;
    }

    button {
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
    }

`;

const EnlacesExternos = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        width: 100%;
        max-width: 250px;
    }

    button {
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        max-width: 250px;
    }
`;

const ContenedorAtajos = styled.div`
    display: flex;
    justify-content: center;
    
    
    flex-wrap: wrap;
`;

const AtajoCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 100px;
    padding: 10px;
    align-items: center;
    border-radius: 10px;
    margin: 20px;
    cursor: pointer;

    span {
        background-color: #ff78ae;
        color: white;
        padding-left: 10px;
        border-radius: 5px;
    }

    p {
        margin-top: 5px;
        background-color: none;
        border-radius: 5px;
    }
`;

const MovilDashboard = () => {
    
    const { usuarioDatos } = useContext(FirebaseContext);
    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const userPrefersDarkMode = tipoTema;

    let colorFont = 'white';

    if(userPrefersDarkMode === true ) {
        colorFont = 'white'
    } else {
        colorFont = 'black'
    }

    return (
        <ContainerDrawer>
            <DashboarContainer>
            <br/>
            <br/>
            
                <Seccion>
                    <h2>Enlaces Oficiales : </h2>
                    <EnlacesExternos>
                        <a href="https://soft.uasd.edu.do/veranovirtual/" target="_blank" rel="noreferrer">
                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <b>Campus Virtual</b> 
                            </button>
                        </a>
                    </EnlacesExternos>
                    <EnlacesExternos>
                        <a href="https://ssb.uasd.edu.do/ssomanager/c/SSB" target="_blank" rel="noreferrer">
                           <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <b>Autoservicio</b> 
                            </button> 
                        </a>
                    </EnlacesExternos>
                    <EnlacesExternos>
                        <a href="https://www.uasd.edu.do/" target="_blank" rel="noreferrer">
                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <b>uasd.edu.do</b> 
                            </button>
                        </a>
                    </EnlacesExternos>
                    <EnlacesExternos>
                        <a href="https://soft.uasd.edu.do/ProgramacionPorAsignatura/" target="_blank" rel="noreferrer">
                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                <b>Prog. por asignatura</b> 
                            </button>
                        </a>
                    </EnlacesExternos>
                    <br/>
                </Seccion>
                <Seccion>
                    <h2>Atajos : </h2>

                    <ContenedorAtajos>
                        <Link to={"/Horario"}>
                            <AtajoCard style={{ boxShadow : tipoTema ? "2px 2px 5px #243b55" : "2px 2px 5px #999"}}>
                                <ScheduleIcon style={{ color: colorFont }} /> <p style={{ color: colorFont }}>Horario</p> 
                            </AtajoCard>
                        </Link>

                        <Link to={"/Tareas"}>
                            <AtajoCard style={{ boxShadow : tipoTema ? "2px 2px 5px #243b55" : "2px 2px 5px #999"}}>
                                <AssignmentIcon style={{ color: colorFont }} /> <p style={{ color: colorFont }}>Tareas</p> 
                            </AtajoCard>
                        </Link>

                        <Link to={"/Calificaciones"}>
                            <AtajoCard style={{ boxShadow : tipoTema ? "2px 2px 5px #243b55" : "2px 2px 5px #999"}}>
                                <AssessmentIcon style={{ color: colorFont }} /> <p style={{ color: colorFont }}>Calificaciones</p> 
                            </AtajoCard>
                        </Link>
                        
                        <Link to={"/Pensum"}>
                            <AtajoCard style={{ boxShadow : tipoTema ? "2px 2px 5px #243b55" : "2px 2px 5px #999"}}>
                                <BallotIcon style={{ color: colorFont }} /> <p style={{ color: colorFont }}>Pensum</p> 
                            </AtajoCard>
                        </Link>
                    </ContenedorAtajos>
                    
                </Seccion>

                <Seccion>
                    <h2>Enlaces Externos : </h2>
                    <EnlacesExternos>
                        <a href="https://www.nuevosemestre.com/" target="_blank" rel="noreferrer">
                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block">
                                <b>Profesores, opiniones y secciones</b> 
                            </button>
                        </a>
                    </EnlacesExternos>
                    <EnlacesExternos>
                        <a href="https://uasd.tuxpc.net/buscar/index/4/0" target="_blank" rel="noreferrer">
                            <button type="button" className="btn mb-2 mb-m-0 btn-round btn-quarternary btn-block">
                                <b>Programación Doc. uasd.tuxpc</b>
                            </button>
                        </a>
                    </EnlacesExternos>
                </Seccion>
                <br/>
            </DashboarContainer>
        </ContainerDrawer>
    );
}

export default MovilDashboard;