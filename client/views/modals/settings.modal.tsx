import React, { useState } from 'react';
import { AddToaster, Button, CheckBox, Expander, InputField, List, Modal, Popup } from 'tobui';
import { utils } from '../../helper';
import { useAppState } from '../../appState';
import { removeUser, saveUser } from '../../models/user';

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { setAppState, appState } = useAppState();
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [removeAccountPassword, setRemoveAccountPassword] = useState('');
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const saveSettings = async () => {
    let error = false;

    if (!password || !password.match(utils.passwordRegex)) {
      AddToaster({
        text: 'Password must contain lower, upper, number and at least 8 characters',
        variant: 'info',
      });
      error = true;
    }

    if (password !== verifyPassword) {
      AddToaster({ text: 'Passwords does not match', variant: 'info' });
      error = true;
    }

    if (error) {
      return;
    }

    try {
      await saveUser(password, oldPassword);
      setPassword('');
      setVerifyPassword('');
      setOldPassword('');
      AddToaster({ text: 'Settings saved', variant: 'success' });
    } catch (e) {
      AddToaster({
        text: 'Something went wrong, try again later',
        variant: 'error',
      });
    }
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    setAppState({ token: null, user: null });
  };

  const deleteAccount = async () => {
    try {
      await removeUser(removeAccountPassword);
      logout();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Popup
        open={logoutPopupOpen}
        title="Logout"
        buttons={[
          <Button onClick={() => logout()} variant="primary">
            Yes
          </Button>,
          <Button onClick={() => setLogoutPopupOpen(false)} appearance="text">
            No
          </Button>,
        ]}
        onClose={() => setLogoutPopupOpen(false)}
      >
        <p>Are you sure you want to logout?</p>
      </Popup>
      <Popup open={deleteAccountPopup} title="Remove account" onClose={() => setDeleteAccountPopup(false)}>
        <p>Are you sure you want to remove your account?</p>
        <p>This action is permanent and will remove your account and all data tied to it.</p>
        <List>
          <InputField
            type="password"
            label="Current password"
            onChange={(e) => setRemoveAccountPassword(e)}
            value={removeAccountPassword || ''}
          />
          <br />
          <Button onClick={() => deleteAccount()} variant="danger">
            Remove account
          </Button>
        </List>
      </Popup>
      <Modal open={open} onClose={() => onClose()}>
        <h3>Settings</h3>
        <List padding lines removeEdgeLines>
          <Expander title="Appearance">
            <CheckBox
              onCheck={(e) => {
                setAppState({ darkTheme: e });
                window.localStorage.setItem('darkMode', e.toString());
              }}
              checked={appState.darkTheme || false}
              label="Dark theme"
            />
          </Expander>
          <Expander title="Password">
            <form onSubmit={(e) => e.preventDefault()}>
              <List padding>
                <InputField
                  type="password"
                  label="old password"
                  onChange={(e) => setOldPassword(e)}
                  value={oldPassword || ''}
                />
                <InputField
                  type="password"
                  label="New password"
                  onChange={(e) => setPassword(e)}
                  value={password || ''}
                />
                <InputField
                  type="password"
                  label="Verify new password"
                  onChange={(e) => setVerifyPassword(e)}
                  value={verifyPassword || ''}
                />
                <div>
                  <Button onClick={() => saveSettings()} variant="primary">
                    Save password
                  </Button>
                </div>
              </List>
            </form>
          </Expander>

          <List padding>
            <div>
              <Button onClick={() => setLogoutPopupOpen(true)} variant="secondary" appearance="border">
                Logout
              </Button>
            </div>
            <div>
              <Button size="small" onClick={() => setDeleteAccountPopup(true)} variant="danger" appearance="border">
                Remove account
              </Button>
            </div>
          </List>
        </List>
      </Modal>
    </>
  );
};
