import React from "react";
import { Text,View,Button ,SafeAreaView} from "react-native";

function Landing({navigation}){
return(
    <SafeAreaView>
        <Button title="Register" onPress={()=>{navigation.navigate("Register")}}/>
        <Button title="Login" onPress={()=>{navigation.navigate("Login")}}/>
    </SafeAreaView>
)
}
export default Landing