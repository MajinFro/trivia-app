import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

export const LoadingOverlay = (props: ILoadingOverlayProps) => (
  <>
    {props.loading && (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    )}
  </>
);

export interface ILoadingOverlayProps {
  loading: boolean;
}

const styles = StyleSheet.create({
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
