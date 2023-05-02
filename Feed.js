import React,{useState,useEffect} from 'react'
import {View,Text,FlatList,Image,StyleSheet,TouchableOpacity} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from "react-redux";
import { auth } from "./firebaseconfig";

import { setDoc, deleteDoc } from "firebase/firestore";

import { database } from "./firebaseconfig.js";

import { collection, doc } from "firebase/firestore";
import { getDoc, getDocs } from "firebase/firestore";
import Comments from  './Comments'


 function Feed(props) {

  const followingUser = props.following;
  const [followRef, setFollowRef] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  
  useEffect(() => {
    const refs = followingUser.map((ref) =>
      collection(database, "posts", ref, "userPosts")
    );
    setFollowRef(refs);
  }, [followingUser]);
  const getData = async () => {
    let posts = [];

    for (let i = 0; i < followRef.length; i++) {
      const querySnapshot = await getDocs(followRef[i]);
      const userPosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });
      posts = [...posts, ...userPosts];
    }

    setUserPosts(posts);
  };
  useEffect(() => {
   
    getData();
  
  }, [followRef]);
  
  useEffect(() => {
   // console.log(userPosts);
  }, [userPosts]);
  //console.log(userPosts)
  function PostsList({ userPosts }) {
    const renderItem = ({ item }) => (
      <View style={styles.containerImage}>
          <Text>{item.username}</Text>
        <Image
          source={{ uri: item.downloadURL }}
          style={styles.image}
        />
        <TouchableOpacity onPress={()=>{props.navigation.navigate('Comments',{postId:item.id,userId:item.userId})}}><Text>View Comments...</Text></TouchableOpacity>
      
      </View>
    );

    return (
  <View style={styles.containerGallery}>
        <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
  </View>
    );
  }

  return (
   
   <SafeAreaView style={{flex:1}}>
    <Text>Feed Screen</Text>
  
  <PostsList userPosts={userPosts} />
   </SafeAreaView>

  )
}

const styles=StyleSheet.create({
  constainer:{
    flex:1
  },
  containerInfo:{
    margin:20
  },
  containerGallery:{
    flex:1
  },
  containerImage:{
    flex:1/3
  },
  image:{
    flex:1,
    aspectRatio:1/1
  }
})


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Feed);