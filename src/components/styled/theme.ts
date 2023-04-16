import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Theme {
        colors: {
            primary: string;
            secondary: string;
            brand: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        colors: {
            primary: string;
            secondary: string;
            brand: string;
        };
    }
}

const theme = createTheme({
    colors: {
        primary: '#222',
        secondary: '#aaa',
        brand: '#33b8b8',
    },
});

export default theme;
