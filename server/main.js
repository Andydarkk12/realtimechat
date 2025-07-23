import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('auth',(data)=>{
    console.log(data)
  })
  ws.on('message', (message) => {
    console.log(message)
    clients.forEach((client) => {
      if (client !== ws && client.readyState == 1) {
        client.send(message.toString('utf-8'));

      }
    });
  });

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1); // Убираем клиента из списка при отключении
  });
});