import React from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SIZES, INPUT } from "../../constants";

export default function Select(props) {
  return (
    <View style={styles.inputWrap}>
      <RNPickerSelect
        value={props.value?props.value:''}
        style={pickerSelectStyles}
        onValueChange={props.onValueChange}
        placeholder={{ label: props.placeholder }}
        items={props.data}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  inputWrap: {
    position: "relative",
    marginBottom: SIZES.basePadding,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    ...INPUT.primary,
  },
  inputAndroid: {
    ...INPUT.primary,
  },
});
