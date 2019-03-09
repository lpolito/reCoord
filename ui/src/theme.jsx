import React from 'react';
import PropTypes from 'prop-types';

import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';

import {
    createMuiTheme,
    MuiThemeProvider,
    jssPreset,
    createGenerateClassName,
} from '@material-ui/core/styles';


// https://material-ui-next.com/customization/themes/#createmuitheme-options-theme
export const THEME = createMuiTheme({});

// specify injection order for jss - https://material-ui.com/customization/css-in-js/#css-injection-order
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());

jss.options.insertionPoint = 'jss-insertion-point';

// https://material-ui-next.com/customization/themes/#muithemeprovider
export const ThemeProvider = ({children}) => (
    <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={THEME}>
            {children}
        </MuiThemeProvider>
    </JssProvider>
);

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
