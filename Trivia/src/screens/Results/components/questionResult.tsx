import React from 'react';
import {StyleSheet, Text, View, TextStyle, StyleProp} from 'react-native';
import {Card, Icon} from 'react-native-elements';

export const QuestionResult = (props: IQuestionResultProps) => (
  <Card>
    <View style={styles.container}>
      <Icon
        type="font-awesome"
        name={props.icon}
        color={props.iconColor}
        size={20}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.question}</Text>
        <View style={styles.answerContainer}>
          <Text style={[styles.text, props.textStyle]}>
            Your Answer: {props.userAnswer?.toString()}
          </Text>
        </View>
      </View>
    </View>
  </Card>
);

export interface IQuestionResultProps {
  question: string;
  questionAnswer: boolean;
  userAnswer: boolean;
  textStyle?: StyleProp<TextStyle>;
  iconColor: string;
  icon: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    marginRight: 5,
    width: '100%',
  },
  answerContainer: {
    marginRight: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 5,
    marginRight: 5,
  },
});
