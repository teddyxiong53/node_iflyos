const console = require('console')
const log = console.log
const EventEmitter = require('events')

/*
    这个是蓝牙配网实现。
*/
class EvsNetworkMgr extends EventEmitter{
    constructor(cfg) {
        super()
        this.serverUuid = '00001FF9-0000-1000-8000-00805F9B34FB';
        this.characUuid = '00001FFA-0000-1000-8000-00805F9B34FB';
        this.acceptTimeout = 120*1000
        this.dataTimeout = 120*1000
        this.acceptTimer = null
        this.dataTimer = null
        this.ble = null
        this.wifiAdapter = null
        this.clientId = cfg.clientId//TODO 这里要改一下格式
        this.deviceId = cfg.deviceId
        this.bleName = cfg.bleName

    }

    start() {
        if(!this.ble) {
            this.ble = 
        }
    }
}

module.exports = EvsNetworkMgr


