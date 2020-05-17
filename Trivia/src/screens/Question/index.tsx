import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TextButton} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {AppState} from 'src/store';
import {userAnswer} from '../../store/trivia/actions';
import * as RootNavigator from '../../navigation/rootNavigation';

function QuestionScreen() {
  const currentQuestionIndex = useSelector(
    (state: AppState) => state.questions.currentQuestion,
  );

  const numOfQuestions = useSelector(
    (state: AppState) => state.questions.questions.length,
  );

  const question = useSelector(
    (state: AppState) => state.questions.questions[currentQuestionIndex],
  );

  const gameOver = useSelector((state: AppState) => state.questions.gameOver);

  const dispatch = useDispatch();

  function trueClicked(): void {
    dispatch(userAnswer(true));
  }

  function falseClicked(): void {
    dispatch(userAnswer(false));
  }

  if (gameOver) {
    RootNavigator.navigate('Results', {});
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.header}>{question.category}</Text>
        <View style={styles.question}>
          <View style={styles.card}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
          <Text style={styles.text}>
            {currentQuestionIndex + 1} of {numOfQuestions}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TextButton
            title="False"
            onPress={falseClicked}
            buttonStyle={styles.textButtonFalse}
            disabled={false}
          />
          <TextButton
            title="True"
            onPress={trueClicked}
            buttonStyle={styles.textButtonTrue}
            disabled={false}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  body: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    marginBottom: 50,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 25,
  },
  question: {
    marginTop: 50,
    marginBottom: 50,
  },
  card: {
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 'auto',
    padding: 10,
    marginBottom: 10,
    shadowColor: 'rgba(0,0,0,.5)',
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 10,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  textButtonFalse: {
    backgroundColor: 'red',
  },
  textButtonTrue: {
    backgroundColor: 'green',
  },
});

export default QuestionScreen;
