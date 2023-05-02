import React,{Component} from "react";
import {TextInput,Text,View,Button} from "react-native"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseconfig';
import { database } from "./firebaseconfig";
import { collection, addDoc, setDoc, doc} from "firebase/firestore"; 
import usersRef from "./firebaseconfig.js"

export class Register extends Component{
constructor(props){
    super(props);
    this.state={

email:"",
password:"",
name:"",
    }
    this.onSignUp=this.onSignUp.bind(this)
}

onSignUp(){
    let userId=null
   
    const{email,password,name}=this.state
    createUserWithEmailAndPassword(auth, email, password)
    .then((res) => 
    
{
    userId = res.user.uid;


    setDoc(doc(collection(database, 'users'), userId), {
name:name,
email:email
    });
  })
  .catch((err) => { console.log(err) });
        


}

render(){
    return(
        <View>
           <TextInput placeholder="Name" onChangeText={(name)=>{this.setState({name})}}/>
        
           <TextInput placeholder="Email" onChangeText={(email)=>{this.setState({email})}}/>
        
           <TextInput placeholder="Password" onChangeText={(password)=>{this.setState({password})}}/>
        
        
        <Button title="Sign Up" onPress={()=>this.onSignUp()}/>
          
       
        </View>
    )
}
}
export default Register