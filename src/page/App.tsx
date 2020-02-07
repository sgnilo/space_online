import {useState} from 'react';
import React from 'react'
import Auth from './auth'

const App = (props: any) => {
	let [lockStatus, setLockStatus] = useState(true)

	return <div className="all-background">
		{lockStatus && <Auth lockStatus={lockStatus} setLockStatus={setLockStatus} />}
	</div>
}

export default App;
