import React,{Component} from "react";
import {TextInput,Text,View,Button} from "react-native"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseconfig';


export class Login extends Component{
constructor(props){
    super(props);
    this.state={

email:"",
password:"",

    }
    this.onSignIn=this.onSignIn.bind(this)
}

onSignIn(){
   
    const{email,password}=this.state
    signInWithEmailAndPassword(auth, email, password)
    .then((res) => console.log("login succes"))
    .catch((err)=>{console.log(err)} );

}

render(){
    return(
        <View>
           <TextInput placeholder="Email" onChangeText={(email)=>{this.setState({email})}}/>
        
           <TextInput placeholder="Password" onChangeText={(password)=>{this.setState({password})}}/>
        
        
        <Button title="Sign In" onPress={()=>this.onSignIn()}/>
        

        
        
        </View>
    )
}
}
export default Login