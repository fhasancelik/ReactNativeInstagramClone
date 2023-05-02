import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, storage, database } from "./firebaseconfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Search(props) {
   
  const [users, setUsers] = useState([]);

  const fetchUsers = async (search) => {
    const q = query(collection(database, "users"), where("name", ">=", search));

    const querySnapshot = await getDocs(q);
    let users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });
   
        setUsers(users);
    
  
   
  };
  return (
    <SafeAreaView>
      <View>
       <TextInput type="text"  placeholder="Search User"
       
      
       onChangeText={(search)=>fetchUsers(search)}
       />
       <FlatList
       numColumns={1}
       horizontal={false}
       data={users}
       renderItem={({item})=>(
<TouchableOpacity

onPress={()=>props.navigation.navigate("Profile",{uid:item.id})}



>
<Text>{item.name}</Text>

</TouchableOpacity>

        
       )}


       
       
       
       />
      </View>
    </SafeAreaView>
  );
}
