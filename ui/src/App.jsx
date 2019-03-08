import React from 'react';
import styled from '@emotion/styled';
import {Global, keyframes} from '@emotion/core';

import {globalStyles} from './global-styles';

import logo from './logo.svg';

const AppBody = styled.div`
  text-align: center;
`;

const AppLogoKeyAnimations = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AppLogo = styled.img`
  animation: ${AppLogoKeyAnimations} infinite 20s linear;
  height: 40vmin;
  pointer-events: none;
`;

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const AppLink = styled.a`
  color: #61dafb;
`;


export const App = () => (
    <AppBody>
        <Global styles={globalStyles} />
        <AppHeader>
            <AppLogo src={logo} alt="logo" />
            <p>
                Edit <code>src/App.jsx</code> and save to reload.
            </p>
            <AppLink
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </AppLink>
        </AppHeader>
    </AppBody>
);
