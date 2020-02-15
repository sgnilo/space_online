import {createStore} from 'redux'
import {allReduce} from './reduce'

const store = createStore(allReduce)

export default store