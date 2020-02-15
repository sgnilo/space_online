import {SIGN_IN, SIGN_OUT, CHANGE_USER_NAME, CHANGE_USER_PHOTO, SET_SYSTEM_LOCK, SET_SYSTEM_UNLOCK} from "./action"
import { combineReducers } from 'redux'

const defaultUserState = {
    uuid: '',
    username: localStorage.username || '',
    userphoto: localStorage.userphoto || ''
}

const defaultLock = {
    lockStatus: !sessionStorage.accessToken
}

const userReduce = (state = defaultUserState, action) => {
    switch (action.type) {
        case SIGN_OUT:
            return defaultUserState
        case SIGN_IN:
            return {
                uuid: action.uuid,
                username: action.username,
                userphoto: action.userphoto
            }
        case CHANGE_USER_NAME:
            return {...state, ...{username: action.username}}
        case CHANGE_USER_PHOTO:
            return {...state, ...{userphoto: action.userphoto}}
        default:
            return state
    }
}

const lockReduce = (state = defaultLock, action) => {
    switch (action.type) {
        case SET_SYSTEM_LOCK:
            return {lockStatus: true}
        case SET_SYSTEM_UNLOCK:
            return {lockStatus: false}
        default:
            return state
    }
}

const allReduce = combineReducers({
    lockReduce,
    userReduce
})

export {
    allReduce
}