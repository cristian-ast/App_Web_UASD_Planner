import React, { useState, useContext, useEffect, Fragment } from 'react';
import './Horario.css';
import { useHistory } from "react-router-dom";

import { FirebaseContext } from '../firebase';
import DatosMateria from '../components/ui-horario/DatosMateria';
import MateriaVirtual from '../components/ui-horario/MateriaVirtual';
import Spinner from '../components/Spinner';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";

import RefreshIcon from '@material-ui/icons/Refresh';
import ContainerDrawer from '../components/ContainerDrawer';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/Themes";

const Seccion = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 100%;
    max-width: 700px;
    background-color: rgba(255,255,255,0.2);
    border-radius: 10px;
    
`;

const Seccion2 = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 80px;
    width: 100%;
    max-width: 700px;
    background-color: rgba(255,255,255,0.2);
    border-radius: 10px;
    
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const TituloVirtuales = styled.div`
    font-weight: bold;
    text-align: center;
`;

const BotonesDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 200px;

    button {
        padding: 8px;
        margin: 10px;
    }

`;

const Horario = () => {

    const { horario, cargandoPrimeraVez, usuarioDatos } = useContext(FirebaseContext);

    const tipoTema = usuarioDatos ? usuarioDatos.tema : true;

    const history = useHistory();

    if(usuarioDatos) {
        if(usuarioDatos.configuracionCompleta === false) {
            history.push("/ConfigurarPrimeraVez");
        }
    }

    let estadoInicial = false;
    let comparar = "";

    if(horario) {
        if(horario.estado){
            for (let i = 0; i <= 18; i++) {
                comparar += horario.totalHorasCredito[i]; 
            }

            if(comparar === "Total Credit Hours:") {
                estadoInicial = true;
            }
        }
    }  
    
    const [ english ] = useState(estadoInicial);

    const [ colorTheme, setColorTheme ] = useState(tipoTema ? 'dark' : 'light');
    useEffect(() => {
        setColorTheme(tipoTema ? 'dark' : 'light');
    // eslint-disable-next-line
    }, [usuarioDatos]);

    const [ mostrarHoraActual, setMostrarHoraActual ] = useState(true);
    const [ clases, setClases ] = useState([]);
    const [ materiasSinHora, setMateriasSinHora ] = useState([]);

    const hoy = new Date();
    const [ dia, setDia ] = useState(hoy.getDay());

    const ObtenerDiaActual = () => {

        const diaDeHoy = new Date();
        setDia(diaDeHoy.getDay());
        
        const diaComprobar = diaDeHoy.getDay();
        const horaComprobar = diaDeHoy.getHours();

        if((diaComprobar > 0) && ( horaComprobar > 6) && (horaComprobar < 23)) {
            setMostrarHoraActual(true);
        } else {
            setMostrarHoraActual(false);
        }

        setTimeout(ObtenerDiaActual, 60000);
    }

    useEffect(() => {
        ObtenerDiaActual();
    // eslint-disable-next-line
    }, []);

    const RevisarHora = (hora) => {
        let datos = "";
        for (let j = 0; j < hora.length; j++) {
            datos += hora[j];
            if(datos.length > 2) {
                if(((datos[j-1] === "P") || (datos[j-1] === "p")) && ((datos[j] === "M") || (datos[j] === "m"))) {
                    return "pm";
                } else {
                    if(((datos[j-1] === "A") || (datos[j-1] === "a")) && ((datos[j] === "M") || (datos[j] === "m"))) {
                        return "am";
                    }
                }
            }
        }
    }

    const RevisarNumeroHora = (hora) => {
        let datos = "";
        for (let j = 0; j < hora.length; j++) {
            if(hora[j] === ":") {
                return datos;
            }
            datos += hora[j]; 
        }
    }

    const ObtenerNombre = (materia) => {
        let datos = "";
        for (let j = 0; j < materia.length; j++) {
            if(materia[j] === "-") {
                return datos;
            }
            datos += materia[j]; 
        }
    }

    const ObtenerGridRow = hora => {

        if(hora === "7am") {
            return 1;
        } else {
            if(hora === "8am") {
                return 2;
            } else {
                if(hora === "9am") {
                    return 3;
                } else {
                    if(hora === "10am") {
                        return 4;
                    } else {
                        if(hora === "11am") {
                            return 5;
                        } else {
                            if(hora === "12pm") {
                                return 6;
                            } else {
                                if(hora === "1pm") {
                                    return 7;
                                } else {
                                    if(hora === "2pm") {
                                        return 8;
                                    } else {
                                        if(hora === "3pm") {
                                            return 9;
                                        } else {
                                            if(hora === "4pm") {
                                                return 10;
                                            } else {
                                                if(hora === "5pm") {
                                                    return 11;
                                                } else {
                                                    if(hora === "6pm") {
                                                        return 12;
                                                    } else {
                                                        if(hora === "7pm") {
                                                            return 13;
                                                        } else {
                                                            if(hora === "8pm") {
                                                                return 14;
                                                            } else {
                                                                if(hora === "9pm") {
                                                                    return 15;
                                                                } else {
                                                                    return 16;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const ObtenerGridColumn = dia => {

        // Español
        if(!english) {

            if(dia === "L") {
                return 3;
            } else {
                if(dia === "M") {
                    return 4;
                } else {
                    if(dia === "I") {
                        return 5;
                    } else {
                        if(dia === "J") {
                            return 6;
                        } else {
                            if(dia === "V") {
                                return 7;
                            } else {
                                if(dia === "S") {
                                    return 8;
                                } else {
                                    return "Sin Horario"
                                }
                            }
                        }
                    }
                }
            }

        } else {

            if(dia === "M") {
                return 3;
            } else {
                if(dia === "T") {
                    return 4;
                } else {
                    if(dia === "W") {
                        return 5;
                    } else {
                        if(dia === "R") {
                            return 6;
                        } else {
                            if(dia === "F") {
                                return 7;
                            } else {
                                if(dia === "S") {
                                    return 8;
                                } else {
                                    return "Sin Horario"
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    const ConvertirDe12a24 = hora => {
        if(hora === "7am") {
            return 7;
        } else {
            if(hora === "8am") {
                return 8;
            } else {
                if(hora === "9am") {
                    return 9;
                } else {
                    if(hora === "10am") {
                        return 10;
                    } else {
                        if(hora === "11am") {
                            return 11;
                        } else {
                            if(hora === "12pm") {
                                return 12;
                            } else {
                                if(hora === "1pm") {
                                    return 13;
                                } else {
                                    if(hora === "2pm") {
                                        return 14;
                                    } else {
                                        if(hora === "3pm") {
                                            return 15;
                                        } else {
                                            if(hora === "4pm") {
                                                return 16;
                                            } else {
                                                if(hora === "5pm") {
                                                    return 17;
                                                } else {
                                                    if(hora === "6pm") {
                                                        return 18;
                                                    } else {
                                                        if(hora === "7pm") {
                                                            return 19;
                                                        } else {
                                                            if(hora === "8pm") {
                                                                return 20;
                                                            } else {
                                                                if(hora === "9pm") {
                                                                    return 21;
                                                                } else {
                                                                    return 22;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const ObternerCantidadHoras = hora => {

        let inicio =  RevisarNumeroHora(hora) + RevisarHora(hora);
        let fin = "";
        let cantidadHoras = 2;

        for (let i = 0; i < hora.length; i++) {
            
            if(hora[i] === "-") {
                i = i + 2;
                while((hora[i] !== ":") && (i < hora.length)) {
                    fin += hora[i];
                    i++;
                }

                if (hora[i] === ":") {
                    i = i + 4;
                    if(((hora[i] === "P") || (hora[i] === "p")) && ((hora[i+1] === "M") || (hora[i+1] === "m"))) {
                        fin += "pm";
                    } else {
                        if(((hora[i] === "A") || (hora[i] === "a")) && ((hora[i+1] === "M") || (hora[i+1] === "m"))) {
                            fin += "am";
                        }
                    }
                }
                
            }
            
        }

        cantidadHoras = (ConvertirDe12a24(fin) + 1) - ConvertirDe12a24(inicio);
        return cantidadHoras;
    }

    const ObtenerGridRowHoraActual = () => {
        
        let hoy = new Date();
        const hora = hoy.getHours();

        if((hora > 6) && (hora < 23)) {
            if(hora === 7) {
                return 1;
            } else {
                if(hora === 8) {
                    return 2;
                } else {
                    if(hora === 9) {
                        return 3;
                    } else {
                        if(hora === 10) {
                            return 4;
                        } else {
                            if(hora === 11) {
                                return 5;
                            } else {
                                if(hora === 12) {
                                    return 6;
                                } else {
                                    if(hora === 13) {
                                        return 7;
                                    } else {
                                        if(hora === 14) {
                                            return 8;
                                        } else {
                                            if(hora === 15) {
                                                return 9;
                                            } else {
                                                if(hora === 16) {
                                                    return 10;
                                                } else {
                                                    if(hora === 17) {
                                                        return 11;
                                                    } else {
                                                        if(hora === 18) {
                                                            return 12;
                                                        } else {
                                                            if(hora === 19) {
                                                                return 13;
                                                            } else {
                                                                if(hora === 20) {
                                                                    return 14;
                                                                } else {
                                                                    if(hora === 21) {
                                                                        return 15;
                                                                    } else {
                                                                        if(hora === 22) {
                                                                            return 16;
                                                                        } else {
                                                                            
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return 0;
    }

    const ObtenerGridColumnHoraActual = () => {
        if(dia === 0) {
            return 3;
        } else {
            if(dia === 1) {
                return 3;
            } else {
                if(dia === 2) {
                    return 4;
                } else {
                    if(dia === 3) {
                        return 5;
                    } else {
                        if(dia === 4) {
                            return 6;
                        } else {
                            if(dia === 5) {
                                return 7;
                            } else {
                                if(dia === 6) {
                                    return 8;
                                } else {
                                    return 3
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {

        let clasesTemporal = [];
        let materiasSinHoraTemporal = [];

        if(horario) {
            try {
                
                // eslint-disable-next-line
                horario.materias.map( materia => {
                    const color = materia.color

                    // eslint-disable-next-line
                    materia.horario.map( horas => {
                        for (let i = 0; i < horas.dia.length; i++) {

                            if(horas.dia[i] === "P") {

                                materiasSinHoraTemporal.push({
                                    materia: materia.materia,
                                    color: color,
                                    datos : materia
                                });

                                i++;

                            } else {

                                const tanda = RevisarHora(horas.hora);
                                const nombreMateria = ObtenerNombre(materia.materia);
                                const horaInicioClase = RevisarNumeroHora(horas.hora) + tanda;

                                clasesTemporal.push({
                                    materia: nombreMateria,
                                    color: color,
                                    datos : materia,
                                    gridColumn : ObtenerGridColumn(horas.dia[i]),
                                    gridRow : ObtenerGridRow(horaInicioClase),
                                    cantidadHoras : ObternerCantidadHoras(horas.hora)
                                });

                            }
                        }
                    })
                });
            } catch {
                console.log("Sin Horario");
            }
        }

        setClases(clasesTemporal);
        setMateriasSinHora(materiasSinHoraTemporal);
    // eslint-disable-next-line
    }, [cargandoPrimeraVez]);

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <ContainerDrawer>
                <Container>
                        {horario ? <Fragment>
                            {horario.estado ? 
                                <Seccion>
                                <div className="container">
                                    <div className="title"><b>Horario de clases</b></div>
                                    <div 
                                        className="days"
                                        style={{ background: tipoTema ? "#141E30" : "#f3f2f1"}}
                                    >
                                        <div className="filler"></div>
                                        <div className="filler"></div>
                                        <div className="day">Lu</div>
                                        <div className="day">Ma</div>
                                        <div className="day">Mi</div>
                                        <div className="day">Ju</div>
                                        <div className="day">Vi</div>
                                        <div className="day">Sa</div>
                                    </div>
                                    <div className="content">
                                        <div className="time" style={{ gridRow : 1}}>7 am</div>
                                        <div className="time" style={{ gridRow : 2}}>8 am</div>
                                        <div className="time" style={{ gridRow : 3}}>9 am</div>
                                        <div className="time" style={{ gridRow : 4}}>10 am</div>
                                        <div className="time" style={{ gridRow : 5}}>11 am</div>
                                        <div className="time" style={{ gridRow : 6}}>12 pm</div>
                                        <div className="time" style={{ gridRow : 7}}>1 pm</div>
                                        <div className="time" style={{ gridRow : 8}}>2 pm</div>
                                        <div className="time" style={{ gridRow : 9}}>3 pm</div>
                                        <div className="time" style={{ gridRow : 10}}>4 pm</div>
                                        <div className="time" style={{ gridRow : 11}}>5 pm</div>
                                        <div className="time" style={{ gridRow : 12}}>6 pm</div>
                                        <div className="time" style={{ gridRow : 13}}>7 pm</div>
                                        <div className="time" style={{ gridRow : 14}}>8 pm</div>
                                        <div className="time" style={{ gridRow : 15}}>9 pm</div>
                                        <div className="time" style={{ gridRow : 16}}>10 pm</div>

                                        <div className="filler-col"></div>

                                        <div className="col" style={{gridColumn : 3}}></div>
                                        <div className="col" style={{gridColumn : 4}}></div>
                                        <div className="col" style={{gridColumn : 5}}></div>
                                        <div className="col" style={{gridColumn : 6}}></div>
                                        <div className="col" style={{gridColumn : 7}}></div>
                                        <div className="col" style={{gridColumn : 8}}></div>
                                        
                                        <div className="row" style={{ gridRow : 1}}></div>
                                        <div className="row" style={{ gridRow : 2}}></div>
                                        <div className="row" style={{ gridRow : 3}}></div>
                                        <div className="row" style={{ gridRow : 4}}></div>
                                        <div className="row" style={{ gridRow : 5}}></div>
                                        <div className="row" style={{ gridRow : 6}}></div>
                                        <div className="row" style={{ gridRow : 7}}></div>
                                        <div className="row" style={{ gridRow : 8}}></div>
                                        <div className="row" style={{ gridRow : 9}}></div>
                                        <div className="row" style={{ gridRow : 10}}></div>
                                        <div className="row" style={{ gridRow : 11}}></div>
                                        <div className="row" style={{ gridRow : 12}}></div>
                                        <div className="row" style={{ gridRow : 13}}></div>
                                        <div className="row" style={{ gridRow : 14}}></div>
                                        <div className="row" style={{ gridRow : 15}}></div>
                                        <div className="row" style={{ gridRow : 16}}></div>

                                        {clases.map(clase => (
                                            <DatosMateria 
                                                key={`${clase.gridColumn}-${clase.gridRow}-${clase.cantidadHoras}`}
                                                clase={clase}
                                                english={english}
                                            />
                                        ))} 

                                        { mostrarHoraActual ? 
                                            <div 
                                                className="current-time"
                                                style={{
                                                    gridColumn: ObtenerGridColumnHoraActual(),
                                                    gridRow: ObtenerGridRowHoraActual()
                                                }}
                                            >
                                                <div className="circle"></div>
                                            </div>
                                        : null }

                                    </div>
                                    
                                    { materiasSinHora.length > 0 ? (
                                        <div>
                                            <TituloVirtuales>Materias Virtuales</TituloVirtuales>

                                            {materiasSinHora.map(clase => (
                                                <MateriaVirtual 
                                                    clase={clase} 
                                                    english={english}
                                                />
                                            ))}

                                            <br/>
                                        </div>
                                    ) : null}
                                    
                                </div>
                                </Seccion>
                            : (<Fragment>
                                <Seccion2>
                                    {cargandoPrimeraVez ? <Spinner/> : <Fragment>
                                        <div 
                                            style={{
                                                padding: 20,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            
                                            <h4>No hay horario</h4>
                                            <br/>
                                            <p>Para agregar los datos de tu horario debes subir tú Horario Detalle Alumno.</p>
                                            
                                            <Link to={"/SubirHorario"}>
                                                <BotonesDiv>
                                                    <button type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                                        Subir Horario
                                                    </button>
                                                </BotonesDiv>
                                            </Link>

                                            <br/>

                                            <p>Si ya has subido el Horario sólo actualiza la página.</p>

                                            <BotonesDiv>
                                                <button onClick={ () => window.location.reload(true)} type="button" className="btn mb-2 mb-m-0 btn-round btn-secondary btn-block">
                                                    <RefreshIcon/> Actualizar
                                                </button>
                                            </BotonesDiv>
                                        </div>
                                    </Fragment> }
                                </Seccion2>
                            </Fragment>)}
                        </Fragment> :null}
                </Container>
            </ContainerDrawer>
        </ThemeProvider>
    );
}

export default Horario;