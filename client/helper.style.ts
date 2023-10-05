import styled from 'styled-components';

export const AppView = styled.div`
  height: -webkit-fill-available;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${(p) => p.theme.colors.backgroundColor};
  overflow: auto;
  position: fixed;
  top: 0;
  align-items: stretch;
  justify-content: space-between;
`;

export const AppContent = styled.div<{ $noPadding?: boolean }>`
  ${(p) => !p.$noPadding && 'padding: 1em'};
  flex-grow: 1;
  overflow: auto;
`;

export const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
`;

export const FadedText = styled.span`
  text-align: center;
  color: ${(p) => p.theme.colors.textColorDark};
  opacity: 0.18;
  font-size: 0.7em;
`;

type FlexProps = {
  $direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $gap?: string;
  $breakpoint?: 'tablet' | 'phone';
  $verticalAlign?: string;
  $horizontalAlign?: string;
  $wrap?: boolean;
  $padded?: boolean;
  $fullHeight?: boolean;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: baseline;
  flex-direction: ${(p) => p.$direction || 'row'};
  ${(p) => p.$padded && `padding: 1em;`}
  ${(p) => p.$gap && `gap: ${p.$gap};`}
  ${(p) => p.$wrap && `flex-wrap: wrap;`}
  ${(p) => p.$verticalAlign && `align-items: ${p.$verticalAlign};`}
  ${(p) => p.$horizontalAlign && `justify-content: ${p.$horizontalAlign};`}
  ${(p) => p.$fullHeight && `height: 100%;`}
  width: 100%;
  }}
`;
