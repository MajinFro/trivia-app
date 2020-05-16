import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

export const QuestionResult = (props: IQuestionResultProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>Q: {props.question}</Text>
    <Text style={[styles.text, props.textStyle]}>
      A: {props.userAnswer?.toString()}
    </Text>
  </View>
);

export interface IQuestionResultProps {
  question: string;
  userAnswer: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export interface IQuestionResultStyle {
  text: TextStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<IQuestionResultStyle>({
  container: {
    paddingBottom: 5,
    width: '100%',
  },
  text: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 5,
    marginRight: 5,
  },
});
