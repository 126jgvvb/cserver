import { legacy_createStore } from 'redux';
import {reducerFunction} from './reducers'


const store=legacy_createStore(reducerFunction);
export default store;