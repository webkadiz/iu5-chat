import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import Root from './components/common/Root';
import theme from './components/styled/theme';
import ActiveChatProvider from './context/active-chat';
import store from './state/store';

const queryClient = new QueryClient();

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <ActiveChatProvider>
                        <Root />
                    </ActiveChatProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
