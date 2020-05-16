import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {TextButton} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {
  requestQuestions,
  showLoading,
  markUnfinished,
} from '../../store/trivia/actions';
import {AppState} from 'src/store';
import * as RootNavigation from '../../navigation/rootNavigation';

function HomeScreen() {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.questions.questionToken);
  const loading: boolean = useSelector(
    (state: AppState) => state.questions.isLoading,
  );
  const finished: boolean = useSelector(
    (state: AppState) => state.questions.isFinished,
  );

  function beginClicked(): void {
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
          <Text style={styles.header}>Welcome To the Trivia Challenge!</Text>
          <Text style={styles.text}>
            You will be presented with 10 True or False questions.
          </Text>
          <Text style={styles.text}>Can you score 100%?</Text>
          <TextButton title="Begin" onPress={beginClicked} disabled={loading} />
        </View>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 25,
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
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

export default HomeScreen;
