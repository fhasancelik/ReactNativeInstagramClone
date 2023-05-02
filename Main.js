import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPosts ,fetchUserFollowing,fetchUsersFollowingPosts,fetchUsersData} from "./redux/action/index.js";
import { View, Text, Button } from "react-native";
import { storage } from "./firebaseconfig.js";
import { auth } from "./firebaseconfig.js";
import { database } from "./firebaseconfig.js";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import Feed from "./Feed.js";
import Add from "./Add.js";
import Profile from "./Profile.js";
import Search from "./Search.js";
import Landing from './Landing.js'

import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Header, createStackNavigator } from "@react-navigation/stack";

const Tab = createMaterialBottomTabNavigator();
const stack=createStackNavigator()

function Empty() {
  return (
    <View>
      <Text>Empty</Text>
    </View>
  );
}



export class Main extends Component {
  
  componentDidMount() {
    let db = database;
    // console.log(db)

    //console.log(uid)
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
   
  //  this.props.fetchUsersFollowingPosts(auth.currentUser.uid)


  }
  
  render() {
   
    const { currentUser } = this.props;
    //console.log(currentUser)
    if (currentUser == undefined) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <Tab.Navigator initialRouteName="Feed" labeled={false}>
             
        <Tab.Screen
          name="Feed"
          component={Feed}
          
        
          options={{
            
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
      
          }}
        
        />
         <Tab.Screen
         navigation={this.props.navigation}
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Empty"
          component={Empty}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add",{up:this.props.fetchUserPosts()});
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              this.props.fetchUserPosts();
              navigation.navigate("Profile",{uid:auth.currentUser.uid}
              );
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser, fetchUserPosts,fetchUserFollowing,fetchUsersFollowingPosts,fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
