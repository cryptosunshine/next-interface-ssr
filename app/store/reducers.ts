import { combineReducers } from 'redux';
import user from './user/reducer';

const appReducer = combineReducers({
  user,
});

export default appReducer;
