const socketManager = (io: any): void => {
  io.on('connection', (socket: any) => {
    socket.on('message.created', (data: any[]) => {
      console.log(data);
    })
  })
}

export {
  socketManager
}
