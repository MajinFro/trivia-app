import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton, LoadingOverlay} from '../../components';
import {AppState} from '../../store';
import {navigate} from '../../services/';
import {
  requestQuestions,
  showLoading,
  markUnfinished,
} from '../../store/trivia/actions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.questions.questionToken);
  const errorMessage = useSelector(
    (state: AppState) => state.questions.errorMessage,
  );
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
    if (!errorMessage) {
      navigate('Question', {});
    }
  }

  if (errorMessage) {
    navigate('Error', {});
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
          <CustomButton
            title="Begin"
            onPress={beginClicked}
            disabled={loading}
            type="outline"
          />
        </View>
        <LoadingOverlay loading={loading} />
      </View>
    </View>
  );
};

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
});

export default HomeScreen;
