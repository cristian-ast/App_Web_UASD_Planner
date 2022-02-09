import DrawerN from './DrawerN';
import DrawerC from './DrawerC';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../temaConfig';
import styled from '@emotion/styled';
//import Footer from './Footer';

const DrawerNContainer = styled.div`
    
    display: block;

    @media only screen and (min-width: 950px) {
        display: none;
    }
`;

const DrawerCContainer = styled.div`
    
    display: none;

    @media only screen and (min-width: 950px) {
        display: block;
    }
`;

const ContainerDrawer = (props) => (
   
    <ThemeProvider theme={theme}>

        <DrawerNContainer>
            <DrawerN/>
        </DrawerNContainer>
        
        <DrawerCContainer>
            <DrawerC/>
        </DrawerCContainer>
        {props.children}

        {/* <Footer/> */}

    </ThemeProvider> 

);
export default ContainerDrawer;