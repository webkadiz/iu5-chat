import { createTheme } from '@mui/material';

const theme = {
    palette: {
        primary: {
            main: '#33b8b8',
        },
    },
    colors: {
        primary: '#222',
        secondary: '#aaa',
        brand: '#33b8b8',
    },
};

type ThemeType = typeof theme;

declare module '@mui/material/styles' {
    interface Theme extends ThemeType {}
    // allow configuration using `createTheme`
    interface ThemeOptions extends ThemeType {}
}

declare module '@emotion/react' {
    export interface Theme extends ThemeType {}
}

const createdTheme = createTheme(theme);

export default createdTheme;
