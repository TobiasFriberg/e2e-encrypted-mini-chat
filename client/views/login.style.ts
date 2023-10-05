import styled from 'styled-components';
import { Button, List } from 'tobui';

export const LoginList = styled(List)`
  width: 100%;
`;

export const LogoText = styled.div`
  font-size: 2em;
  color: ${(p) => p.theme.colors.primary};
  text-align: center;
  margin-bottom: 1em;
`;

export const InfoButton = styled(Button)`
  margin-top: 3em;
  width: auto;
`;

export const LoginInfo = styled.div`
  display: flex;
  width: 100%;
  left: 0;
  padding: 1.5em;
  justify-content: center;
  position: absolute;
  bottom: 0;
`;
