import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  BUTTON,
  BUTTONTEXT,
} from "../../constants";
import { Input } from "../../components";
import { NotificationMessageType, UserRole } from "../../models";
import { useEffect } from "react";
import { getCurrentUserInfo, getUserSelectedRole } from "../../utils/services/StorageService";
import { API, graphqlOperation } from "aws-amplify";
import { updateBookSession } from "../../graphql/mutations";
import { SwipeListView } from "react-native-swipe-list-view";
import { sendPushNotification } from "../push-notification";

export default function SessionCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [roleType, setRoleType] = useState(UserRole.COACH);
  const [sessionId, setSessionId] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [coachName, setCoachName] = useState("");
  const [coachId, setCoachId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [sessionSlot, setSessionSlot] = useState("");
  const [sessionIncorporateTime, setSessionIncorporateTime] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState("");
  const [userName, setUserName] = useState("");
  const [version, setversion] = useState("");
  const [userInfo, setUserInfo] = useState("");
  useEffect(() => {
    getCurrentRole();
  }, []);

  const getCurrentRole = async () => {
    try {
      let role = await getUserSelectedRole();
      setRoleType(role);
    } catch (error) {
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const cancelSession = (items) => {
    setUserInfo(items);
    setCoachId(items.coachID);
    setTrainingType(items.trainingType);
    setCoachName(items.coach.name);
    setAppointmentDate(items.appointment_date);
    setSessionSlot(items.session_slot);
    setLocation(items.location);
    setSessionId(items.id);
    setRate(items.coach.hourly_rate);
    setUserName(items.created_by_id.username);
    setversion(items._version);
    setSessionIncorporateTime(items.session_incorporate_time);
    setSessionTime(items.session_time);
    setModalVisible(true);
    let status = "Cancelled";
    setUserStatus(status);
  };

  const selectReason = (reason) => {
    setSelected(reason.text);
  };

  const reasons = [
    {
      text: "Dummy Reason",
    },
    {
      text: "Dummy Reason 2",
    },
    {
      text: "Dummy Reason 3",
    },
    {
      text: "Others",
    },
  ];

  const cancelBookSession = async () => {
    let _user = await getCurrentUserInfo();
    try {
      let payload = {
        id: sessionId,
        status: userStatus,
        _version: version,
        reason: selected,
      };
      if (selected === null) {
        Alert.alert("Please select cancelling reason");
      } else {
        if (_user.role === UserRole.COACH) {
           sendPushNotification({
             expoToken: userInfo.created_by_id.expoToken,
             title: "Cancel Session Request",
             message: "Session cancelled by",
             url: "",
             to: userInfo.created_by_id.id,
             messageType: NotificationMessageType.COMMON,
           });
         } else{
           if(_user.role === UserRole.MEMBER){
           sendPushNotification({
             expoToken: userInfo.coach.expoToken,
             title: "Cancel Session Request",
             message: "Session cancelled by",
             url: "",
             to: userInfo.coach.id,
             messageType: NotificationMessageType.COMMON,
           });
       }
     }
        await API.graphql(
          graphqlOperation(updateBookSession, { input: payload })
        );
        setModalVisible(!modalVisible);
        props.navigation.navigate("CancelledSucess")
        setSelected(null);
        props.cancelSession(sessionId);
      }
    } catch (error) {
      if (error.errors) {
        Alert.alert(error.errors[0].message);
      }
    }
  };

  const checkRating = (data) => {
    if (props.ratingData) {
      let sessionRating = props.ratingData;
      let index = sessionRating.findIndex((e) => e.ratingSession_idId === data);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  };

  const renderItem = (data) => {
    let session = data.item;
    return (
      <View
        style={{
          marginBottom: SIZES.basePadding,
        }}
      >
        {session.status === "Cancelled" ||
          ("Confirmed" && (
            <View style={styles.cardWrap}>
              {/* card header */}
              <View style={styles.row}>
                <Text style={{ ...FONTS.body2Medium, color: COLORS.dark }}>
                  {session.trainingType}
                </Text>
                {session.status == null ? (
                  <Text
                    style={{
                      ...FONTS.body2Medium,
                      color: COLORS.primary,
                    }}
                  >
                    $ {session?.coach?.hourly_rate}
                  </Text>
                ) : (
                  <Text
                    style={{
                      ...FONTS.body2Medium,
                      color: COLORS.primary,
                    }}
                  >
                    {props.headerType && props.headerType === "session"
                      ? "Completed"
                      : session.status}
                  </Text>
                )}
              </View>
              {/* card body */}
              <View
                style={{
                  marginTop: SIZES.base * 0.8,
                  marginBottom: SIZES.base * 1.7,
                }}
              >
                <Text
                  style={{
                    ...FONTS.smallMedium,
                    color: COLORS.black60,
                  }}
                >
                  By{" "}
                  {roleType != UserRole.COACH
                    ? session?.coach?.name
                    : session?.created_by_id?.name}
                </Text>
              </View>

              {/* card footer */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Image source={icons.clockIcon} style={styles.icons} />
                  <Text style={styles.text}>{session.session_slot}</Text>
                </View>
                <View style={styles.col}>
                  <Image source={icons.calendarIcon} style={styles.icons} />
                  <Text style={styles.text}>{session.appointment_date}</Text>
                </View>
                <View style={styles.col}>
                  <Image source={icons.locationIcon} style={styles.icons} />
                  <Text style={[styles.text,{ width: 60}]} ellipsizeMode='tail' numberOfLines={1} >{session.location}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    );
  };

  const renderHiddenItem = (data) => {
    let session = data.item;
    let id = data.item.id;
    checkRating(id);
    return (
      <View
        style={{
          justifyContent: "flex-end",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {props.headerType && props.headerType === "upcoming" ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => cancelSession(session)}
            style={{
              height: "100%",
              justifyContent: "center",
              width: 80,
              alignItems: "center",
            }}
          >
            <Image
              source={icons.cancelIcon}
              style={{
                height: 40,
                width: 40,
                tintColor: COLORS.primary,
              }}
            />
            <Text
              style={{
                ...FONTS.smallBold,
                marginTop: SIZES.base,
                color: COLORS.primary,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        ) : null}
        {checkRating(id) !== true ? (
          <>
            {props.headerType && props.headerType === "session" ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate("Review", {
                    sessionId: data.item.id,
                    coachId: data.item.coach.id,
                    userId: data.item.created_by_id.id,
                    session: data.item,
                  });
                }}
                style={{
                  height: "100%",
                  justifyContent: "center",
                  width: 80,
                  alignItems: "center",
                }}
              >
                <Image
                  source={icons.starIcon}
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: COLORS.green,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.smallBold,
                    marginTop: SIZES.base,
                    color: COLORS.green,
                  }}
                >
                  Rating
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            props.navigation.navigate(
              roleType == UserRole.COACH ? "BookingDetails" : props.headerType === "session" ? "SessionDetails" : "SessionPreview",
              { data: session}
            )
          }
          style={{
            height: "100%",
            justifyContent: "center",
            width: 80,
            alignItems: "center",
          }}
        >
          <Image source={icons.previewIcon} style={{ height: 40, width: 40 }} />
          <Text
            style={{
              ...FONTS.smallBold,
              marginTop: SIZES.base,
              color: COLORS.green,
            }}
          >
            Preview
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <SwipeListView
        data={props.data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-180}
        previewRowKey={props.data.key}
        keyExtractor={(rowData, index) => {
          return index.toString();
        }}
        showsVerticalScrollIndicator={false}
      />
      {/* Cancel Session Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <SafeAreaView style={styles.modalView}>
            <View>
              <View style={[styles.modalHeader, styles.modalSpacing]}>
                <Text style={{ ...FONTS.body2Medium }}>
                  Reason For Cancelling?
                </Text>
                <Pressable
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelected(null);
                  }}
                >
                  <Image
                    source={icons.closeIcon}
                    style={{ height: 24, width: 24 }}
                  />
                </Pressable>
              </View>
              <View style={[styles.modalBody, styles.modalSpacing]}>
                <Text
                  style={{ ...FONTS.body1Medium, paddingBottom: SIZES.base }}
                >
                  Tell us why you need to cancel your session.
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {reasons.map((reason) => {
                    return (
                      <Pressable
                        key={reason.text}
                        onPress={() => selectReason(reason)}
                        style={[
                          styles.button,
                          reason.text === selected && {
                            borderColor: COLORS.primary,
                          },
                        ]}
                      >
                        <Text style={{ ...FONTS.body1Medium }}>
                          {reason.text}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={{ marginTop: SIZES.basePadding * 1.5 }}>
                  <Text
                    style={{ ...FONTS.body1Medium, paddingBottom: SIZES.base }}
                  >
                    Tell us why You're Canceling (Optional)
                  </Text>
                  <Input multiline={true} placeholder="Tell us Something..." />
                </View>
              </View>
            </View>
            <View style={[styles.modalFooter, styles.modalSpacing]}>
              <Pressable
                style={{
                  ...BUTTON.secondary,
                  borderWidth: 1,
                  borderColor: COLORS.grey,
                  width: SIZES.width / 2.3,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  props.navigation.navigate("RescheduleSession", {
                    id: sessionId,
                    trainingType: trainingType,
                    coachName: coachName,
                    appointmentDate: appointmentDate,
                    sessionSlot: sessionSlot,
                    location: location,
                    hourlyRate: rate,
                    userName: userName,
                    version: version,
                    sessionIncorporateTime: sessionIncorporateTime,
                    sessionTime: sessionTime,
                    coachId: coachId,
                    userInfo: userInfo
                  });
                }}
              >
                <Text style={{ ...BUTTONTEXT.primary, color: COLORS.dark }}>
                  Re-schedule
                </Text>
              </Pressable>
              <Pressable
                style={{ ...BUTTON.primary, width: SIZES.width / 2.3 }}
                onPress={() => cancelBookSession()}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Confirm</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  cardWrap: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    padding: SIZES.basePadding,
    borderRadius: SIZES.base,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  col: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    ...FONTS.smallBold,
    color: COLORS.dark,
  },
  icons: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
  },

  // Modal
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    backgroundColor: "white",
    width: SIZES.width,
    flex: 1,
    justifyContent: "space-between",
  },
  modalSpacing: {
    paddingVertical: SIZES.basePadding * 1.3,
    paddingHorizontal: SIZES.basePadding,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
  },
  button: {
    paddingHorizontal: SIZES.basePadding * 1.5,
    paddingVertical: SIZES.base * 1.5,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    marginRight: SIZES.base,
  },
  modalFooter: {
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
