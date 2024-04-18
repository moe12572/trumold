import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Composer,
} from "react-native-gifted-chat";
import { COLORS, FONTS, icons } from "../../../constants";
import { API, graphqlOperation } from "aws-amplify";
import { createMessage } from "../../../graphql/mutations";
import { getUser, listMessages } from "../../../graphql/queries";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
import { onCreateMessage } from "../../../graphql/subscriptions";
import { NotificationMessageType, UserRole } from "../../../models";
import { sendPushNotification } from "../../../components/push-notification";
import { PageHeader } from "../../../components";

export default function MessageDetails({ navigation, route }) {
  const { params } = route;
  const { roomChat } = params;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    getMessageData();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: async ({ provider, value }) => {
        let currentUser = await getCurrentUserInfo();
        let chatRoom = value.data.onCreateMessage;
        if (currentUser.id !== chatRoom.messageUserId && roomChat.id===chatRoom.messageChatRoomId) {
          setMessages((messages) => {
            const newArr = [...messages];
            let d = {
              _id: chatRoom.id,
              createdAt: new Date(chatRoom.createdAt),
              text: chatRoom.text,
              user: {
                _id: chatRoom.messageUserId,
                name: chatRoom.user.name,
              },
            };
            newArr.push(d);
            let sortData = newArr.sort(function (a, b) {
              var first = new Date(a.createdAt);
              var second = new Date(b.createdAt);
              return second - first;
            });
            return sortData;
          });
        }
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const getMessageData = async () => {
    try {
      let currentUser = await getCurrentUserInfo();
      setUserId(currentUser);
      let listing = await API.graphql(
        graphqlOperation(listMessages, {
          filter: {
            messageChatRoomId: {
              eq: roomChat.id,
            },
          },
        })
      );
      let _messagesList = [];
      if (listing.data.listMessages) {
        listing.data.listMessages.items.map((e) => {
          _messagesList.push({
            _id: e?.id,
            createdAt: new Date(e.createdAt),
            text: e?.text,
            user: {
              _id: e?.messageUserId,
              name: e?.user?.name,
            },
          });
        });
        setTimeout(() => {
          let sortData = _messagesList.sort(function (a, b) {
            var first = new Date(a.createdAt);
            var second = new Date(b.createdAt);
            return second - first;
          });
          setMessages(sortData);
        }, 2000);
      }
    } catch (error) {
    }
  };

  const getCurrentChatUser = async (id, route) => {
    try {
      let _user = await API.graphql(graphqlOperation(getUser, { id: id }));
      if (_user.data.getUser.userStatus !== "active") {
        sendPushNotification({
          expoToken: _user.data.getUser.expoToken,
          title: "Chat message",
          message: `Message by`,
          url: "",
          to: _user.data.getUser.id,
          messageType: NotificationMessageType.COMMON,
          route: route,
        });
      }
    } catch (error) {
    }
  };

  const onSend = useCallback(async (_messages = []) => {
    let text = _messages.map((e) => e.text).toString();
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, _messages)
    );
    if (userId.role === UserRole.MEMBER) {
      getCurrentChatUser(roomChat.coach.id, "CoachHome");
    } else {
      getCurrentChatUser(roomChat.member.id, "MemberHome");
    }
    try {
      let payload = {
        messageUserId: userId.id,
        messageChatRoomId: roomChat.id,
        text: text,
      };
      await API.graphql(graphqlOperation(createMessage, { input: payload }));
    } catch (err) {
    }
  });

  function renderInputToolbar(props) {
    return <InputToolbar {...props} containerStyle={styles.toolbar} />;
  }

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ padding: 5 }}>
        <Image
          source={icons.sendMessageIcon}
          style={{ height: 35, width: 35 }}
        />
      </Send>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.dark} />
        <PageHeader
            title={params?.userName}
            navigation={navigation}
            backLink="Message"
        />

        {/* <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.backIcon}
              style={{
                height: 30,
                width: 30,
                marginRight: "33%",
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>
          <Text style={{ ...FONTS.h2, textAlign: "center" }}>
            {params?.userName}
          </Text>
        </View> */}
        <GiftedChat
          renderInputToolbar={renderInputToolbar}
          messages={messages}
          renderSend={renderSend}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: userId.id,
            name: params?.userName,
          }}
          renderComposer={(props1) => (
            <Composer
              {...props1}
              placeholderTextColor={COLORS.white}
              textInputStyle={styles.textInputStyle}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  toolbar: {
    backgroundColor: "#36b1b3",
    color: COLORS.white,
  },
  textInputStyle: {
    color: COLORS.white,
  },
});