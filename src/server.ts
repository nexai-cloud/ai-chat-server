import express, { Request, Response } from 'express';
import { createServer, type Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { randomUUID } from './lib/utils';
import debug from 'debug'
import { IoChatMsg } from './types';
import { sendChatToAi, sendSupportChat } from './lib/api.service';

const log = debug('nexai:server')

const PORT: number = parseInt(process.env.PORT as string, 10) || 8080;

const app: express.Application = express();
const server: HTTPServer = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",  
  },
});

app.get('/', (_: Request, res: Response) => {
  res.send('Nexai Chat Server. Hello.')
});

const sessions = io.of(/^\/session\/\w+$/);

sessions.on("connection", socket => {
  const session = socket.nsp;

  log('session', session.name)

  // socket.emit('chat', {
  //   uid: 'chat.hello',
  //   message: "hello from session " + session.name,
  //   fromName: "server"
  // });

  let sentEmailReq = false

  socket.on('chat', async (msg: IoChatMsg) => {
    log('session received chat', msg)
    const chatMsg = {
      ...msg,
      sessionId: msg.sessionKey, // @todo fix
      createdAt: new Date(),
      updatedAt: new Date()
    }
    if (!msg.email && !sentEmailReq) {
      sentEmailReq = true
      session.emit('chat', { 
        ...chatMsg,
        uid: randomUUID(),
        userUid: 'nexai',
        message: '💁 Provide an email if you need the team to reach out to you.',
       })
    }
    session.emit('chat', chatMsg)
    io.of('/project/' + msg.projectId).emit('chat', chatMsg)
    try {
      const resp = await sendChatToAi(msg)
      log('ai resp', resp)
      const aiMsg = {
        ...resp.message,
        uid: randomUUID(),
        userUid: 'nexai',
        sources: resp.sources,
        sessionKey: msg.sessionKey,
      } as IoChatMsg
      session.emit('chat', aiMsg)
      io.of('/project/' + msg.projectId).emit('chat', aiMsg)
    } catch(e) {
      console.error(e)
    }
  })
});

const projects = io.of(/^\/project\/\w+$/);

projects.on("connection", socket => {
  const project = socket.nsp;

  log('project', project.name)

  // socket.emit('chat', {
  //   uid: 'project.hello',
  //   message: "hello from project " + project.name,
  //   fromName: "server"
  // });
  socket.on('chat', async (msg: IoChatMsg) => {
    const chatMsg = {
      ...msg,
      sessionId: msg.sessionKey, // @todo fix
      createdAt: new Date(),
      updatedAt: new Date()
    }
    log('project received chat', chatMsg)
    project.emit('chat', chatMsg)
    log('emit', '/session/' + msg.sessionKey, chatMsg)
    io.of('/session/' + msg.sessionKey).emit('chat', chatMsg)
    try {
      const resp = await sendSupportChat(chatMsg)
      log('resp', resp)
    } catch(e) {
      console.error(e)
    }
  })
});

server.listen(PORT, () => {
  console.log(`⛵ Nexai Chat Server at http://localhost:${PORT}`);
});
