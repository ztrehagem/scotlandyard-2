exports.SET_NAME = 1;

const numToName = Object.keys(exports).reduce((obj, name) => {
  obj[exports[name]] = name.toLowerCase();
  return obj;
}, {});

Object.assign(exports, numToName);

console.log(exports);
