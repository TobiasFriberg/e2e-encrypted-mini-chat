import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContent, Flex } from '../helper.style';
import { getMessageForRoom, saveChatImage, sendMessage } from '../models/message';
import { useNavigate, useParams } from 'react-router-dom';
import { AddToaster, Button, Loader, Notification, useEventListener } from 'tobui';
import Icon from '@mdi/react';
import { mdiDelete, mdiImage, mdiSend } from '@mdi/js';
import { encrypt, decrypt } from '../helper';
import { socket } from '../socket';
import { useAppState } from '../appState';
import {
  ChatBubble,
  ChatBubbleWrapper,
  ChatCharacterCount,
  ChatInput,
  MessageBox,
  MessagesContent,
  PreviewImage,
  PreviewImageWrapper,
  TimeStamp,
} from './chat.style';
import { format, fromUnixTime } from 'date-fns';
import { compressImage } from '../components/imagetransform';
import { ChatImage } from '../components/chatimage';

type ChatImage = {
  data: string;
  name: string;
};

const MAX_CHARACTERS = 400;

export const Chat = () => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<any>(null);
  const navigate = useNavigate();

  const { appState } = useAppState();
  const { room } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<ChatImage | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [socketMessage, setSocketMessage] = useState({});
  const [key, setKey] = useState('');
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    room && socket.emit('join', { roomId: room, userId: appState.user?._id });

    socket.on('newChatMessage', (msg) => {
      if (msg.user !== appState.user?._id) {
        setSocketMessage(msg);
      }
    });

    return () => {
      socket.off('newChatMessage');
    };
  }, []);

  useEffect(() => {
    const roomSecret = (appState.roomSecrets && room && appState.roomSecrets[room]) || '';
    setKey(roomSecret);
  }, [appState.roomSecrets]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, appState.roomSecrets]);

  const scrollToBottom = () => {
    const scrollHeight = messageBoxRef.current?.scrollHeight || 0;
    messageBoxRef.current?.scroll({ top: scrollHeight - lastScrollHeight });
    setLastScrollHeight(0);
  };

  useEffect(() => {
    addMsg(socketMessage);
  }, [socketMessage]);

  const addMsg = (msg: any) => {
    setMessages([...messages, msg]);
  };

  const getMessages = async () => {
    try {
      const messagesFromDb = await getMessageForRoom(room || '', page || 0);
      setMessages([...messagesFromDb.data, ...messages]);
      setLoadingMoreMessages(false);
      setHasMoreMessages(messagesFromDb.data.length >= 15);
    } catch (e) {
      navigate('/', { replace: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    getMessages();
  }, [page]);

  const sendMessageToRoom = async () => {
    if (message.trim().length <= 0 && !image) {
      return;
    }

    try {
      const msg = message.trim().length > 0 ? encrypt(message.trim(), key) : '';
      let sentMessage;
      if (!image) {
        sentMessage = await sendMessage(room || '', msg);
      } else {
        sentMessage = await saveChatImage(room || '', msg, encrypt(image.data, key), image.name);
      }
      setMessages([...messages, sentMessage.data]);
      setMessage('');
      setImage(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = async (files: FileList) => {
    const fileEndings = ['jpg', 'png', 'jpeg'];
    const newFiles = [];

    for (const file of files) {
      const fileName = file.name.toLowerCase();
      if (!new RegExp(fileEndings.join('|')).test(fileName)) {
        const allowedFileEndings = fileEndings.join(',');
        AddToaster({
          text: `${file.name} could not be uploaded, only ${allowedFileEndings} are allowed.`,
          variant: 'info',
        });
      } else {
        const newFile = {
          name: file.name,
          size: file.size,
          progress: 0,
          completed: false,
          error: false,
        };
        newFiles.push(newFile);
      }
    }

    for await (const file of files) {
      let fileName_ = file.name.toLowerCase();

      if (!new RegExp(fileEndings.join('|')).test(fileName_)) {
        return;
      }

      try {
        const fileEnding = /[.]/.exec(fileName_) ? /[^.]+$/.exec(fileName_) : null;
        const fileName = `${uuidv4()}.${fileEnding}`;
        const base64img = await compressImage(file, 1000);
        setImage({ name: fileName, data: base64img });
        return;
      } catch (e) {
        AddToaster({
          text: `Could not upload files right now, try again later.`,
        });
      }
    }
  };

  const handleSelectFile = async (e: any) => {
    const files = e.target.files;
    try {
      await handleUpload(files);
    } catch (e) {
      console.log(e);
    }
  };

  const renderMessage = (message: any) => {
    let img = null;
    if (message.image) {
      const imageLocation = `${__BFF_ADDRESS}/static/${room}/${message.image}`;
      img = <ChatImage url={imageLocation} decryptKey={key} doneLoading={() => scrollToBottom()} />;
    }
    return (
      <span>
        {img}
        {decrypt(message.message, key)}
      </span>
    );
  };

  const renderMessages = () => {
    return messages.map((message, i) => {
      return (
        <ChatBubbleWrapper key={i} $you={message.user === appState.user?._id}>
          <div>
            <ChatBubble $you={message.user === appState.user?._id}>{renderMessage(message)}</ChatBubble>
            <TimeStamp $you={message.user === appState.user?._id}>
              {format(fromUnixTime(message.created || 0), 'd MMM H:mm')}
            </TimeStamp>
          </div>
        </ChatBubbleWrapper>
      );
    });
  };

  const renderKeyReminder = () => {
    if (key.trim().length > 0) {
      return null;
    }

    return (
      <Notification type="warning">
        <Flex $verticalAlign="center" $gap="0.5em">
          No secret key found, set one by clicking the key icon.
        </Flex>
      </Notification>
    );
  };

  const renderImagePreview = () => {
    if (!image || !image.data) {
      return null;
    }

    return (
      <PreviewImageWrapper>
        <PreviewImage $src={image.data} />
        <Button
          onClick={() => {
            setImage(null);
            uploadRef.current.value = '';
          }}
          variant="danger"
          appearance="border"
          icon={<Icon path={mdiDelete} />}
          size="small"
        >
          Remove
        </Button>
      </PreviewImageWrapper>
    );
  };

  const checkScroll = () => {
    if (messageBoxRef.current && messageBoxRef.current.scrollTop <= 10 && !loadingMoreMessages && hasMoreMessages) {
      setLastScrollHeight(messageBoxRef.current?.scrollHeight);

      setLoadingMoreMessages(true);
      setPage(page + 1);
    }
  };

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (
      !e.shiftKey &&
      (e.key.toLocaleLowerCase() === 'enter' || e.code.toLocaleLowerCase() === 'enter' || e.keyCode === 13)
    ) {
      sendMessageToRoom();
    }
  });

  if (loading) {
    return <Loader fillPage />;
  }

  return (
    <AppContent $noPadding>
      <Flex $direction="column" $horizontalAlign="space-between" $verticalAlign="center" $fullHeight>
        <MessagesContent onScroll={checkScroll} ref={messageBoxRef}>
          {renderMessages()}
        </MessagesContent>
        <MessageBox>
          {renderKeyReminder()}
          {renderImagePreview()}
          <div style={{ position: 'relative' }}>
            <ChatInput
              multiline
              rows={2}
              placeholder="Message"
              onChange={(e) => {
                if (e.length <= MAX_CHARACTERS) {
                  setMessage(e);
                }
              }}
              value={message}
            />
            <ChatCharacterCount>
              {MAX_CHARACTERS - message.length}/{MAX_CHARACTERS}
            </ChatCharacterCount>
          </div>
          <Flex $horizontalAlign="space-between">
            <div>
              <input
                type="file"
                ref={uploadRef}
                hidden
                onChange={(e: React.FormEvent<HTMLInputElement>) => handleSelectFile(e)}
                accept=".jpg, .jpeg"
              />
              <Button
                size="small"
                disabled={key.trim().length <= 0}
                icon={<Icon path={mdiImage} />}
                onClick={() => (uploadRef.current ? uploadRef.current.click() : null)}
                variant="secondary"
              >
                Image
              </Button>
            </div>
            <div>
              <Button
                size="small"
                disabled={image === null && (message.trim().length <= 0 || key.trim().length <= 0)}
                icon={<Icon path={mdiSend} />}
                onClick={() => sendMessageToRoom()}
                appearance="text"
              >
                Send
              </Button>
            </div>
          </Flex>
        </MessageBox>
      </Flex>
    </AppContent>
  );
};
