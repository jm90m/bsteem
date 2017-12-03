import { combineReducers } from 'redux';
import home from './reducers/homeReducer';
import auth from './reducers/authReducer';
import comments from './reducers/commentsReducer';
import users from './reducers/usersReducer';

export default combineReducers({
  home,
  auth,
  comments,
  users,
});
