/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 6/29/2017
 * Project: React Native Redux Quotes App with CRUD operations
 */

"use strict";
export const SAVE_PROFILE = "SAVE_PROFILE";
export const SAVE_UID = "SAVE_UID";
export const SAVE_USERS = "SAVE_USERS";
export const SAVE_POST = "SAVE_POST";
export const REMOVE = "REMOVE";
export const SAVE_BRAND = "SAVE_BRAND";

export const saveProfile = profile => ({
  type: SAVE_PROFILE,
  profile: profile
});
export const saveUID = uid => ({ type: SAVE_UID, uid: uid });
export const saveUsers = users => ({
  type: SAVE_USERS,
  users: users
});
export const savePosts = posts => ({
  type: SAVE_POST,
  posts: posts
});
export const saveBrand = brand => ({
  type: SAVE_BRAND,
  brand: brand
});
export const removeAll = () => ({
  type: REMOVE
});
