import {createStore, combineReducers, Store, applyMiddleware} from 'redux';
import {AppState} from './types';
import QuestionsReducer from './trivia/reducer';
import createSagaMiddleware from 'redux-saga';
import triviaSaga from './trivia/sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  questions: QuestionsReducer,
});
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(triviaSaga);

const configureStore = (): Store<AppState, any> => {
  return store;
};

export default configureStore;
