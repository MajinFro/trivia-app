import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Question} from 'src/store';
import {QuestionResult} from './QuestionResult';

export const QuestionResultList = (props: IQuestionResultListProps) => {
  const questionList = props.questions.map((q, i) => {
    return (
      <QuestionResult
        key={i}
        question={q.question}
        userAnswer={q.userAnswer as boolean}
        questionAnswer={q.answer as boolean}
        icon={q.answer === q.userAnswer ? 'check' : 'times'}
        iconColor={q.answer === q.userAnswer ? 'green' : 'red'}
      />
    );
  });
  return <View style={styles.container}>{questionList}</View>;
};

export interface IQuestionResultListProps {
  questions: Question[];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
  },
  correctText: {
    color: 'green',
  },
  wrongText: {
    color: 'red',
  },
  text: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 5,
    marginRight: 5,
  },
});
