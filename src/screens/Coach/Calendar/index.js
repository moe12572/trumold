import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { CustomCalendar, Loader, NewSessionRequest } from "../../../components";
import { getDataWithImage, sessionDateFormat } from "../../../utils";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser, listBookSessions } from "../../../graphql/queries";
import EmptyState from "../../../components/empty-state";

export default function Calendar({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sessionRequest, setSessionRequest] = useState([]);
  const [isLoader, setIsLoader] = useState("");

  useEffect(() => {
    setSelectedDate(sessionDateFormat(new Date()));
    const screenChange = navigation.addListener("focus", async () => {
      getCurrentUser();
    });
    return screenChange;
  }, []);

  const onPressArrowRight = (addMonth) => {
    setSelectedMonth(selectedMonth + 1);
    setIsDisabled(false);
    addMonth();
  };

  const numericFullMonthName = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const onPressArrowLeft = (subtractMonth) => {
    subtractMonth();
    setSelectedMonth(selectedMonth - 1);
    let month = new Date().getMonth();
    if (selectedMonth - 1 === month) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const getCurrentUser = async () => {
    setIsLoader(true)
    const _userInfo = await Auth.currentAuthenticatedUser({
      bypassCache: true,
    });
    let existUser = await API.graphql(
      graphqlOperation(getUser, { id: _userInfo.attributes.sub })
    );
    getSessionRequest(_userInfo.attributes.sub);
  };
  const getSessionRequest = async (coachId) => {
    let today = new Date();
    let mm = numericFullMonthName[today.getMonth()];
    let dd = today.getDate();
    let year = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    let date = `${year}-${mm}-${dd}`;
    try {
      setIsLoader(true)
      let mySession = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            coachID: {
              eq: coachId,
            },
            status:{
              eq: "New Request",
            },
            appointment_date: {
              ge: date,
            },
          },
        })
      );
      if (Object.keys(mySession).length !== 0) {
        let items = mySession.data.listBookSessions.items;
        items = await getDataWithImage(items);
        setSessionRequest(mySession.data.listBookSessions.items);
        setIsLoader(false)
      }
    } catch (error) {
      setIsLoader(false)
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const cancelSession = (session_id) => {
    let _newSession = [...sessionRequest];
    let index = _newSession.findIndex((e) => e.id === session_id);
    _newSession.splice(index, 1);
    setSessionRequest(_newSession);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={COLORS.dark} />
          {isLoader ? <Loader/> : null}
          <View style={{ paddingHorizontal: SIZES.basePadding }}>
            <CustomCalendar
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: COLORS.primary,
                },
              }}
              onDayPress={(event) => setSelectedDate(event.dateString)}
              minDate={new Date().toString()}
              disableArrowLeft={isDisabled}
              onPressArrowRight={onPressArrowRight}
              onPressArrowLeft={onPressArrowLeft}
            /> 
            <View style={styles.separator}></View>
            {sessionRequest.length === 0 ?
            <View>
              <EmptyState content="You don't have any New Session Request"/>
            </View>
            :
            <>
            <Text style={[styles.title, { marginBottom: SIZES.base }]}>
              New Session Request
            </Text>
            <View>
              <NewSessionRequest
                data={sessionRequest.slice(0, 3)}
                navigation={navigation}
                cancelSession={cancelSession}
              />
            </View>
            </>
             }
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginTop: SIZES.basePadding,
    marginBottom: SIZES.basePadding * 1,
  },
  title: {
    ...FONTS.body1Medium,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SIZES.basePadding,
  },
  button: {
    width: SIZES.width / 3.7,
    borderWidth: 1,
    borderColor: COLORS.grey,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.base,
    marginVertical: SIZES.base / 1.5,
    marginRight: SIZES.base,
  },
  buttonText: {
    ...FONTS.smallMedium,
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
  modalFooter: {
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
