import React, { useEffect, useRef, useState } from 'react';
import { Loader, Modal } from 'tobui';
import Icon from '@mdi/react';
import { mdiSend } from '@mdi/js';
import { socket } from '../../socket';
import { Room } from '../room';
import { useAppState } from '../../appState';
import { getMessageForRoom } from '../../models/message';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { fetchProfileById } from '../../models/user';
import { useNavigate } from 'react-router-dom';

type MessageModalProps = {
  room?: Room;
  open: boolean;
  onClose: () => void;
};

type MessageType = {
  message: string;
  user: string;
  created: number;
  room?: string;
};

export const MessageModal = ({ room, open, onClose }: MessageModalProps) => {
  const { appState } = useAppState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [userInRoom, setUserInRoom] = useState({ name: '', img: '' });
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !room) {
      return;
    }
    setIsLoading(true);
    loadMessages();
    open && room?.roomId && socket.emit('join', room);
    return () => {
      socket.off('message');
    };
  }, [open]);

  socket.on('message', (msg) => {
    addMessage(msg);
  });

  useEffect(() => {
    const box = messageBoxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const messages = await getMessageForRoom(room?.roomId || '');
      const user = await fetchProfileById(room?.userId || '');
      setUserInRoom({ name: user.data.name, img: user.data.images[0] });
      setMessages(messages.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const addMessage = (newMessageToAdd: MessageType) => {
    setMessages([...messages, newMessageToAdd]);
  };

  const sendMessage = () => {
    room?.roomId &&
      socket.emit('message', {
        room: room.roomId,
        message: newMessage,
        userGuid: appState.user?.guid || '',
      });
    const messageToAdd = {
      message: newMessage,
      user: appState.user?._id || '',
      created: getUnixTime(new Date()),
    };
    addMessage(messageToAdd);
    setNewMessage('');
  };

  const handleClose = () => {
    socket.emit('leave', room);
    socket.off('message');
    onClose();
  };

  const handleNavigateToProfile = () => {
    onClose();
    navigate(`/user/${room?.userId}`);
  };
  /*
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    return (
      <Flex $direction="column" $horizontalAlign="space-between" $fullHeight>
        <Flex $direction="column">
          <h4 onClick={() => handleNavigateToProfile()}>{userInRoom.name}</h4>
          <MessagesContent ref={messageBoxRef}>
            {messages.map((message: any, i) => (
              <ChatBubbleWrapper
                key={i}
                $gap="0.3em"
                $verticalAlign="center"
                $horizontalAlign="right"
                $you={message.user === appState.user?._id}
              >
                <div>
                  <ChatBubble $you={message.user === appState.user?._id}>
                    <span style={{ whiteSpace: 'pre-line' }}>
                      {message.message}
                    </span>
                  </ChatBubble>
                  <TimeStamp>
                    {format(fromUnixTime(message.created), 'd MMM H:mm')}
                  </TimeStamp>
                </div>
              </ChatBubbleWrapper>
            ))}
          </MessagesContent>
        </Flex>
        <Flex $direction="column">
          <Flex $gap="0.5em" $verticalAlign="center">
            <ChatField
              multiline
              onChange={(e: string) => setNewMessage(e.substring(0, 300))}
              value={newMessage}
              rows={1}
            />
            <SendButton
              size="large"
              variant="primary"
              appearance="text"
              iconOnly
              icon={<Icon path={mdiSend} />}
              onClick={() => sendMessage()}
            />
          </Flex>
          <FadedText>{300 - newMessage.length}</FadedText>
        </Flex>
      </Flex>
    );
  };
*/
  return (
    <Modal open={open} onClose={() => handleClose()}>
      Hello
    </Modal>
  );
};
