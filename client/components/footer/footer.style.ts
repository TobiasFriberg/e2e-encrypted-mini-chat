import styled from 'styled-components';

const FOOTER_HEIGHT = '68px;';

export const FooterStyle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: ${FOOTER_HEIGHT};
  flex-shrink: 0;
  background-color: ${(p) => p.theme.colors.primary};
`;
