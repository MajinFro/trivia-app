import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export const TextButton = (props: ITextButtonProps) => (
  <View>
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.textButton, props.buttonStyle]}
      disabled={props.disabled}>
      <Text style={[styles.text, props.textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  </View>
);

export interface ITextButtonProps {
  title: string;
  onPress(): void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled: boolean;
}

export interface ITextButtonStyle {
  textButton: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<ITextButtonStyle>({
  textButton: {
    height: 75,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
