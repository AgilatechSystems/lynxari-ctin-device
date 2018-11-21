const config = require('./config');
const Scout = require(process.lynxari.scout);
const CtIn = require('./ctin');

module.exports = class CtInScout extends Scout {

  constructor(opts) {

    super();

    if (typeof opts !== 'undefined') {
      // copy all config options defined in the server
      for (const key in opts) {
        if (typeof opts[key] !== 'undefined') {
          config[key] = opts[key];
        }
      }
    }

    if (config.name === undefined) { config.name = "CTin" }
    this.name = config.name;

    this.ctin = new CtIn(config);

  }

  init(next) {
    const query = this.server.where({name: this.name});
  
    const self = this;

    this.server.find(query, function(err, results) {
      if (!err) {
        if (results[0]) {
          self.provision(results[0], self.ctin);
          self.server.info('Provisioned known device ' + self.name);
        } else {
          self.discover(self.ctin);
          self.server.info('Discovered new device ' + self.name);
        }
      }
      else {
        self.server.error(err);
      }
    });

    next();
  }

}

