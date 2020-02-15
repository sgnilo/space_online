import { SIGN_IN, SAY_HI, SIGN_UP } from './url'
import store from '../store'
const sha = require('sha1')

function Action () {
    this.freeXHRInstance = []
    this.accessToken = ''
    this.interval = setInterval(() => {
        if (this.freeXHRInstance[0]) {
            this.freeXHRInstance.shift()
        } else {
            clearInterval(this.interval)
            this.interval = null
        }
    }, 5000)
}

function createInstance () {
    if (this.freeXHRInstance[0]) return this.freeXHRInstance.shift()
    else {
        return new XMLHttpRequest()
    }
}

function recovery (instance) {
    this.freeXHRInstance.push(instance)
    !this.interval && (this.interval = setInterval(() => {
        if (this.freeXHRInstance[0]) {
            this.freeXHRInstance.shift()
        } else {
            clearInterval(this.interval)
            this.interval = null
        }
    }, 5000))
}

function request (params, url) {
    return new Promise((resolve, reject) => {
        const {protocol, hostname} = window.location
        let request = this.createInstance()
        request.open('POST', `${protocol}//${hostname}:5555${url}`, true)
        let token = this.accessToken || sessionStorage.accessToken
        token && request.setRequestHeader('access_token', token)
        request.onload = () => {
            const res = request.response
            const aToken = request.getResponseHeader('access_token')
            if (aToken) {
                this.accessToken = aToken
                sessionStorage.accessToken = aToken
            }
            if (res.status === 301) {
                store.dispatch({
                    type: 'SET_SYSTEM_LOCK',
                    lockStatus: true
                })
                reject(JSON.parse(res))
            } else if (request.status === 200) {
                resolve(JSON.parse(res))
            } else {
                reject(JSON.parse(res))
            }
            this.recovery(request)
        }
        request.send(JSON.stringify(params))
    })
}

Action.prototype.createInstance = createInstance
Action.prototype.recovery = recovery
Action.prototype.request = request

const action = new Action()

action.signIn = function (params = {}) {
    let shaPsd = sha(params.password)
    return this.request({...params, ...{password: shaPsd}}, SIGN_IN)
}

action.sayHi = function (params = {}) {
    return this.request(params, SAY_HI)
}

action.signUp = function (params = {}) {
    return this.request(params, SIGN_UP)
}

export default action