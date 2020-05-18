import React from 'react';
import {Button} from 'react-native-elements';
import {StyleProp, ViewStyle, StyleSheet, TextStyle} from 'react-native';

export const CustomButton = (props: ICustomButtonProps) => (
  <Button
    title={props.title}
    raised={true}
    disabled={props.disabled}
    loading={props.disabled}
    onPress={props.onPress}
    type={props.type}
    buttonStyle={[styles.textButton, props.buttonStyle]}
    containerStyle={props.containerStyle}
    titleStyle={props.textStyle}
  />
);

export interface ICustomButtonProps {
  title: string;
  onPress(): void;
  buttonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled: boolean;
  type: 'solid' | 'outline' | 'clear' | undefined;
}

const styles = StyleSheet.create({
  textButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 150,
  },
});
