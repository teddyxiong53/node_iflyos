const console = require('console')
const log = console.log
const process = require('process')

const EvsNetMonitor = require('./internetMonitor')
const EvsAuthrizeMgr = require('./evsAuthorizeMgr')
const EvsAudioMgr = require('./evsAudioMgr')
const EvsSoundPlayer = require('./evsSoundPlayer')
const EvsContextMgr = require('./evsContextMgr')
const EvsModuleStartup = require('./evsModuleStartup')
const EvsModuleInteraction = require('./evsModuleInteraction')
const EvsModuleConfig = require('./evsModuleConfig')
//系统配置，直接在这里改
let cfg = {
    clientId: "",
    clientSecret: "",
    deviceId: "",
    bleName: "",
    
}




function onSystemReady() {
    console.log("system ready")
    let netMonitor = new EvsNetMonitor()
    let authMgr = new EvsAuthrizeMgr(cfg)
    //焦点管理，可以放后
    let audioMgr = new EvsAudioMgr()
    //本地提示音播放，暂时忽略，用打印替代
    let soundPlayer = new EvsSoundPlayer()
    //上下文管理器
    let ctxMgr = new EVsContextMgr()
    let moduleStartup = new EvsModuleStartup(cfg, authMgr, netMonitor, soundPlayer)
    let moduleConfig = new EvsModuleConfig()//网络配置模块
    let moduleInteraction = new EvsModuleInteraction()

    moduleStartup.start()
    netMonitor.start()

}



function initNetwork() {
    return new Promise((resolve, reject) => {
        resolve("ok")//直接返回ok，对于实际设备，要等待wifi网卡就绪。
    })
}

function initSN() {
    return new Promise((resolve, reject) => {
        resolve("ok")//也直接返回
    })
}

function initMediaPlayer() {
    return new Promise((resolve, reject) => {
        resolve("ok")//也直接返回
    })
}

let initList = [initNetwork(), initSN(), initMediaPlayer()]

//执行异步的系统初始化，等5秒执行系统就绪。
Promise.all(initList).then(()=> {
    let waitTime = 2000
    setTimeout(()=> {
        onSystemReady()
    }, waitTime)
})

//最后面的死循环，可以在这里面做一些事情
setInterval(() => {
    console.log("mainloop ...")
}, 1000);
