import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {TextButton} from '../../components';
import {AppState} from 'src/store';
import {QuestionResultList} from './components/questionResultList';
import {useSelector, useDispatch} from 'react-redux';
import {
  requestQuestions,
  showLoading,
  markUnfinished,
} from '../../store/trivia/actions';
import * as RootNavigation from '../../navigation/rootNavigation';

function ResultsScreen() {
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
    RootNavigation.navigate('Question', {});
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
            <QuestionResultList questions={questions} />
          </ScrollView>
          <TextButton
            title="Play Again?"
            onPress={playAgainClicked}
            disabled={loading}
          />
        </View>
      </View>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCA',
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
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 50,
  },
  scrollView: {
    width: '100%',
    marginBottom: 50,
  },
  loading: {
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.3,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ResultsScreen;
