import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import QuestionScreen from './src/screens/Question';
import ResultsScreen from './src/screens/Results';
import HomeScreen from './src/screens/Home';
import ErrorScreen from './src/screens/Error';
import {navigationRef} from './src/services/navigation';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Error" component={ErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
