import React, { useState } from 'react';
import { AddToaster, Button, InputField, List, Modal } from 'tobui';
import { IUser } from '../../interface/user';
import { createUser } from '../../models/user';
import { utils } from '../../helper';

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

export const RegisterModal = ({ open, onClose }: RegisterModalProps) => {
  const [verifyPassword, setVerifyPassword] = useState('');

  const [user, setUser] = useState<IUser>({
    password: '',
    name: '',
  });

  const registerUser = async () => {
    let error = false;
    if (!user.name) {
      AddToaster({ text: 'Invalid username', variant: 'info' });
      error = true;
    }

    if (!user.name || user.name.trim().length > 50 || user.name.trim().length < 2) {
      AddToaster({ text: 'Invalid username', variant: 'info' });
      error = true;
    }

    if (!user.password || !user.password.match(utils.passwordRegex)) {
      AddToaster({
        text: 'Password must contain lower, upper, number and at least 8 characters',
        variant: 'info',
      });
      error = true;
    }

    if (user.password !== verifyPassword) {
      AddToaster({ text: 'Passwords does not match', variant: 'info' });
      error = true;
    }

    if (error) {
      return;
    }

    try {
      await createUser(user);
      setUser({ password: '', name: '' });
      onClose();
      AddToaster({ text: 'User created', variant: 'success' });
    } catch (e) {
      AddToaster({
        text: 'Something went wrong, try again later',
        variant: 'error',
      });
    }
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <h3>Register user</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <List>
          <InputField label="Username" onChange={(e) => setUser({ ...user, name: e })} value={user.name || ''} />
          <InputField
            type="password"
            label="Password"
            onChange={(e) => setUser({ ...user, password: e })}
            value={user.password || ''}
          />
          <InputField
            type="password"
            label="Verify password"
            onChange={(e) => setVerifyPassword(e)}
            value={verifyPassword || ''}
          />
        </List>
        <br />
        <Button onClick={() => registerUser()} variant="primary">
          Save user
        </Button>
      </form>
    </Modal>
  );
};
