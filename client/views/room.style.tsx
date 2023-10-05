import { Flex } from '../helper.style';
import styled from 'styled-components';

export const RoomName = styled.div`
  padding-top: 0.2em;
  font-size: 0.7em;
  color: ${(p) => p.theme.colors.grayDark};
`;

export const RoomFlex = styled(Flex)`
  cursor: pointer;
`;

export const UserName = styled.div<{ $read: boolean }>`
  ${(p) => p.$read && 'opacity: 0.5'};
  ${(p) => !p.$read && 'font-weight: bold'};
`;
