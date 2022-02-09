import React from 'react';
import styled from '@emotion/styled';

const ContenedorFooter = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    padding: 40px;
    color: white;
`;

const Footer = () => {
    return (
        <ContenedorFooter>
            <p>UASD Planner 2021</p>
            <p>Repu</p>
        </ContenedorFooter>
    );
}

export default Footer;