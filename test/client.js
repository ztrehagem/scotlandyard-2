const Client = require('../client');

const client = new Client();

(async () => {
  await client.connect();
  await client.setName('aaa');
})();
