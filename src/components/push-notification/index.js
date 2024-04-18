import { API, graphqlOperation } from "aws-amplify";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {
  getCurrentUserInfo,
  getUserStatusOnlineOffline,
  setCurrentUserInfo,
} from "../../utils/services/StorageService";
import { createNotification, updateUser } from "../../graphql/mutations";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  try {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      let user = await getCurrentUserInfo();
      let payload = {
        id: user.id,
        expoToken: token,
      };
      if (!user.expoToken) {
        updateExpoPushToken(payload);
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  } catch (error) {
    return null;
  }
}

async function sendPushNotification(data) {

  try {
    let user = await getCurrentUserInfo();
    const message = {
      to: data.expoToken,
      sound: "default",
      title: `Trumold ${data.title}`,
      body: `${data.message} ${user.name}`,
      data: { someData: "goes here" },
    };
    let notiPlayload={
      notificationFromId:user.id,
      notificationToId:data.to,
      title:data.title,
      message:data.message,
      messageType:data?.messageType,
      url:data.url,
    }
    await addNotification(notiPlayload);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    return;
  }
}

async function updateExpoPushToken(payload) {
  try {
    let response = await API.graphql(
      graphqlOperation(updateUser, { input: payload })
    );
    await setCurrentUserInfo(response.data.updateUser);
    return;
  } catch (error) {
    return;
  }
}

async function addNotification(payload) {
  try {
    let response = await API.graphql(
      graphqlOperation(createNotification, { input: payload })
    );
    return response;
  } catch (error) {
    return;
  }
}

async function updateUserOnlineOfflineStatus() {
  try {
    let status = await getUserStatusOnlineOffline();
    let user = await getCurrentUserInfo();
    if(user){
      let payload = {
        id: user.id,
        userStatus: status,
      };
      let response = await API.graphql(
        graphqlOperation(updateUser, { input: payload })
      );
      await setCurrentUserInfo(response.data.updateUser);
    }
    return;
  } catch (error) {
    return;
  }
}



export { registerForPushNotificationsAsync, sendPushNotification,updateExpoPushToken,updateUserOnlineOfflineStatus };
