import { database } from "../../firebaseconfig";
import { auth } from "../../firebaseconfig";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
} from "../constans/index.js";
import { collection, doc, onSnapshot ,orderBy} from "firebase/firestore";
import { getDoc, getDocs,query } from "firebase/firestore";

export function fetchUser() {
  const userDocRef = doc(database, "users", auth.currentUser.uid);
  return (dispatch) => {
    getDoc(userDocRef)
      .then((doc) => {
        if (doc.exists()) {
          // console.log(doc.data())
          dispatch({ type: USER_STATE_CHANGE, currentUser: doc.data() });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    const getdata = async () => {
      const collectionRef = collection(
        database,
        "posts",
        auth.currentUser.uid,
        "userPosts"
      );

      const querySnapshot = await getDocs(collectionRef);
      let posts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });

      //  console.log(posts)
      dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
    };
    getdata();
  };
}

export const fetchUserFollowing = () => {
  return (dispatch) => {
    const activeUserDocRef = doc(database, "following", auth.currentUser.uid);
    const userFollowingCollRef = collection(activeUserDocRef, "userFollowing");
    let following = [];

    const unsub = onSnapshot(userFollowingCollRef, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const userid = change.doc.id;
          following.push(userid);
        }
        if (change.type === "removed") {
          let index = following.indexOf(change.doc.id);

          following.splice(index, 1);
        }
      });
      dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
      for(let i=0;i<following.length;i++){
        dispatch(fetchUsersData(following[i]))
      }
    });
  };
};





export const fetchUsersData = (uid, getPosts) => {
  return async (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      const userDocRef = doc(database, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        let user = userDocSnapshot.data();
        user.uid = userDocSnapshot.id;

        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
      }

      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
};

export const fetchUsersFollowingPosts = (uid) => {
  return async (dispatch, getState) => {
    const postDocsQuery = query(
      collection(database, "posts", uid, "userPosts"),
      orderBy("creation", "asc")
    );
    const snapshot = await getDocs(postDocsQuery);
    const user = getState().usersState.users.find((el) => el.uid === uid);

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data, user };
    });
console.log(posts)
    dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
    console.log(getState())
  };
};



