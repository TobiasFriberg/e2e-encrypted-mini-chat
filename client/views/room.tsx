import React, { useEffect, useState } from 'react';
import { AddToaster, Badge, Button, InputField, List, Loader, Popup } from 'tobui';
import { MessageModal } from './modals/message.modal';
import { AppContent, Flex } from '../helper.style';
import { deleteRoom, getMyRooms, getRoom } from '../models/room';
import { useAppState } from '../appState';
import { RoomFlex, RoomName, UserName } from './room.style';
import { useNavigate } from 'react-router';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';

export type Room = {
  roomId: string;
  userId: string;
};

export const Rooms = () => {
  const { appState } = useAppState();
  const navigate = useNavigate();
  const [newChatPopupOpen, setNewChatPopupOpen] = useState(false);
  const [deleteRoomPopupOpen, setDeleteRoomPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [recipient, setRecipient] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<any>();

  useEffect(() => {
    setMyRooms();
  }, []);

  const setMyRooms = async () => {
    try {
      const myRooms: any = await getMyRooms();
      setRooms(myRooms.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const goToRoom = async () => {
    try {
      const room = await getRoom(recipient);
      setNewChatPopupOpen(false);
      navigate(`room/${room.data._id}`);
    } catch (e) {
      AddToaster({ text: 'Something went wrong, try again later', variant: 'info' });
    }
  };

  const removeRoom = async () => {
    try {
      await deleteRoom(roomToDelete._id);
      setRoomToDelete(null);
      setDeleteRoomPopupOpen(false);
      AddToaster({ text: 'Room deleted', variant: 'info' });
      setLoading(true);
      setMyRooms();
    } catch (e) {
      AddToaster({ text: 'Something went wrong, try again later', variant: 'info' });
    }
  };

  if (loading) {
    return <Loader fillPage />;
  }

  const renderRooms = () => {
    if (!appState?.user?._id) {
      return null;
    }
    return (
      <List padding lines>
        {rooms.map((room) => {
          let roomName = room._id || '';
          roomName = room.users.filter((user: any) => user._id !== appState?.user?._id)[0].name || 'unknown name';
          const unread = room.readByUser.filter((user: any) => user === appState?.user?._id).length <= 0;
          return (
            <Flex $verticalAlign="center" key={room._id}>
              <RoomFlex $direction="column" onClick={() => navigate(`room/${room._id}`)}>
                <RoomName>{room._id}</RoomName>
                <UserName $read={!unread}>{roomName}</UserName>
              </RoomFlex>
              <div>
                <Button
                  variant="danger"
                  onClick={() => {
                    setRoomToDelete(room);
                    setDeleteRoomPopupOpen(true);
                  }}
                  icon={<Icon path={mdiDelete} />}
                  iconOnly
                />
              </div>
            </Flex>
          );
        })}
      </List>
    );
  };

  return (
    <AppContent>
      <Popup
        open={deleteRoomPopupOpen}
        title="Delete room"
        onClose={() => setDeleteRoomPopupOpen(false)}
        buttons={[
          <Button onClick={() => removeRoom()} variant="primary">
            Yes
          </Button>,
          <Button
            onClick={() => {
              setDeleteRoomPopupOpen(false);
              setRoomToDelete(null);
            }}
            appearance="border"
          >
            No
          </Button>,
        ]}
      >
        Are you sure you want to delete room: {roomToDelete && roomToDelete._id}?
      </Popup>
      <Popup open={newChatPopupOpen} title="New chat" onClose={() => setNewChatPopupOpen(false)}>
        <p>Enter the name of the user to start a new chat.</p>
        <List padding>
          <InputField placeholder="Name" onChange={(e) => setRecipient(e)} value={recipient} />
          <Button variant="primary" onClick={() => goToRoom()}>
            Start new chat
          </Button>
        </List>
      </Popup>
      <Button variant="secondary" onClick={() => setNewChatPopupOpen(true)}>
        New chat
      </Button>
      <br /> <br />
      {renderRooms()}
    </AppContent>
  );
};
