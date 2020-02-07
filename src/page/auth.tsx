import React, { useEffect, useState} from 'react'

const TimeView = (props: any) => {
    let weekMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    let dateObj = new Date()
    let [time, setTime] = useState(`${dateObj.getHours()}:${dateObj.getMinutes().toString().length < 2 ? '0' + dateObj.getMinutes() : dateObj.getMinutes()}`)
    let [date, setDate] = useState(`${dateObj.getMonth()}/${dateObj.getDate()} ${weekMap[dateObj.getDay()]}`)
    let timer: any
    timer = setInterval(() => {
        dateObj = new Date()
        setTime(`${dateObj.getHours()}:${dateObj.getMinutes().toString().length < 2 ? '0' + dateObj.getMinutes() : dateObj.getMinutes()}`)
        setDate(`${dateObj.getMonth()}/${dateObj.getDate()} ${weekMap[dateObj.getDay()]}`)
    }, 60000)
    useEffect(() => {
        return () => {clearInterval(timer)}
    },[])
    return <div className="date-view">
        <div className="clock-block">{time}</div>
        <div className="date-block">{date}</div>
    </div>
}

const EnterView = (props: any) => {
    
}

const Auth = (props: any) => {
    const {lockStatus, setLockStatus} = props
    return <div className="lock-wrap">
        <div className="lock-mask">
            <div className="top-lock-icon">
                {<i className={lockStatus ? 'fa fa-lock' : 'fa fa-unlock-alt'}></i>}
            </div>
            <TimeView />
        </div>
    </div>
}

export default Auth