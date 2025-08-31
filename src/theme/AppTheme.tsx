import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs.tsx';
import { dataDisplayCustomizations } from './customizations/dataDisplay.tsx';
import { feedbackCustomizations } from './customizations/feedback.tsx';
import { navigationCustomizations } from './customizations/navigation.tsx';
import { surfacesCustomizations } from './customizations/surfaces.ts';
import { colorSchemes, typography, shadows, shape } from './themePrimitives.ts';

export default function AppTheme() {

    // Base component customizations
    const baseComponents = {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
    };

    const theme = createTheme({
        cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: baseComponents,
    });

    return (
        <ThemeProvider theme={theme} >
            {children}
        </ThemeProvider>
    );
}