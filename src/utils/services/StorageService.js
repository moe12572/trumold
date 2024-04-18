import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "aws-amplify";
async function getUserSelectedRole() {
  try {
    const result = await AsyncStorage.getItem("UserSelectedRole");
    if (result !== null) {
      return result;
    }
  } catch (e) {
    return null;
  }
}

async function setUserSelectedRole(value) {
  try {
    await AsyncStorage.setItem("UserSelectedRole", value);
  } catch (e) {
    return null;
  }
}

async function getCurrentUserInfo() {
  try {
    const result = await AsyncStorage.getItem('CurrentUserInfo')
    return result != null ? JSON.parse(result) : null;
  } catch (e) {
    return null;
  }
}

async function setCurrentUserInfo(value) {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('CurrentUserInfo', jsonValue)
  } catch (e) {
    return null;
  }
}


async function loginInfo() {
  try {
    let userData = await Auth.currentUserInfo();
    return userData;
  } catch (err) {
    return err;
  }
}


async function getUserStatusOnlineOffline() {
  try {
    const result = await AsyncStorage.getItem('UserStatusOnlineOffline')
    return result != null ? JSON.parse(result) : null;
  } catch (e) {
    return null;
  }
}

async function setUserStatusOnlineOffline(value) {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('UserStatusOnlineOffline', jsonValue)
  } catch (e) {
    return null;
  }
}



export {
  getUserSelectedRole,
  setUserSelectedRole,
  loginInfo,
  getCurrentUserInfo,
  setCurrentUserInfo,
  getUserStatusOnlineOffline,
  setUserStatusOnlineOffline
};
