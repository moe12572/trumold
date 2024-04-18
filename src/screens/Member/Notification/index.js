import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, icons, SIZES } from "../../../constants";
import { PageHeader, Loader } from "../../../components";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import { NotificationMessageType, UserRole } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { API, graphqlOperation } from "aws-amplify";
import { listNotifications } from "../../../graphql/queries";
import EmptyState from "../../../components/empty-state";
import { onCreateNotification } from "../../../graphql/subscriptions";

export default function Notification({ navigation, route }) {
  const { params } = route;
  const { id } = params;
  const [notificationList, setNotificationList] = useState([]);
  const [allNotificationList, setAllNotificationList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [screen, setScreen] = useState(ScreenName.HOMECOACH);
  const [activeTab,setActiveTab] = useState(NotificationMessageType.COMMON);
  const [countNoti,setCountNoti] = useState(0);
  const [countNotiPayment,setCountNotiPayment] = useState(0);
  useEffect(() => {
    getRole();
    getNotificationList();
  }, []);
  const getRole = async () => {
    let role = await getUserSelectedRole();
    if (role == UserRole.MEMBER) {
      setScreen(ScreenName.MEMBERHOME);
    }
  };

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateNotification)
    ).subscribe({
      next: (data) => {
        getNotificationList();
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const getNotificationList = async () => {
    setIsLoader(true);
    try {
      let notification = await API.graphql(
        graphqlOperation(listNotifications, {
          filter: {
            notificationToId: {
              eq: id,
            },
          },
        })
      );
      if(notification.data.listNotifications && notification.data.listNotifications.items){
        setAllNotificationList(notification.data.listNotifications.items);
        let _common= notification.data.listNotifications.items.filter((e)=>e.messageType===NotificationMessageType.COMMON);
        let _payment= notification.data.listNotifications.items.filter((e)=>e.messageType===NotificationMessageType.PAYMENT);
        setNotificationList(_common);
        setCountNoti(_common.length);
        setCountNotiPayment(_payment.length);
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
    }
  };

  const handleFilterNotification=(type)=>{
    setIsLoader(true)
    try{
    setActiveTab(type)
    if(allNotificationList && allNotificationList.length !== 0){
      let _notification = [...allNotificationList];
      setNotificationList(_notification.filter((e)=>e.messageType===type))
    }
    setIsLoader(false)
  } catch(error){
    setIsLoader(false)
  }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          <PageHeader
            title="Notifications"
            navigation={navigation}
            backLink={screen}
          />
          {isLoader === true ? <Loader /> : null}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: SIZES.base,
              backgroundColor: COLORS.grey,
              borderRadius: SIZES.base,
            }}
          >
            <TouchableOpacity  style={[styles.button, { backgroundColor: activeTab===NotificationMessageType.PAYMENT?"#fff":COLORS.grey }]}
             onPress={()=>handleFilterNotification(NotificationMessageType.PAYMENT)}>
              <Text style={[styles.buttonText, { color: activeTab===NotificationMessageType.PAYMENT?COLORS.primary:COLORS.black100  }]}>Payments ({countNotiPayment})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: activeTab===NotificationMessageType.COMMON?"#fff":COLORS.grey }]}
              onPress={()=>handleFilterNotification(NotificationMessageType.COMMON)}
            >
              <Text style={[styles.buttonText, { color: activeTab===NotificationMessageType.COMMON?COLORS.primary:COLORS.black100  }]}>
                Notifications ({countNoti})
              </Text>
            </TouchableOpacity>
          </View>
          {notificationList && notificationList.length === 0 ? (
            <View>
              <EmptyState content="You don't have any notification" />
            </View>
          ) : (
            <View style={{ paddingBottom: SIZES.basePadding }}>
              
              {isLoader === true ? <Loader /> : null}
              {notificationList &&
                notificationList.map((notification, index) => {
                  return (
                    <Pressable
                      key={index}
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                          marginTop: SIZES.basePadding * 1.7,
                        },
                        notification.seen && { opacity: 0.4 },
                      ]}
                    >
                      <View
                        style={{
                          height: 48,
                          width: 48,
                          borderRadius: 48,
                          borderColor: COLORS.primary,
                          borderWidth: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={icons.fireIcon}
                          style={{
                            height: 24,
                            width: 24,
                            tintColor: COLORS.primary,
                          }}
                        />
                      </View>

                      <View style={{ flex: 1, paddingLeft: SIZES.basePadding }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: SIZES.base / 2,
                          }}
                        >
                          <Text style={{ ...FONTS.body2Bold }}>
                            {notification.title} 
                          </Text>
                          {/* <Text style={{ ...FONTS.body1 }}>
                        {notification.time}
                      </Text> */}
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{ ...FONTS.body1Medium }}
                        >
                          {notification.message} {notification.from.name}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    paddingHorizontal: SIZES.base / 2,
    width: "50%",
    paddingVertical: SIZES.base * 1.2,
    borderRadius: SIZES.base,
  },
  buttonText: {
    textAlign: "center",
    ...FONTS.body2Medium,
  },
});
