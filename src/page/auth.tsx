import React, { useEffect, useState, Fragment} from 'react'
import {CSSTransition} from 'react-transition-group'
import action from '../util/ajax'
import store from '../store'
import {message} from 'antd'

const useFreshDate = () => {
    let [timeStamp, setTimeStamp] = useState(new Date())
    useEffect(() => {
        let timer: any
        timer = setInterval(() => {
            setTimeStamp(new Date())
        }, 60000)
        return () => {clearInterval(timer)}
    }, [])
    return timeStamp
}

const TimeView = (props: any) => {
    let weekMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    let timeStamp = useFreshDate()
    return <Fragment>
        <CSSTransition
            in={props.waitting}
            timeout={300}
            classNames="date"
            unmountOnExit >
                <div className="date-view">
                    <div className="clock-block">{`${timeStamp.getHours()}:${timeStamp.getMinutes().toString().length < 2 ? '0' + timeStamp.getMinutes() : timeStamp.getMinutes()}`}</div>
                    <div className="date-block">{`${timeStamp.getMonth()}/${timeStamp.getDate()} ${weekMap[timeStamp.getDay()]}`}</div>
                </div>
                </CSSTransition>
        </Fragment>
}

const User = (props: any) => {
    let {defaultUser, setUserPsd, signIn, setUserName} = props
    return <div className="user-input-block">
        {defaultUser.userphoto ? <Fragment>
            <div className="default-user-info">
                {console.log(defaultUser)}
                <img src={defaultUser.userphoto} alt='' className="default-user-photo" />
                <span className="default-user-name">{defaultUser.username}</span>
            </div>
            <div className="default-user-psd">
                <input className="sign-input" type="password" onInput={(event: any) => {setUserPsd(event.target.value.toString())}} placeholder='输入密码' />
                {defaultUser.password && <i className="fa fa-sign-in" onClick={signIn}></i>}
            </div>
        </Fragment> : <Fragment>
            <div className="other-user-name">
                <input className="sign-input" onInput={(event: any) => {setUserName(event.target.value.toString())}}  placeholder="输入用户"/>
            </div>
            {defaultUser.username && <div className="other-user-psd">
                <input className="sign-input" type="password" onInput={(event: any) => {setUserPsd(event.target.value.toString())}} placeholder="输入密码" />
                {defaultUser.password && <i className="fa fa-sign-in" onClick={signIn}></i>}
            </div>}
        </Fragment>}
    </div>
}

const SignUp = (props: any) => {
    const {setNeedSignUp} = props
    const [user, setUser] = useState({username: '', password: '', repeatPsd: ''})

    const signUp = () => {
        if (!user.username || !user.password) {
            message.error('请完善信息！')
            return
        }
        if (user.password !== user.repeatPsd) {
            message.error('请保持两次输入的密码一致!')
            return
        }
        (action as any).signUp(user).then((res: any) => {
            const {errCode, errMsg} = res
            if (errCode === 100) {
                message.success(res.errMsg, setNeedSignUp(false))
                return
            }
            if (errCode === 200) {
                message.error(res.errMsg)
                return
            }
        }).catch((err: any) => {
            message.error(err.errMsg)
        })
    }

    return <div className="user-input-block">
        <div className="other-user-name">
                <input className="sign-input" onInput={(event: any) => {setUser({...user, ...{username: event.target.value.toString()}})}}  placeholder="输入用户"/>
            </div>
            <div className="other-user-psd">
                <input className="sign-input" type="password" onInput={(event: any) => {setUser({...user, ...{password: event.target.value.toString()}})}} placeholder="输入密码" />
            </div>
            <div className="other-user-psd">
                <input className="sign-input" type="password" onInput={(event: any) => {setUser({...user, ...{repeatPsd: event.target.value.toString()}})}} placeholder="确认密码" />
                <i className="fa fa-sign-in" onClick={signUp}></i>
            </div>
    </div>
}

const EnterView = (props: any) => {
    let user = {
        username: localStorage.username || '',
        userphoto: localStorage.userphoto || ''
    }
    const [defaultUser, setUser] = useState(user)
    const [needSignUp, setNeedSignUp] = useState(false)
    const {setLockStatus, waitting, setWatting} = props

    const setUserPsd = (psd: string) => {
        setUser(Object.assign({}, defaultUser, {password: psd}))
    }
    
    const setUserName = (name: string) => {
        setUser(Object.assign({}, defaultUser, {username: name}))
    }

    const signIn = () => {
        (action as any).signIn(defaultUser).then((res: object) => {
            if (!(res as any).data.uuid) {
                message.error('用户名或密码错误！')
                return false
            }
            const {username, uuid, userphoto} = (res as any).data
            store.dispatch({
                type: 'SIGN_IN',
                username: username,
                uuid: uuid,
                userphoto: userphoto
            })
            store.dispatch({
                type: 'SET_SYSTEM_UNLOCK',
                lockStatus: false
            })
            localStorage.userphoto = userphoto
            localStorage.username = username
            setLockStatus(false)
        })
    }

    const back = () => {
        if (needSignUp) {
            setNeedSignUp(false)
            return
        }
        setWatting(!waitting)
    }

    const changeAccount = () => {
        if (needSignUp) {
            setNeedSignUp(false)
        }
        setUser({username: '', userphoto: ''})
    }

    return <Fragment>
        <CSSTransition
            in={!waitting}
            timeout={300}
            classNames="hola"
            unmountOnExit >
                <div className="lock-psd">
                    {needSignUp ? <SignUp setNeedSignUp={setNeedSignUp} /> : <User defaultUser={defaultUser} setUserPsd={setUserPsd} setUserName={setUserName} signIn={signIn} />}
                    <div className="other-btns">
                        <div className="sign-btn">
                            <i className="fa fa-times-circle" onClick={back}></i>
                            <span>取消</span>
                        </div>
                        {needSignUp ? <div className="sign-btn">
                            <i className="fa fa-user" onClick={() => {setNeedSignUp(false)}}></i>
                            <span>登录</span>
                        </div> : <div className="sign-btn">
                            <i className="fa fa-user-plus" onClick={() => {setNeedSignUp(true)}}></i>
                            <span>注册</span>
                        </div>}
                        <div className="sign-btn">
                            <i className="fa fa-user-circle" onClick={changeAccount}></i>
                            <span>切换用户</span>
                        </div>
                    </div>
                </div>
            </CSSTransition>
    </Fragment>
}

const Auth = (props: any) => {
    const {lockStatus, setLockStatus} = props
    let [waitting ,setWatting] = useState(true)

    const awake = (event: any) => {
        event.stopPropagation()
        setWatting(!waitting)
    }

    return <div className="lock-wrap">
    <CSSTransition
        in={waitting}
        timeout={300}
        classNames="hola"
        unmountOnExit >
        <div className="lock-mask" onClick={awake}>
            <CSSTransition
                in={waitting}
                timeout={300}
                classNames="lockicon"
                unmountOnExit >
                <div className="top-lock-icon">
                    {<i className={lockStatus ? 'fa fa-lock' : 'fa fa-unlock-alt'}></i>}
                </div>
            </CSSTransition>
            <TimeView waitting={waitting} />
        </div>
        </CSSTransition>
        <EnterView waitting={waitting} setWatting={setWatting} setLockStatus={setLockStatus} />
    </div>
}

export default Auth