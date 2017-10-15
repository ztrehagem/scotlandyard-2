// client
exports.SET_NAME = 100;
exports.FETCH = 101;
exports.ACT_THIEF = 120;
exports.ACT_POLICE = 121;
// server
exports.GAME = 200;

const numToName = Object.keys(exports).reduce((obj, name) => {
  obj[exports[name]] = name.toLowerCase();
  return obj;
}, {});

Object.assign(exports, numToName);

console.log(exports);
