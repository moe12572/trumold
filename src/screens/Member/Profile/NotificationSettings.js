import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, icons, FONTS } from "../../../constants";
import { PageHeader } from "../../../components";

export default function NotificationSettings({ navigation }) {
  const [PushIsEnabled, setPushIsEnabled] = useState(false);
  const togglePush = () => setPushIsEnabled((previousState) => !previousState);

  const [SMSIsEnabled, setSMSIsEnabled] = useState(false);
  const toggleSMS = () => setSMSIsEnabled((previousState) => !previousState);

  const [PromotionIsEnabled, setPromotionIsEnabled] = useState(false);
  const togglePromotion = () =>
    setPromotionIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <StatusBar backgroundColor={COLORS.dark} />
          <View style={{ padding: SIZES.basePadding }}>
            <PageHeader
              title="Notifications"
              navigation={navigation}
              backLink="Profile"
            />
            <View style={styles.row}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.notificationBellIcon}
                    style={{ height: 32, width: 32 }}
                  />
                  <View style={{ paddingLeft: SIZES.basePadding }}>
                    <Text style={styles.title}>Push Notifications</Text>
                    <Text style={styles.description}>
                      For daily update you will get it
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: COLORS.grey, true: COLORS.primary }}
                  thumbColor={PushIsEnabled ? "#fff" : "#fff"}
                  ios_backgroundColor={COLORS.grey}
                  onValueChange={togglePush}
                  value={PushIsEnabled}
                />
              </View>
            </View>

            {/* <View style={styles.row}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.notificationBellIcon}
                    style={{ height: 32, width: 32 }}
                  />
                  <View style={{ paddingLeft: SIZES.basePadding }}>
                    <Text style={styles.title}>SMS Notifications</Text>
                    <Text style={styles.description}>
                      For daily update you will get it
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: COLORS.grey, true: COLORS.primary }}
                  thumbColor={SMSIsEnabled ? "#fff" : "#fff"}
                  ios_backgroundColor={COLORS.grey}
                  onValueChange={toggleSMS}
                  value={SMSIsEnabled}
                />
              </View>
            </View> */}

            {/* <View style={styles.row}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={icons.notificationBellIcon}
                    style={{ height: 32, width: 32 }}
                  />
                  <View style={{ paddingLeft: SIZES.basePadding }}>
                    <Text style={styles.title}>Promotional Notifications</Text>
                    <Text style={styles.description}>
                      For daily update you will get it
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: COLORS.grey, true: COLORS.primary }}
                  thumbColor={PromotionIsEnabled ? "#fff" : "#fff"}
                  ios_backgroundColor={COLORS.grey}
                  onValueChange={togglePromotion}
                  value={PromotionIsEnabled}
                />
              </View>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    paddingVertical: SIZES.basePadding,
    marginBottom: SIZES.base,
  },
  title: {
    ...FONTS.body2Medium,
  },
  description: {
    color: COLORS.black40,
    ...FONTS.body1,
  },
});
