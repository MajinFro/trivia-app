import {call, put, takeLatest} from 'redux-saga/effects';
import {TRIVIA_ACTION_TYPES} from './actions';
import {ITriviaResponse, getNextSetOfQuestions} from '../../services';
import {RequestQuestionsAction} from '../types';

function* getTheQuestions(action: RequestQuestionsAction) {
  try {
    const response: ITriviaResponse = yield call(
      getNextSetOfQuestions,
      10,
      action.token,
    );

    yield put({
      type: TRIVIA_ACTION_TYPES.QUESTIONS_RECEIVED,
      triviaResponse: response,
    });
  } catch (e) {
    yield put({type: TRIVIA_ACTION_TYPES.ERROR, error: e.message});
  }
}

function* triviaSaga() {
  yield takeLatest(TRIVIA_ACTION_TYPES.REQUEST_QUESTIONS, getTheQuestions);
}

export default triviaSaga;
