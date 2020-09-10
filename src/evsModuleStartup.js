const console = require('console')
const log = console.log
const EventEmitter = require('events')


class EvsModuleStartup extends EventEmitter{
    constructor(cfg, authMgr, netMonitor, soundPlayer) {
        super()
        this.authMgr = authMgr
        this.soundPlayer = soundPlayer
        this.status = 'unauthorized'
        netMonitor.once('ok', this._onceInternetOk.bind(this))
        netMonitor.on('timestamp', this._onTimestamp.bind(this))

    }
    start() {
        Promise.resolve().then(()=> {
            return this._checkOta()
        }).then(()=> {
            return this._checkAuth()
        }).then(() => {
            log("start ready, status:" + this.status)
        })
    }
    _checkOta() {
        return new Promise((resolve)=> {
            log("check ota")
            resolve()
        })
    }
    _checkAuth() {
        return new Promise((resolve)=> {
            log("check auth")
            resolve()
        })
    }
    _onceInternetOk() {
        log("internet ok")
    }
    _onTimestamp(timestamp) {
        console.log("timestamp:" + timestamp)
    }
}

module.exports = EvsModuleStartup


