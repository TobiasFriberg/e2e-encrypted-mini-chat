import React, { useState } from 'react';
import { AddToaster, Button, InputField, List, Notification, Popup, useEventListener } from 'tobui';
import { RegisterModal } from './modals/register.modal';
import { loginUser } from '../models/user';
import { useAppState } from '../appState';
import { AppContent, FadedText, Flex } from '../helper.style';
import { InfoButton, LoginInfo, LoginList, LogoText } from './login.style';
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';

export const LoginView = () => {
  const { setAppState } = useAppState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [aboutPopupOpen, setAboutPopupOpen] = useState(false);

  const login = async () => {
    try {
      const user = await loginUser({ name: username, password: password });
      const token = user.data.token;

      if (!token) {
        throw new Error();
      }

      window.localStorage.setItem('token', token);
      setAppState({ token: token });
    } catch (e) {
      AddToaster({ text: 'Something went wrong, try again later.' });
    }
  };

  return (
    <>
      <Popup open={aboutPopupOpen} onClose={() => setAboutPopupOpen(false)} title="About Minichat">
        <p>
          Minichat is a light weight end-to-end encrypted chat with no personal information stored. Chat-rooms have a
          client-based secret key.
        </p>
        <p>Both texts and images are encrypted and are deleted after seven days.</p>
        <p>Users will be purged after three months of inactivity.</p>
      </Popup>
      <AppContent>
        <Flex $direction="column" $verticalAlign="center" $horizontalAlign="space-around" $fullHeight>
          <form onSubmit={(e) => e.preventDefault()}>
            <LoginList padding>
              <LogoText>Minichat</LogoText>
              <InputField placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e)} />
              <InputField placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e)} />
              <br />
              <Button onClick={() => login()} variant="primary">
                Login
              </Button>
              <br />
              <Button onClick={() => setIsOpen(true)} variant="secondary" appearance="border">
                Register
              </Button>

              <Flex $horizontalAlign="center">
                <InfoButton
                  size="small"
                  appearance="text"
                  icon={<Icon path={mdiInformationOutline} />}
                  onClick={() => setAboutPopupOpen(true)}
                >
                  About
                </InfoButton>
              </Flex>
            </LoginList>
          </form>
        </Flex>
        <LoginInfo>
          <FadedText>
            Powered by
            <br />
            Fribium
          </FadedText>
        </LoginInfo>
      </AppContent>
      <RegisterModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
