import styled from 'styled-components';

const HEADER_HEIGHT = '68px;';

export const HeaderStyle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 1em;
  height: ${HEADER_HEIGHT};
  flex-shrink: 0;
  background-color: ${(p) => p.theme.colors.primary};

  > div > button {
    color: white;
  }
`;

export const HeaderItem = styled.div`
  position: absolute;
  right: 1em;
  height: ${HEADER_HEIGHT};
  display: flex;
  align-items: center;

  > div > button {
    color: white;
  }

  > button {
    color: white;
  }
`;

export const LogoText = styled.span`
  color: white;
  margin-left: 0.5em;
`;
