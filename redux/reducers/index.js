import { combineReducers } from "redux";
import {user} from "./user.js"
import {users} from "./users.js"

const Reducers = combineReducers({
    userState:user,
    usersState:users
})

export default Reducers