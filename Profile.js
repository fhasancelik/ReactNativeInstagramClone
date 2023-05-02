import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { auth } from "./firebaseconfig";

import { setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { database } from "./firebaseconfig.js";

import { collection, doc } from "firebase/firestore";
import { getDoc, getDocs } from "firebase/firestore";
import Landing from "./Feed";
import App from './App'
import { createStackNavigator } from "@react-navigation/stack";

const Stack=createStackNavigator()
function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(null);
  const[logut,setLogut]=useState(true)

  useEffect(() => {
    const { currentUser, posts } = props;
    
 

    if (props.route.params.uid === auth.currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      const userDocRef = doc(database, "users", props.route.params.uid);
      getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
          //  console.log(doc.data())
            setUser(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      const getdata = async () => {
        const collectionRef = collection(
          database,
          "posts",
          props.route.params.uid,
          "userPosts"
        );

        const querySnapshot = await getDocs(collectionRef);
        let posts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        setUserPosts(posts);
        
      };
      getdata();
     
    }


    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following,props.posts]);

  const onFollow = () => {
    const followCollRef = collection(database, "following");
    const userDocRef = doc(followCollRef, auth.currentUser.uid);
    const userFollowingCollRef = collection(userDocRef, "userFollowing");

    setDoc(doc(userFollowingCollRef, props.route.params.uid), {});
    setFollowing(true)
    console.log(props.following)
  };
  const onUnfollow = () => {
    const followCollRef = collection(database, "following");
    const userDocRef = doc(followCollRef, auth.currentUser.uid);
    const userFollowingCollRef = collection(userDocRef, "userFollowing");

    deleteDoc(doc(userFollowingCollRef, props.route.params.uid));
    setFollowing(false)
    console.log(props.following)
  };

 
  if (user === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  function Profilscreen()
{
  return( <View style={styles.container}>
    <View style={styles.containerInfo}>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
{logut==true?
      props.route.params.uid  !== auth.currentUser.uid ? (
        <View>
          {following ? (
            <Button
              title="Following"
              onPress={() => {
                onUnfollow();
              }}
            />
          ) : (
            <Button
              title="Follow"
              onPress={() => {
                onFollow();
              }}
            />
          )}
        </View>
      ) : <Button
      title="Logout"
      onPress={() => {
        if (auth.currentUser) {
          signOut(auth)
            .then(() => {
              setLogut(false)
            
            
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }}
    />:null}
    </View>
    <View style={styles.containerGallery}>
      <FlatList
        numColumns={3}
        horizontal={false}
        data={userPosts}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <Image
              style={styles.image}
              source={{ uri: item.downloadURL }}
            />
          </View>
        )}
      />
    </View>
  </View>)
}
  return (
    <SafeAreaView style={{ flex: 1 }}>
     <Stack.Navigator>
{logut==true ? <Stack.Screen name='Profile' component={Profilscreen}/> :
<Stack.Screen name='App' component={App}/>}
     </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
