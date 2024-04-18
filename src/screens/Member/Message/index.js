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
import React from "react";
import { COLORS, FONTS, images, SIZES } from "../../../constants";
import { API, graphqlOperation } from "aws-amplify";
import { listChatRooms } from "../../../graphql/queries";
import { useEffect, useState  } from "react";
import { getDataWithImage } from "../../../utils";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
import { UserRole } from "../../../models";
import EmptyState from "../../../components/empty-state";
import { Loader } from "../../../components";

export default function Message({navigation}) {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoader, setShowIsLoader] = useState(true);

 useEffect(()=>{
    getChatRoom();
  },[])

  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getChatRoom();
    });
    return screenChange;
  }, []);
  
  const getChatRoom = async () => {
    setIsLoader(true)
    try {
      let currentUser = await getCurrentUserInfo();
      if (currentUser.role === UserRole.MEMBER) {
        let _chatRoom = await API.graphql(
          graphqlOperation(listChatRooms, {
            filter: {
              chatRoomMemberId: {
                eq: currentUser.id,
              },     
            },
          })
        );
        let items = _chatRoom.data.listChatRooms.items;
        items = await getDataWithImage(items);
        var arr = [];
        items.map((item)=>{
          let index = arr.findIndex((e)=>e.coach.id===item.coach.id);
          if(index===-1){
            arr.push(item);
          }
        })
        setTimeout(()=>{
          setChatRooms(arr)
          setIsLoader(false)
          setShowIsLoader(false)
        },2000)
      }
    } catch (error) {
      setIsLoader(false)
      setShowIsLoader(false)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor={COLORS.dark} />
         <Text style={styles.header}>Messages</Text>
         {isLoader === true && isShowLoader ? <Loader /> : null}
        {chatRooms && chatRooms.length === 0 ?
         <View style= {{marginTop: "20%"}}>
         <EmptyState
          content="You don't have any connected member"/>
         </View>
         :
        <View
          style={{
            paddingHorizontal: SIZES.basePadding,
            paddingBottom: SIZES.basePadding * 2,
          }}
        >
          {chatRooms && chatRooms.map((item,index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MessageDetails", {
                    roomChat: item,
                    userName:item.coach?.name
                  })
                }
                activeOpacity={.6}
                style={{
                  flexDirection: "row",
                  padding: SIZES.base * 1.5,
                  alignItems: "center",
                }}
                key={index}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={item.image ? {uri:item.image} : images.userDummyImage}
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
                      {item.coach?.name}
                    </Text>
                    <Text style={{ ...FONTS.smallMedium }}>
                      {/* {messageItem.time} */}
                    </Text>
                  </View>
                  <Text style={{ ...FONTS.body1, color: COLORS.black40 }}>
                    {/* {messageItem.message} */}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
}
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