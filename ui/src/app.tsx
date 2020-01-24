import React from 'react';
import styled from '@emotion/styled';
import { Global } from '@emotion/core';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { ApolloProvider } from '@apollo/react-hooks';

import { globalStyles } from './global-styles';
import { RoutedContent } from './router';

import { apolloClient } from './apollo-client';

const jss = create({
  ...jssPreset(),
  insertionPoint: 'jss-insertion-point',
});

const AppBody = styled.div`
  text-align: center;
`;

const AppContent = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const App = () => (
  <StylesProvider jss={jss}>
    <AppBody>
      <Global styles={globalStyles} />
      <AppContent>
        <ApolloProvider client={apolloClient}>
          <RoutedContent />
        </ApolloProvider>
      </AppContent>
    </AppBody>
  </StylesProvider>
);
