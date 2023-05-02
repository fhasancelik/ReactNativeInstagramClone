import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { auth } from "./firebaseconfig";

import { setDoc, deleteDoc } from "firebase/firestore";

import { database } from "./firebaseconfig.js";

import { collection, doc, query } from "firebase/firestore";
import { getDoc, getDocs ,addDoc} from "firebase/firestore";

function Comments(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  //console.log(props.route.params.userId)

  useEffect(() => {
    if (props.route.params.postId !== postId) {
      const commentsRef = collection(
        database,
        "posts",
        props.route.params.userId,
        "userPosts",
        props.route.params.postId,
        "comments"
      );
      const q = query(commentsRef);

      getDocs(q).then((snapshot) => {
        let commentlist = snapshot.docs.map((doc) => {
          // console.log(doc.data())
          // console.log(doc.id)

          const data = doc.data();
          const id = doc.id;

          // console.log(data)
          // console.log(id)

          return { id, ...data };
        });
        //  console.log(commentlist)
        setComments(commentlist);
        console.log(comments);
        setPostId(props.route.params.postId);
      });
      setPostId(props.route.params.postId)
    }
  }, [props.route.params.postId]);
 // console.log(comments);
//   <Button
//   title="Posts"
//   onPress={() => {
//     console.log(props.route.params.postId);
//   }}
// />
const[user,setUser]=useState(null)
const userDocRef = doc(database, "users", auth.currentUser.uid);
getDoc(userDocRef)
  .then((doc) => {
    if (doc.exists()) {
     // console.log(doc.data())
      setUser(doc.data());
    } else {
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });
const onCommentSend=()=>{

    const commentsRef = collection(
        database,
        "posts",
        props.route.params.userId,
        "userPosts",
        props.route.params.postId,
        "comments"
      );
    addDoc(commentsRef, {
        user:user.name,
        creator:auth.currentUser.uid,
        comment:text
      })
      .then((docRef) => {
        console.log("Yeni belge eklendi, belge ID'si:", docRef.id);
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
}
  return (
    <SafeAreaView>
      <View>
  <FlatList
  
  numColumns={1}
  horizontal={false}
  data={comments}
  renderItem={({item})=>(
    <View style={{flexDirection:'row'}}>
        <Text>{item.user} :  </Text>
<Text>
   {item.comment}
</Text>



    </View>
  )}
  
  />
  <View><TextInput placeholder="comemnts" onChangeText={(text)=>setText(text)} />
  
  
  <Button title="Send" onPress={()=>{onCommentSend()}}/>
  
  </View>
      
      </View>
    </SafeAreaView>
  );
}
export default Comments;
