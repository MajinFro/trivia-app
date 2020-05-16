import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Question} from 'src/store';
import {QuestionResult} from './questionResult';

export const QuestionResultList = (props: IQuestionResultListProps) => {
  const questionList = props.questions.map((q, i) => {
    return (
      <QuestionResult
        key={i}
        question={q.question}
        userAnswer={q.userAnswer as boolean}
        textStyle={
          q.answer === q.userAnswer ? styles.correctText : styles.wrongText
        }
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
    backgroundColor: 'white',
  },
  correctText: {
    color: 'green',
  },
  wrongText: {
    color: 'red',
  },
});
