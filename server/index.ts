import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

interface ServerToClientEvents {
  taskUpdated: (task: any) => void;
  taskCreated: (task: any) => void;
  taskDeleted: (taskId: string) => void;
}

interface ClientToServerEvents {
  'join-task-room': (taskId: string) => void;
  'leave-task-room': (taskId: string) => void;
}

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log('Client connected:', socket.id);

  socket.on('join-task-room', (taskId: string) => {
    socket.join(`task-${taskId}`);
    console.log(`Socket ${socket.id} joined room: task-${taskId}`);
  });

  socket.on('leave-task-room', (taskId: string) => {
    socket.leave(`task-${taskId}`);
    console.log(`Socket ${socket.id} left room: task-${taskId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 