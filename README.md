# README #

![alt text](https://github.com/MajinFro/trivia-app/blob/master/images/untitled.gif "App gif")

## App Structure ##

### Index.js ###

The App.tsx is wrapped with the redux store here.

### App.tsx ###

A Navigation container that holds a reference passed to the navigation service contains a stack navigator with each of the screens.

### src/api/ ###

Contains the following

* constants.ts

    Contains the API urls as constants.

* questions/
    * api.ts

        Function getQuestions takes IQuestionRequest to make api request and return IQuestionResponse. This api is used to get a list of questions from OTDB.

    * models.ts

        IQuestionRequest, IQuestionResponse, and IQuestion interfaces.

* sessionToken/
    * api.ts

        Function getSessionToken takes ITokenRequest to make api request and return ITokenResponse.  This api is used to get a token from OTDB that allows it to keep track of questions received from the questions api.

    * models.ts

        ITokenRequest and ITokenResponse interfaces

#### Thoughts ####

  The apis are simple functions abstracted from the app.  This allows it to be moved into other projects such as a node module, proxy api, or another app.  The ways I would improve this if given more time and resources would be better error handling and error reporting to services such as New Relic or Crashlytics.  In my previous job we didn't have an APM like New Relic for real time monitoring. This caused various important errors to go unnoticed for days.  If the api requests were to become more complicated and require an authentication flow such as OAuth, I would implement a web service layer to handle making web requests.

### src/services/ ###

Contains the following

* navigation.ts

    A React ref to the navigation container in App.tsx and a function to navigate.  This allows the app to navigate from anywhere in the code base (such as Redux) and not just in the React part. Any of the methods that navigation uses could be placed here but we are only using navigate in this app.

* trivia.ts

    A service to handle getting the questions, managing session token, and retry attempts on the api calls.  The function getNextSetOfQuestions is called with the amount of questions and a session token and return an ITriviaResponse.  This function will try up to 3 times to get a successful set of questions from the api.  If no token is provided it will call to get one.  It then calls the questions api and checks the response code to see how to handle it.  If successful it returns ITriviaResponse with the questions and token used. If there is a token error response, the token is wiped out and in the next loop a new token is assigned.  Any other error response code triggers another loop up to 3.  Once 3 is reached, an ITrivia response is returned with the error message, empty array for questions, and undefined token.

#### Thoughts ####

  The navigation service was created to be able to navigate from non react code.  I ended up still calling it in react code to avoid bringing in and implementing another library to handle chaining dispatches.  It is still a nice to have if there was future expansion of this app.  
  
  The trivia service was created as that layer between the two APIs used and the react portion of the app.  I decided to build in a limited number of retries to make it easier to refresh the token and to handle momentary blips with the api.  If given more time, I would add more error handling especially with all the Promises.

### src/store/ ###

* configureStore.ts

    Basic redux store set up with combined reducers and redux-sagas middleware.

* types.ts

    Central file for all of the types in regards to the redux part of the app.

* trivia/
    * actions.ts

        File containing all of the Action Creators and an enum of the action types.

    * reducer.ts

        A reducer to handle the questions/game state. The state includes properties

        * questions

            Array of Question type.
        
        * currentQuestion

            Index of the current question to display.

        * isLoading

            Flag to mark if the app is loading data.

        * isFinished

            Flag to mark when loading is done.

        * gameOver

            Flag to mark when the end of the questions have been reached.

        * errorMessage

            This property is populated if there has been an error at the data loading level.

        * questionToken

            Session token for tracking questions seen.

        The actions handled include

        * SHOW_LOADING

            Sets isLoading to true to trigger the loading state on the screen.

        * QUESTIONS_RECEIVED

            Set isFinished to true to trigger navigation on the screen. Set isLoading to false to clear it.  Set gameOver to false to clear it. Set current question index to 0 to reset it.  Map questions received to the questions state.  The map questions function can dispatch an ERROR or UPDATE_TOKEN action and return the state with that information.

        * MARK_UNFINISHED

            Set isFinished to false to clear it for it's next use.

        * UPDATE_TOKEN

            Updates the token in the state so we can use it for later question calls.

        * ERROR

            Adds the error message to the state to trigger the error dialog.

        * USER_ANSWER

            Sets the user's answer on the question and either increments the current question index or marks the game over.

    * sagas.ts

        A saga for handling the async call of getting trivia questions from the trivia service.  It is triggered by the REQUEST_QUESTIONS action.  A successful response dispatches a QUESTIONS_RECEIVED action while an error will dispatch an ERROR Action.

#### Thoughts ####

I need to investigate more on the best practices of how to structure the redux part of the project. I aligned it with how I did the api folder.  Each subfolder is a different thing. With the APIs, it was questions and session token.  With state, the app currently only has one.  But future additions of the app could add things like a leaderboard or authentication state and these would each have their own folder with similar files as the trivia folder.  I have some reservations about the types.ts file at the root of the store folder.  A lot of what I was seeing online suggested to place all the types into one file but I am wondering if it would not be better to split it up somehow.  At the very least split the state and actions from each other.

### src/components ###

* CustomButton.tsx

    This button used to be a customized touchable opacity so it made more sense then to make it a component.  When I imported a component library I decided to leave it in it's own component because I found it easier to change it for the whole app.

* LoadingOverlay.tsx

    If the app passes to the component it is loading, then this overlay is returned and shown until the loading state of the app changes.

#### Thoughts ####

I decided to place components used on different screens in the app here.  If a screen has components only used on that screen, then that screen folder has its own components folder.  On a more complex app, I expect there would be quite a few more components shared.

### src/screens ###

* Home/
    * index.tsx

        The HomeScreen is a basic start screen for the app. It contains a button and some text.  Clicking Begin will launch a series of state dispatches. First it will flag the state as isLoading. Second it will request questions.  This action when finished will flag the state as not loading and finished.  When finished, the flag is reset and the page uses the navigation service to go to the QuestionScreen.  Unless of course there is an error message in the state.  If that case happens we navigate to the Error Screen.

* Error/
    * index.tsx

        The ErrorScreen acts just like the HomePage but displays an error message. Clicking Try Again will launch a similar series of actions.  If there is another error though, it will stay on this screen.

* Question/
    * index.tsx

        The QuestionScreen displays a header based on the question category, the question in a card, current question out of total questions, and a set of buttons for true and false. Clicking an answer will dispatch an userAnswer action that sets the question answer in state and moves the current question to the next one all on the same screen. Once the state reaches all questions answered, the screen navigates to the ResultsScreen.

* Results/
    * components/
        * QuestionResult.tsx

            This component displays a card view with a colored icon that indicates if the user was correct or incorrect, the question, and the user's answer.

        * QuestionResultList.tsx

            This component displays a list of QuestionResult components mapped from a list of questions.

    * index.tsx

        The ResultsScreen displays a header of the number of correct answers out of the total questions, a list of cards in a scroll view with a card for each question and its result, and a button to play again. Clicking the play again button follows a similar set of actions as the HomeScreen when Begin is clicked.

#### Thoughts ####

I pass the string Hello to the showLoading/markUnfinished actions because for some unknown reason redux thought they were async without parameters being passed. I didn't want to waste too much time trying to figure this out but I try to avoid hacks like this in production apps.

My error state is very basic. It is just a screen that mimics the home page with the error message.  With more elaborate requirements this could be handled very different for each type of error.

### Testing Thoughts ###

I don't have a lot of experience with the react native testing frameworks. I wrote tests for the api calls and the trivia service.  I would have tested more but mocking in typescript for more complicated things like redux and navigation would have been too much of a time sink. I did look at a few testing frameworks outside of jest like Detox for e2e testing and Enzyme for the components.
