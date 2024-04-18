import { API, graphqlOperation, Storage } from "aws-amplify";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { PageHeader } from "../../../components";
import { sendPushNotification } from "../../../components/push-notification";
import {
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
  BUTTON,
  BUTTONTEXT,
} from "../../../constants";
import { createChatRoom, updateBookSession } from "../../../graphql/mutations";
import { NotificationMessageType } from "../../../models";
import { listChatRooms } from "../../../graphql/queries";
export default function RequestDetails({ navigation, route }) {
  const { params } = route;
  const { data } = params;
  const dummyImage = images.userDummyImage;
  const [userStatus, setUserStatus] = useState("Confirmed");
  const [version, setVersion] = useState(data._version);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(()=>{
    getChatRoom();
  },[])
  const confirmBookSession = async () => {
    let status = "Confirmed";
    setUserStatus(status);
    setVersion(data._version);
    try {      
      let payload = {
        id: data.id,
        status: userStatus,
        _version: version,
      };
      let response = await API.graphql(
        graphqlOperation(updateBookSession, { input: payload })
      );
      if(chatRooms && chatRooms.length!==0){
        let index = chatRooms.findIndex((e)=>e.chatRoomCoachId ===data.coachID && e.chatRoomMemberId ===data.createdByID);
        if(index===-1){
          createNewChatRoom(data.createdByID, data.coachID);
        }
      }else{
        createNewChatRoom(data.createdByID, data.coachID);
      }
      sendPushNotification({
        expoToken: data.created_by_id.expoToken,
        title: "Confirm Session Request",
        message: "Session confirmed by",
        url: "",
        to: data.created_by_id.id,
        messageType: NotificationMessageType.COMMON,
      });
      navigation.navigate("ScheduleSucess");
    } catch (error) {
      if (error.errors) {
        Alert.alert(error.errors[0].message);
      }
    }

  };

  const createNewChatRoom = async (memberId, coachId) => { 
    try {
      let payload = {
        chatRoomCoachId: coachId,
        chatRoomMemberId: memberId,
      };
      await API.graphql(graphqlOperation(createChatRoom, { input: payload }));
    } catch (error) {}
  };

  const getChatRoom = async () => {
    try {
      let _chatRoom = await API.graphql(graphqlOperation(listChatRooms));
      if(_chatRoom.data && _chatRoom.data.listChatRooms && _chatRoom.data.listChatRooms.items){
        let items = _chatRoom.data.listChatRooms.items;
        setChatRooms(items);
      }
      
    } catch (error) {}
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={COLORS.dark} />
          <View style={{ paddingHorizontal: SIZES.base }}>
            <PageHeader
              title="Request Details"
              navigation={navigation}
              backLink="Home"
            />
          </View>
          <Image
            source={
              data.created_by_id.image
                ? { uri: data.created_by_id.image }
                : dummyImage
            }
            style={styles.image}
          />
          <Text style={styles.title}>{data.created_by_id.name}</Text>
          <Text
            style={{
              ...FONTS.body1,
              alignSelf: "center",
              color: COLORS.black60,
            }}
          >
            Beginner
          </Text>
          <Text
            style={{
              paddingHorizontal: SIZES.basePadding,
              marginTop: 15,
              ...FONTS.body1Bold,
            }}
          >
            Goal
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: SIZES.basePadding,
            }}
          >
            <Image
              source={icons.coreIcon}
              style={{
                height: 30,
                width: 30,
                alignSelf: "center",
                marginTop: 10,
              }}
            />
            <Text
              style={[
                styles.textSession,
                { marginLeft: 5, color: COLORS.black100, marginTop: 10 },
              ]}
            >
              Core
            </Text>
          </View>
          <Text
            style={{
              paddingHorizontal: SIZES.basePadding,
              marginTop: 15,
              ...FONTS.body1Bold,
            }}
          >
            Session Requests
          </Text>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession2}>Request 1</Text>
            <Image
              source={icons.checkIcon}
              style={{
                height: 12,
                width: 12,
                alignSelf: "center",
                marginTop: 20,
              }}
            />
          </View>
          <View style={styles.separator}></View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Date</Text>
            <Text style={styles.textSession2}>{data.appointment_date}</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Time</Text>
            <Text style={styles.textSession2}>{data.session_slot}</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Location</Text>
          </View>
          <Text
            style={{ ...FONTS.body1Bold, paddingHorizontal: SIZES.basePadding }}
          >
            {data.location}
          </Text>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Desired training Hours</Text>
            <Text style={styles.textSession2}>
              {data.session_incorporate_time}
            </Text>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Estimated Price</Text>
            <Text style={styles.textSession2}>${data?.coach?.hourly_rate}</Text>
          </View>
        </ScrollView>
        {data.status == "New Request" && (
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={{ ...BUTTON.primary }}
              onPress={() => {
                confirmBookSession();
              }}
            >
              <Text style={{ ...BUTTONTEXT.primary }}>Confirm </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 15,
  },
  title: {
    alignSelf: "center",
    ...FONTS.body1Bold,
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginTop: SIZES.basePadding,
    marginLeft: 15,
    marginRight: 15,
  },
  sessionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.basePadding,
  },
  textSession: {
    ...FONTS.body1,
    alignSelf: "center",
    color: COLORS.black60,
    marginTop: 20,
  },
  textSession2: {
    ...FONTS.body1Bold,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.black40,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
