import React, { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { LoginView } from './views/login';
import { AppView } from './helper.style';
import { useAppState } from './appState';
import { Rooms } from './views/room';
import { Header } from './components/header/header';
import { Chat } from './views/chat';
import { socket } from './socket';
import { AddToaster, Loader, ThemeProvider } from 'tobui';
import { darkTheme, lightTheme } from './themes';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { appState } = useAppState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!appState.token) {
      navigate('/');
    }
  }, [children]);

  return <>{children}</>;
};

export const Router = () => {
  const { appState } = useAppState();

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      if (!window.location.pathname.includes(msg.room)) {
        AddToaster({ text: `New message from ${msg.name}`, variant: 'primary' });
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const renderContent = () => {
    if (appState.loading) {
      return <Loader fillPage />;
    }

    return (
      <AppView>
        <BrowserRouter>
          {appState.token && <Header />}
          <Routes>
            <Route
              index
              element={
                appState.token ? (
                  <PrivateRoute>
                    <Rooms />
                  </PrivateRoute>
                ) : (
                  <LoginView />
                )
              }
            />
            <Route
              path="room/:room"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppView>
    );
  };

  const getTheme = () => {
    if (appState.darkTheme) {
      return darkTheme;
    }

    return lightTheme;
  };

  return (
    <ThemeProvider app customTheme={getTheme()}>
      {renderContent()}
    </ThemeProvider>
  );
};
