const console = require('console')
const log = console.log
const EventEmitter = require('events')


class EvsModuleConfig extends EventEmitter{
    constructor() {
        super()
        this.networkMgr = new EvsNetworkMgr(cfg)

    }
}

module.exports = EvsModuleConfig


