import { InputField } from 'tobui';
import { Flex } from '../helper.style';
import styled from 'styled-components';

export const MessagesContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  gap: 0.5em;
  padding: 1em;
`;

export const MessageBox = styled.div`
  width: 100%;
  display: flex;
  gap: 0.4em;
  flex-direction: column;
  position: relative;
  padding: 0.75em;
`;

export const ChatBubbleWrapper = styled(Flex)<{ $you: boolean }>`
  justify-content: ${(p) => (p.$you ? 'right' : 'left')};
  color: ${(p) => p.theme.colors.textColorDark};
`;

export const ChatBubble = styled.div<{ $you: boolean }>`
  background-color: ${(p) => (p.$you ? p.theme.colors.primaryLight : p.theme.colors.grayLightMore)};
  padding: 0.3em;
  border-radius: ${(p) => p.theme.roundness};
  padding: 0.5em;
  font-size: 0.85em;
  white-space: pre-line;
  word-break: break-word;
  ${(p) => (p.$you ? 'border-bottom-right-radius: 2px' : 'border-bottom-left-radius: 2px')};
`;

export const TimeStamp = styled.div<{ $you: boolean }>`
  text-align: ${(p) => (p.$you ? 'right' : 'left')};
  padding-top: 0.3em;
  font-size: 0.5em;
  color: ${(p) => p.theme.colors.grayDark};
`;

export const ChatCharacterCount = styled.span`
  padding: 0.2em;
  font-size: 0.5em;
  color: ${(p) => p.theme.colors.grayDark};
  position: absolute;
  top: 0.3em;
  right: 0.3em;
`;

export const ChatInput = styled(InputField)`
  font-size: 0.85em;
`;

export const PreviewImageWrapper = styled.div`
  display: flex;
  gap: 1em;
  align-items: center;
  border-top: 1px solid ${(p) => p.theme.colors.grayLight};
  padding-top: 0.5em;

  > button {
    width: auto;
  }
`;

export const PreviewImage = styled.div<{ $src: string }>`
  width: 60px;
  background-size: cover;
  height: 60px;
  background-position: center;
  border-radius: ${(p) => p.theme.roundness};
  background-image: url(${(p) => p.$src});
`;
