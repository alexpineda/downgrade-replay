const { getChkChunks } = require("./chunks");
const { Orchestrate } = require("./downgraders");

const DEFAULT_OPTIONS = {};

class ChkDowngrader {
  constructor(userOptions = {}) {
    this.opts = Object.assign({}, DEFAULT_OPTIONS, userOptions);
  }
  downgrade(buf) {
    const chunks = getChkChunks(buf);
    const orchestrate = new Orchestrate(chunks, this.opts);

    if (orchestrate.isSCR) {
      return orchestrate.downgrade();
    } else {
      return buf;
    }
  }
}

module.exports = ChkDowngrader;
