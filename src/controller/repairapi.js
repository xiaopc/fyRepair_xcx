import config from '@/config/config'

var repairData = {
    apiCookies: null,
    info: {
        type: null
    },
    settings: {
        bindWx: false,
        useEmailNoty: false,
        useWxNoty: false
    }
}

export default{
    data: repairData,
    init () {
        var sess = (wx.getStorageSync('repairData') || null)
        if (sess != "") repairData = Object.assign(repairData, sess)
    },
    query (action, method, data) {
        var vm = this
        return new Promise(function (resolve, reject){
            wx.request({
                url: config.server.apiBase + action,
                method: method,
                header: {
                    'content-type': 'application/x-www-form-urlencoded', 
                    'cookie': vm.data.apiCookies
                },
                data: data,
                success(res) {
                    if (res.header["Set-Cookie"] != undefined){
                        vm.data.apiCookies = res.header["Set-Cookie"]   //有毒吧
                        wx.setStorageSync("repairData", vm.data)
                    }
                    resolve(res.data)
                },
                fail() {
                    reject()
                }
            })
        })
    },
    connect (e) {
        var vm = this
        return new Promise(function (resolve, reject){
            vm.query("login", "POST", e).then(r => {
                if (r.code == 200){
                    vm.data.info.type = r.basic.type
                    wx.setStorageSync("repairData", vm.data)
                    resolve(r.profile)
                }
            })
        })
    },
    logout () {
        var vm = this
        vm.data.apiCookies = null
        //wx.removeStorage({key: "repairData", success: function (res) {} })
        //return new Promise(function (resolve, reject){
        //    vm.query("logout", "GET").then(r => {
        //        resolve(r)
        //    })
        //})    
    },
    getTickets () {
        var vm = this
        return new Promise(function (resolve, reject){
            vm.query("my/order", "GET").then(r => {
                resolve(r)
            })
        })
    },
    getTicketDetail (id) {
        var vm = this
        return new Promise(function (resolve, reject){
            vm.query("order/id/"+id, "GET").then(r => {
                resolve(r)
            })
        })
    }
    
}