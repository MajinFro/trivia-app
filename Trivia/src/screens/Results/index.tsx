import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {CustomButton, LoadingOverlay} from '../../components';
import {AppState} from '../../store';
import {QuestionResultList} from './components';
import {
  requestQuestions,
  showLoading,
  markUnfinished,
} from '../../store/trivia/actions';
import {navigate} from '../../services';

const ResultsScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.questions.questionToken);
  const questions = useSelector((state: AppState) => state.questions.questions);
  const loading: boolean = useSelector(
    (state: AppState) => state.questions.isLoading,
  );
  const finished: boolean = useSelector(
    (state: AppState) => state.questions.isFinished,
  );

  function playAgainClicked(): void {
    dispatch(showLoading('Hello'));
  }

  if (loading) {
    dispatch(requestQuestions(token));
  }

  if (finished) {
    dispatch(markUnfinished('Hello'));
    navigate('Question', {});
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.header}>
            You Scored{' '}
            {questions.reduce(
              (acc, cur) => (cur.userAnswer === cur.answer ? ++acc : acc),
              0,
            )}{' '}
            / {questions.length}
          </Text>
          <ScrollView style={styles.scrollView}>
            <View>
              <View style={styles.questions}>
                <QuestionResultList questions={questions} />
              </View>
            </View>
          </ScrollView>
          <CustomButton
            title="Play Again?"
            onPress={playAgainClicked}
            disabled={loading}
            type="outline"
            containerStyle={styles.button}
          />
        </View>
      </View>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  body: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
  },
  questions: {
    marginBottom: 25,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 50,
  },
  scrollView: {
    width: '100%',
  },
});

export default ResultsScreen;
