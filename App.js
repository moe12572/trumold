import AppLoading from "expo-app-loading";
import "react-native-gesture-handler";
import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Onboarding,
  Welcome,
  Registration,
  Login,
  ForgotPassword,
  ResetPassword,
  Information,
  Gender,
  Weight,
  TargetWeight,
  Height,
  ActivityLevel,
  ChooseDiet,
  Success,
  CategorySingle,
  Coachs,
  Notification,
  SessionDetails,
  CoachProfile,
  CreateSession,
  ScheduleSucess,
  RescheduleSucess,
  MessageDetails,
  Goals,
  ChangePassword,
  NotificationSettings,
  EditProfile,
  Info,
  PrimaryId,
  SecondaryId,
  ConfirmId,
  AddCertificate,
  ConfirmCertificate,
  Successfull,
  Calendar,
  RescheduleSession,
  CancelledSucess,
  MessageScreen,
  MemberDetail,
  BookingDetails,
  RequestDetails,
  Confirmation,
  CoachVerification,
  CoachProfileScreen,
  ProfileSettings,
  EditAccountInfo,
  Payments,
  PaymentMethod,
  Review,
  TotalReview,
  AccountScreen,
  PaymentScreen,
  SessionPreview
} from "./src/screens";
import Tabs from "./src/navigation/Tabs";
import CoachTabs from "./src/navigation/CoachTabs";
import ScreenName from "./src/utils/ScreenName";
import { Amplify } from 'aws-amplify';
import awsConfig from './src/aws-exports';
import { AppState, LogBox } from "react-native";
import { setUserStatusOnlineOffline } from "./src/utils/services/StorageService";
import { updateUserOnlineOfflineStatus } from "./src/components/push-notification";
Amplify.configure(awsConfig);
const Stack = createStackNavigator();
export default function App() {
  const [fontsLoaded] = useFonts({
    Regular: require("./assets/fonts/Inter-Regular.ttf"),
    Medium: require("./assets/fonts/Inter-Medium.ttf"),
    Bold: require("./assets/fonts/Inter-Bold.ttf"),
  });
 
  LogBox.ignoreAllLogs()

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setUserStatusOnlineOffline(nextAppState)
      updateUserOnlineOfflineStatus();
    });
    return () => {
      subscription.remove();
    };
  },[]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Onboarding'}
        >
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name={ScreenName.LOGIN} component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name={ScreenName.CONFIRMATION} component={Confirmation} />

          {/* Member */}
          <Stack.Screen name={ScreenName.INFORMATION} component={Information} />
          <Stack.Screen name={ScreenName.GENDER} component={Gender} />
          <Stack.Screen name="Weight" component={Weight} />
          <Stack.Screen name="TargetWeight" component={TargetWeight} />
          <Stack.Screen name="Height" component={Height} />
          <Stack.Screen name="ActivityLevel" component={ActivityLevel} />
          <Stack.Screen name="ChooseDiet" component={ChooseDiet} />
          <Stack.Screen name="Success" component={Success} />
          {/* Member Home Flow */}
          <Stack.Screen name="MemberHome" component={Tabs} />
          <Stack.Screen name={ScreenName.COACHHOME} component={CoachTabs} />
          <Stack.Screen name={"CoachVerification"} component={CoachVerification} />
          <Stack.Screen name="CategorySingle" component={CategorySingle} />
          <Stack.Screen name="Coachs" component={Coachs} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="SessionDetails" component={SessionDetails} />
          <Stack.Screen name="SessionPreview" component={SessionPreview} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="CoachProfile" component={CoachProfile} />
          <Stack.Screen name={ScreenName.CREATESESSION} component={CreateSession} />
          <Stack.Screen name="ScheduleSucess" component={ScheduleSucess} />
          <Stack.Screen name="RescheduleSucess" component={RescheduleSucess} />
          <Stack.Screen name="CancelledSucess" component={CancelledSucess} />
          <Stack.Screen name="Review" component={Review} />

          {/* Message Tab */}
          <Stack.Screen name="MessageDetails" component={MessageDetails} />

          {/* Profile Tab */}
          <Stack.Screen name="Goals" component={Goals} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="NotificationSettings"component={NotificationSettings}/>
          <Stack.Screen name="EditAccountInfo" component={EditAccountInfo} />
          <Stack.Screen name="Payments" component={Payments} />
          <Stack.Screen name={ScreenName.PAYMENT_METHOD} component={PaymentMethod} />

          {/* Coach */}
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="PrimaryId" component={PrimaryId} />
          <Stack.Screen name="SecondaryId" component={SecondaryId} />
          <Stack.Screen name="ConfirmId" component={ConfirmId} />
          <Stack.Screen name={ScreenName.ADDCERTIFICATE} component={AddCertificate} />
          <Stack.Screen name="ConfirmCertificate" component={ConfirmCertificate} />
          <Stack.Screen name="Successfull" component={Successfull} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} />
          <Stack.Screen name="MemberDetail" component={MemberDetail} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="RequestDetails" component={RequestDetails} />
          <Stack.Screen name="CoachProfileScreen" component={CoachProfileScreen} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
          <Stack.Screen name="TotalReview" component={TotalReview} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />

          {/* Calendar Tab */}
          <Stack.Screen name="Calendar" component={Calendar} />
          <Stack.Screen name="RescheduleSession" component={RescheduleSession} />

         
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
