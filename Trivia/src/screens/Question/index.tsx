import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Card} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {CustomButton} from '../../components';
import {AppState} from '../../store';
import {userAnswer} from '../../store/trivia/';
import {navigate} from '../../services';

const QuestionScreen = () => {
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
    navigate('Results', {});
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.header}>{question.category}</Text>
        <View style={styles.question}>
          <Card containerStyle={styles.card}>
            <Text style={styles.questionText}>{question.question}</Text>
          </Card>
          <Text style={styles.text}>
            {currentQuestionIndex + 1} of {numOfQuestions}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="False"
            onPress={falseClicked}
            disabled={false}
            type="outline"
            buttonStyle={styles.falseButton}
            textStyle={styles.falseAnswer}
          />
          <CustomButton
            title="True"
            onPress={trueClicked}
            disabled={false}
            type="outline"
            buttonStyle={styles.trueButton}
            textStyle={styles.trueAnswer}
          />
        </View>
      </View>
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
    backgroundColor: 'white',
    marginBottom: 20,
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
  falseAnswer: {
    color: 'red',
  },
  falseButton: {
    borderColor: 'red',
  },
  trueAnswer: {
    color: 'green',
  },
  trueButton: {
    borderColor: 'green',
  },
});

export default QuestionScreen;
