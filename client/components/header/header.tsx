import React from 'react';
import { HeaderItem, HeaderStyle, LogoText } from './header.style';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoomSettingsPopupButton } from './roomSettingsPopupButton';
import { Flex } from '../../helper.style';
import { SettingsPopupButton } from './settingsPopupButton';
import { Button } from 'tobui';
import Icon from '@mdi/react';
import { mdiHome } from '@mdi/js';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split('/')[1];

  const renderHeaderItem = () => {
    let item;
    switch (path) {
      case '':
        item = <SettingsPopupButton />;
        break;

      case 'room':
        item = (
          <Flex $gap="0.5em">
            <RoomSettingsPopupButton />
            <SettingsPopupButton />
          </Flex>
        );
        break;

      default:
        return null;
    }

    return <HeaderItem>{item}</HeaderItem>;
  };

  return (
    <HeaderStyle>
      <div>
        <Button iconOnly icon={<Icon path={mdiHome} />} onClick={() => navigate('/')} appearance="text" />
      </div>
      <LogoText>Minichat</LogoText>
      {renderHeaderItem()}
    </HeaderStyle>
  );
};
