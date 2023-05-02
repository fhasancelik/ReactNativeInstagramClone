import React, {Component} from "react";
import { Text, View ,Button} from "react-native";
import { Provider } from "react-redux";
import { createStore,applyMiddleware } from "redux" 
import rootReducers from "./redux/reducers/index.js"
import thunk from "redux-thunk"

const store=createStore(rootReducers,applyMiddleware(thunk))


import Register from "./Register.js";
import Login from "./Login.js";
import Main from "./Main"

import { createStackNavigator } from "@react-navigation/stack";

import { auth } from "./firebaseconfig.js";
import { onAuthStateChanged ,signInWithEmailAndPassword} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";

import Landing from "./Landing.js";
import Add from "./Add.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Save from "./Save.js";
import Comments from "./Comments.js";

const Stack = createStackNavigator();

export class App extends Component{
  constructor(props){
    super(props);
    this.state={
      loggedIn:false,
      loaded:false,

    }

  }

  componentDidMount(){
    
   
  //   const email="Hasan1@gmail.com"
  //    const password=123456;
  //  signInWithEmailAndPassword(auth, email, password)
  //     .then((res) => console.log("login succes"))
  //     .catch((err)=>{console.log(err)} );
  
  

   onAuthStateChanged(auth, (user) => {
      if (!user) {
   this.setState({
    loggenIn:false,
    loaded:true,

   })
      } else {
        this.setState({
          loggedIn:true,
          loaded:true,
      
         })
      }
    });

    


  }

  render(){
    const {loaded,loggedIn}=this.state;
    if(!loaded){
      return(
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
          <Text>loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={Landing} />
  
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
      )
    }

    return(

<Provider store={store}>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
          <Stack.Screen name="Add" component={Add} navigation={this.props.navigation} />
          <Stack.Screen name="Save" component={Save} navigation={this.props.navigation} />
          <Stack.Screen name="Comments" component={Comments} navigation={this.props.navigation} />
  
  
     
     
        </Stack.Navigator>
    </NavigationContainer>

      </Provider>


    )



  }
}



export default App;
