import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { fetchProfile } from './models/user';
import { IUser } from './interface/user';
import { socket } from './socket';

export interface IAppContext {
  user?: IUser | null;
  token?: string | null;
  roomSecrets?: any | null;
  darkTheme?: boolean | null;
  loading?: boolean;
}

interface IState {
  appState: IAppContext;
  setAppState: (newState: IAppContext) => void;
}

const initState: IAppContext = {
  darkTheme: Boolean(JSON.parse(window.localStorage.getItem('darkMode') || 'false')),
  loading: true,
};

const AppCtx = createContext<IState>({
  appState: initState,
  setAppState: () => {},
});

export const useAppState = () => useContext(AppCtx);

type AppStateProviderType = {
  children: ReactNode;
};

export const AppStateProvider = ({ children }: AppStateProviderType) => {
  const [appState, updateAppState] = useState<IAppContext>(initState);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      setAppState({ user: null, token: null, loading: false });
      return;
    }
    setUser(token);
  }, []);

  useEffect(() => {
    const appToken = appState?.token;
    const localStorageToken = window.localStorage.getItem('token');

    if (!localStorageToken || !appToken) {
      return;
    }

    if (appToken !== localStorageToken || !appState.user) {
      setUser(appToken);
    }
  }, [appState?.token]);

  const setUser = async (token: string) => {
    window.localStorage.setItem('token', token);
    try {
      const result = await fetchProfile(token);

      socket.emit('userConnected', result.data._id);

      const secrets = window.localStorage.getItem('rooms') || '';

      setAppState({
        token: token,
        user: result.data,
        roomSecrets: secrets && JSON.parse(secrets),
        loading: false,
      });
    } catch (e) {
      window.localStorage.removeItem('token');
      setAppState({ token: null, user: null, roomSecrets: null, loading: false });
    }
  };

  const setAppState = (newState: IAppContext) => {
    const updatedState = { ...appState, ...newState };
    updateAppState(updatedState);
  };

  return <AppCtx.Provider value={{ appState, setAppState }}>{children}</AppCtx.Provider>;
};
