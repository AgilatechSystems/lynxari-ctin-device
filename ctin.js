
const LynxariDevice = require(process.lynxari.device);
const device = require('@agilatech/ctin');

module.exports = class CtIn extends LynxariDevice {
    constructor(config) {
        const hardware = new device(config);
        super(hardware, config);
    }
}

