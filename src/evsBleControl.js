const console = require('console')
const log = console.log
const EventEmitter = require('events')


class EvsBleControl extends EventEmitter {
    constructor(clientId, deviceId, bleName, serverUuid, charUuid) {
        super()
        this.advData = EvsBleControl._generateAdvData(clientId)
        this.scanData = EvsBleControl._generateScanData(bleName)
        this.readData = new Buffer(deviceId)
        this.bleRunning = false
        this.bleReady = false
        this.bleReadyCallback = null

        this.ble = require('ble')
        let BlenoPrimaryService = this.ble.PrimaryService
        let BlenoCharacteristic = this.ble.Characteristic
        this.data = ''
        this.readCallback = function(offset, callback) {
            callback(BlenoCharacteristic.RESULT_SUCCESS, this.readData)
        }
        this.writeCallback = function(data, offset, withoutResponse, callback) {
            this._onData(data)
            callback(BlenoCharacteristic.RESULT_SUCCESS)
        }

        this.character = new BlenoCharacteristic({
            uuid: charUuid,
            properties: ['read', 'write', 'writeWithoutResponse'],
            secure: [],
            value: null,
            descriptors:[],
            onReadRequest: this.readCallback.bind(this),
            onWriteRequest: this.writeCallback.bind(this),
            onSubscribe: null,
            onUnsubscribe: null,
            onNotify: null,
            onIndicate: null
        })
        this.service = new BlenoPrimaryService({
            uuid: serverUuid,
            characteristics: [
                this.character
            ]
        })
        this.ble.on('stateChange', this._onStateChange.bind(this))
        this.ble.on('advertisingStat', this._onAdvertisingStart.bind(this))
        this.ble.on('accept', this._onAccept.bind(this))
        this.ble.on('disconnect', this._onDisconnect.bind(this))

    }
    start() {
        if(this.bleRunning) {
            log("ble is running now")
            return
        } else if(this.bleReady) {
            log("ble is ready")
            this.ble.startAdvertisingWithEIRData(this.advData, this.scanData)
            this.bleReadyCallback = null
            this.bleRunning = true
        } else {
            this.bleReadyCallback = this.start.bind(this)//靠状态变化回调去执行。
        }

    }
    stop() {
        this.bleReadyCallback = null
        if(this.bleRunning) {
            this.ble.disconnect()
            this.ble.stopAdvertising()
            this.bleRunning = false
        }
    }
    disconnect() {
        this.ble.disconnect()
    }
    _onStateChange(state) {
        if(state === 'poweredOn') {
            this.bleReady = true
            if(this.bleReadyCallback) {
                this.bleReadyCallback()
            }
        }
    }
    _onAccept(clientAddress) {
        this.emit('accept')
    }
    _onData(data) {
        let str = data.toString()
        if(str !== 'keep-alive' && str !== 'disconnect') {
            let parseInfo = (dataArray) => {
                let netInfo = {
                    "id": '',
                    'pwd': '',
                    'code': ''
                }
                dataArray.forEach((v,i) => {
                    Object.keys(netInfo).forEach((key) => {
                        if(v.substr(0,key.length) === key) {
                            netInfo[key] = v.substr(key.length+1)
                        }
                    })
                });
                //数据解析完成。发送消息。上层会处理这个消息。控制wifi。
                this.emit('data', netInfo.id, netInfo.pwd, netInfo.code)

            }
            this.data += str
            let dataArray = this.data.split('\n')
            if(dataArray[0].substr(0,3) === 'ver') {
                if(dataArray[dataArray.length-1] === 'end') {
                    parseInfo(dataArray)
                }
            } else if(dataArray.length === 3) {
                parseInfo(dataArray)
            }
        }
    }
    static _generateAdvData(clientId) {
        let clientIdHex = new Buffer(clientId.splite('-').join(''), 'hex')
        let advData = new Buffer(27)
        advData.writeUInt8(0x02, 0)
        advData.writeUInt8(0x01, 1)
        advData.writeUInt8(0x1e, 2)
        advData.writeUInt8(0x13, 3)
        advData.writeUInt8(0xff, 4)
        advData.writeUInt8(0xaa, 5)
        advData.writeUInt8(0xaa, 6)
        clientIdHex.copy(advData, 7)
        advData.writeUInt8(0x03, 23)
        advData.writeUInt8(0x03, 24)
        advData.writeUInt8(0xf9, 25)
        advData.writeUInt8(0x1f, 26)
        return advData
    }
    static _generateScanData(name) {
        let bleName = new Buffer(name)
        let scanData = new Buffer(2+bleName.length)
        scanData.writeUInt8(1+name.length, 0)
        scanData.writeUInt8(0x08, 1)
        bleName.copy(scanData, 2)
        return scanData
    }

}

module.exports = EvsBleControl
