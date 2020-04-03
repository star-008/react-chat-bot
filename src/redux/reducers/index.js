import { createReducer } from "reduxsauce";

export const initialState = {
  profile: null,
  uid: "",
  brand: {},
  users: []
};

const saveProfileReducer = (state, action) => ({
  ...state,
  profile: action.profile
});
const saveUIDReducer = (state, action) => ({
  ...state,
  uid: action.uid
});
const saveBrandReducer = (state, action) => ({
  ...state,
  brand: action.brand
});
const savePostsReducer = (state, action) => ({
  ...state,
  posts: action.posts
});
const saveUsersReducer = (state, action) => ({
  ...state,
  users: action.users
});
const removeAllReducer = (state, action) => ({
  ...state,
  profile: null,
  brand: null,
  uid: null,
  posts: null,
  users: []
});
const actionHandlers = {
  SAVE_PROFILE: saveProfileReducer,
  SAVE_UID: saveUIDReducer,
  SAVE_BRAND: saveBrandReducer,
  SAVE_POST: savePostsReducer,
  SAVE_USERS: saveUsersReducer,
  REMOVE: removeAllReducer
};
export default createReducer(initialState, actionHandlers);
