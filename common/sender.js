const commands = require('./commands');

const makeData = (cmd, bodyBuf) => {
  const contentsBuf = Buffer.concat([Buffer.from([cmd]), bodyBuf]);
  const lenBuf = new Buffer(4);
  lenBuf.writeInt32BE(contentsBuf.length);
  return Buffer.concat([lenBuf, contentsBuf]);
};

exports.send = (socket, cmd, bodyBuf) => new Promise((res) => {
  const data = makeData(cmd, bodyBuf);
  socket.write(data, res);
});

exports.sendAll = (sockets, cmd, bodyBuf) => new Promise((res) => {
  const data = makeData(cmd, bodyBuf);
  return Promise.all(sockets.map(socket => new Promise(res2 => socket.write(data, res2))));
});
