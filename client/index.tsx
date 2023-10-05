import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './router';
import { ThemeProvider } from 'tobui';
import { AppStateProvider } from './appState';
import { AppWrapper } from './helper.style';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <AppWrapper>
    <AppStateProvider>
      <Router />
    </AppStateProvider>
  </AppWrapper>
);
