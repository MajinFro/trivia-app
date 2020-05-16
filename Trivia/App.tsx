import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/Home';
import ResultsScreen from './src/screens/Results';
import QuestionScreen from './src/screens/Question';
import {navigationRef} from './src/navigation/rootNavigation';

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type StackParamList = {
  Home: undefined;
  Question: undefined;
  Results: undefined;
};

export default App;
