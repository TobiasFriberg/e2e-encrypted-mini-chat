import React, { useEffect, useState } from 'react';
import { Button, InputField, List, Popup } from 'tobui';
import Icon from '@mdi/react';
import { mdiKey } from '@mdi/js';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../../appState';
import { Flex } from '../../helper.style';
import { generateRandomKey } from '../../helper';
import { getMyRoomInfo } from '../../models/room';

export const RoomSettingsPopupButton = () => {
  const { appState, setAppState } = useAppState();
  const location = useLocation();
  const room = location.pathname.replace('/room/', '');
  const [isOpen, setIsOpen] = useState(false);
  const [roomSecret, setRoomSecret] = useState('');
  const [ttl, setTtl] = useState('');

  useEffect(() => {
    if (!room) {
      return;
    }
    setRoomSecret(appState.roomSecrets[room] || '');
  }, [isOpen]);

  const saveRoomSecret = () => {
    if (!room) {
      return;
    }
    const jsonSecrets = { ...appState.roomSecrets };
    jsonSecrets[room] = roomSecret;

    window.localStorage.setItem('rooms', JSON.stringify(jsonSecrets));
    setAppState({ roomSecrets: jsonSecrets });
    setIsOpen(false);
  };

  const generateKey = () => {
    setRoomSecret(generateRandomKey());
  };

  return (
    <>
      <Popup open={isOpen} title="Settings" onClose={() => setIsOpen(false)}>
        <p>Room id: {room}</p>
        <p>
          Enter or generate a key to start chatting, remember that you both need to have the same key to be able to
          decrypt messages and images.
        </p>
        <List padding>
          <InputField label="Secret key" onChange={(e) => setRoomSecret(e)} value={roomSecret} />
          <Flex>
            <Button size="small" onClick={() => generateKey()} appearance="border" variant="secondary">
              Generate key
            </Button>
            <span />
          </Flex>
          <br />
          {/* <InputField label="Message deletion timer (hours)" onChange={(e) => setTtl(e)} value={ttl} />*/}
          <Button onClick={() => saveRoomSecret()} variant="primary">
            Save
          </Button>
        </List>
      </Popup>
      <Button iconOnly icon={<Icon path={mdiKey} />} appearance="text" onClick={() => setIsOpen(true)} />
    </>
  );
};
