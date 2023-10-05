import React, { useState } from 'react';
import { Button } from 'tobui';
import Icon from '@mdi/react';
import { mdiCog } from '@mdi/js';
import { SettingsModal } from '../../views/modals/settings.modal';

export const SettingsPopupButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal open={isOpen} onClose={() => setIsOpen(false)} />
      <Button iconOnly icon={<Icon path={mdiCog} />} appearance="text" onClick={() => setIsOpen(true)} />
    </>
  );
};
