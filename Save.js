import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Image } from "react-native";
import { ref ,uploadBytes,uploadBytesResumable, getDownloadURL,addDoc} from "firebase/storage";
import { storage } from "./firebaseconfig.js";
import { auth } from "./firebaseconfig.js";
import { serverTimestamp,Timestamp } from "firebase/firestore";


import { doc, setDoc ,collection,getDoc} from "firebase/firestore"; 

import { database } from "./firebaseconfig.js";

export default function Save(props) {
  let uid=auth.currentUser.uid
  let uname=auth.currentUser.displayName
  let uemail=auth.currentUser.email
  let profilpic='proilpiclink'

const db=database;
const data = {
  stringExample: 'Hello, World!',
  
};

  const [caption, setCaption] = useState("");
 

const[url,setUrl]=useState("")
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
  
  const uploadImage = async() => {
 const uri=props.route.params.image; //console.log(uri) tamamlandı
 const childPath=`post/${auth.currentUser.uid}/${Math.random().toString(36)}`

 const response=await fetch(uri);
 const blob=await response.blob();//console.log(blob) tamamlandı
 const storageRef=ref(storage,childPath)
//  uploadBytes(storageRef, blob).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
// });
const uploadTask = uploadBytesResumable(storageRef, blob);

 uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
 //console.log(downloadURL)
 setDoc(doc(collection(doc(collection(database, 'posts'), uid),"userPosts")), {
username:user.name,
userId:auth.currentUser.uid,
 downloadURL,
 caption,
 creation:Timestamp.fromDate(new Date())
 
      });

    });

   props.navigation.popToTop()
   
  }
);
 

 
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image}} style={{ flex: 1 }} />
      <TextInput
        placeholder="Write a caption"
        onChangeText={(caption) => {
          setCaption(caption);
        }}
      />

      <Button
        title="Save to Stroge"
        onPress={() => {
          uploadImage();
        }}
      />
    </View>
  );
}
