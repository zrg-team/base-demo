import { combineReducers } from 'redux';
import navigation, { NavigationState } from './navigation';

const appReducer = combineReducers({
  navigation,
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

export interface RootState {
  navigation?: NavigationState;
}

export default rootReducer;
