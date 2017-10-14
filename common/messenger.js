const commands = require('./commands');

module.exports = class Messenger {
  static parse(message) {
    const cmd = message.readUInt8();
    const cmdName = commands[cmd];
    const body = message.slice(1);
    return [cmd, cmdName, body];
  }
}
