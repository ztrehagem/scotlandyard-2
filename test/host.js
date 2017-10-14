const Host = require('../host');

const host = new Host();

(async () => {
  await host.start();
})();
