import RoomModel from './models/room';
let connections: any[] = [];

export const getSocketId = (userId: string) => {
  const userFound = connections.filter((conn: any) => conn.userId === (userId || ''));

  if (!userFound || userFound.length <= 0) {
    return;
  }

  return userFound[0].socketId;
};

export const socketServer = (server: any) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
  });

  io.listen(server);

  io.on('connection', async (socket: any) => {
    socket.on('userConnected', async (userId: string) => {
      connections.push({ socketId: socket.id, userId: userId });
    });

    socket.on('disconnect', () => {
      const updated = connections.filter((conn: any) => conn.socketId !== socket.id);
      connections = updated;
    });

    socket.on('join', async ({ roomId, userId }: any) => {
      try {
        const validRoom = await RoomModel.find({ _id: roomId, users: { $in: [userId] } });
        if (!validRoom) {
          throw new Error('not a valid room');
        }
        socket.join(roomId);
      } catch (e) {
        console.log(e);
      }
    });
  });

  return io;
};
