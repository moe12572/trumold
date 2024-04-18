import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, icons, images, SIZES } from "../../../constants";
import { API, graphqlOperation } from "aws-amplify";
import { listChatRooms } from "../../../graphql/queries";
import { getDataWithImage } from "../../../utils";
import { Loader } from "../../../components";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
import { UserRole } from "../../../models";
import { onCreateChatRoom } from "../../../graphql/subscriptions";
import EmptyState from "../../../components/empty-state";

export default function MemberDetails({ navigation }) {
  const [chatRoom, setChatRoom] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoader, setShowIsLoader] = useState(true);

  useEffect(() => {
    getChatRoom();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateChatRoom)
    ).subscribe({
      next: (data) => {
        getChatRoom();
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const getChatRoom = async () => {
    try {
      setIsLoader(true);
      let currentUser = await getCurrentUserInfo();
      if (currentUser.role === UserRole.COACH) {
        let _chatRoom = await API.graphql(
          graphqlOperation(listChatRooms, {
            filter: {
              chatRoomCoachId: {
                eq: currentUser.id,
              },
            },
          })
        );
        let items = _chatRoom.data.listChatRooms.items;
        items = await getDataWithImage(items);
        let key = "chatRoomMemberId";
        let arrayUniqueByKey = [
          ...new Map(items.map((item) => [item[key], item])).values(),
        ];

        setChatRoom(arrayUniqueByKey);
        setIsLoader(false);
        setShowIsLoader(false)
      }
    } catch (error) {
      setIsLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {isLoader && isShowLoader ? <Loader /> : null}
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ flexDirection: "row"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.backIcon}
                style={{
                  height: 30,
                  width: 30,
                  marginRight: "31%",
                  marginLeft: 5,
                  marginTop: 8
                }}
              />
            </TouchableOpacity>
            <Text style={styles.header}>
             Members
            </Text>
          </View>
        {chatRoom && chatRoom.length === 0 ? (
          <View style={{ marginTop: "20%" }}>
            <EmptyState content="You don't have any connected member" />
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: SIZES.basePadding,
              paddingBottom: SIZES.basePadding * 2,
              borderTopColor: COLORS.black40,
              borderTopWidth: 1,
            }}
          >
            {chatRoom &&
              chatRoom.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MessageDetails", {
                        roomChat: item,
                        userName: item.member?.name,
                      })
                    }
                    activeOpacity={0.6}
                    style={{
                      flexDirection: "row",
                      padding: SIZES.base * 1.5,
                      alignItems: "center",
                    }}
                    key={index}
                  >
                    <View style={{ position: "relative" }}>
                      <Image
                        source={
                          item.image
                            ? { uri: item.member?.image }
                            : images.userDummyImage
                        }
                        style={{
                          width: 48,
                          height: 48,
                          resizeMode: "cover",
                          borderRadius: SIZES.basePadding * 3,
                        }}
                      />
                      <View
                        style={[
                          {
                            height: 14,
                            width: 14,
                            borderRadius: SIZES.basePadding,
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            borderWidth: 2,
                            borderColor: COLORS.white,
                          },
                          // messageItem.status === "online"
                          //   ? { backgroundColor: "#4ADE80" }
                          //   : { backgroundColor: "#A5A3A3" },
                        ]}
                      ></View>
                    </View>
                    <View style={{ paddingLeft: SIZES.basePadding, flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: SIZES.base / 2,
                        }}
                      >
                        <Text style={{ ...FONTS.body2Medium }}>
                          {item.member?.name}
                        </Text>
                        {/* <Text style={{ ...FONTS.smallMedium }}>
                        {messageItem.time}
                      </Text> */}
                      </View>
                      {/* <Text style={{ ...FONTS.body1, color: COLORS.black40 }}>
                      {messageItem.message}
                    </Text> */}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    color: COLORS.dark,
    marginBottom: SIZES.basePadding,
    marginTop: SIZES.base,
    ...FONTS.body2Bold,
    textAlign: "center",
  },
});
