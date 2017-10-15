const Host = require('./host');
const Client = require('./client');

let host = null;
let client = null;

const clean = async () => {
  if (client) {
    await client.disconnect();
    client = null;
  }
  if (host) {
    await host.close();
    host = null;
  }
};

exports.startHost = async (port, name, cb) => {
  clean();
  host = new Host();
  await host.start(parseInt(port) || undefined);
  client = new Client();
  await client.connect(parseInt(port) || undefined);
  await client.setName(name);
  cb();
};

exports.startClient = async (address, port, name, cb) => {
  clean();
  client = new Client();
  await client.connect(parseInt(port) || undefined, address);
  await client.setName(name);
  cb();
};
