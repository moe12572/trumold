import { Calendar} from "react-native-calendars";
import React from "react";
import { COLORS } from "../../constants";

export default function CustomCalendar(props) {
  return (
    <Calendar {...props}
      // markedDates={props.markedDates}
      theme={{
        "stylesheet.calendar.header": {
          week: {
            marginTop: 10,
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-around",
          },
        },
        textSectionTitleColor: COLORS.primary,
        indicatorColor: COLORS.primary,
        arrowColor: COLORS.dark,
        textDayHeaderFontWeight: "500",
        todayTextColor: COLORS.dark,        
        textDayFontSize: 14,
        textDayFontWeight: "500",
        monthTextColor: COLORS.dark,
        textMonthFontWeight: "700",
        textMonthFontSize: 24,     
        selectedDayBackgroundColor: COLORS.black20,
       }}
    />
  );
}
