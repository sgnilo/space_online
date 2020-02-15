import {useState} from 'react';
import React from 'react'
import Auth from './auth'
import store from '../store'
import { Provider } from 'react-redux'

const App = (props: object) => {
	let [lockStatus, setLockStatus] = useState(store.getState().lockReduce.lockStatus)

	return <Provider store={store}>
				<div className="all-background">
					{lockStatus ? <Auth lockStatus={lockStatus} setLockStatus={setLockStatus} /> : <div>
						content
					</div>}
				</div>
			</Provider>
}

export default App;
