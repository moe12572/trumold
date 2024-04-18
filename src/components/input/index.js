import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import React, { useState } from "react";
import { SIZES, INPUT, icons, COLORS } from "../../constants";

export default function Input(props) {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const {errors} = props;  

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible)
  };
  return (
    <>
    <View style={styles.inputWrap}>
      {props.secureTextEntry ? (
        <TextInput
          style={{ ...INPUT.primary, paddingRight: SIZES.basePadding*3 }}
          placeholder={props.placeholder}
          secureTextEntry={passwordVisible}
          keyboardType={props.keyboardType}
          onBlur={props.onBlur}
          value={props.value}
          onChangeText={props.onChangeText}  
          maxLength={props.maxLength}
          autoCapitalize='none'
        />
      ) : (
        <TextInput
          style={[{...INPUT.primary,borderColor:errors?COLORS.danger:COLORS.grey}, props.multiline ? {...INPUT.largeInput}: null]}
          placeholder={props.placeholder}
          keyboardType={props.keyboardType} 
          onBlur={props.onBlur}
          value={props.value}
          onChangeText={props.onChangeText}   
          multiline={props.multiline}   
          maxLength={props.maxLength}
          autoCapitalize='none'
        />
      )}

      {props.secureTextEntry ? (
        <TouchableOpacity activeOpacity={1} style={styles.eyeIcon} onPress={togglePassword}>
          <Image
            source={passwordVisible? icons.eyeOff: icons.eyeOn}
            style={{
              width: 20,
              height: 20,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
    {props.errors?<Text style={{ ...INPUT.error }}>{props.errors}</Text>: null}
    </>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    position: "relative",
    paddingBottom: SIZES.basePadding,
  },
  eyeIcon: {
    position: "absolute",
    right: 1,
    height: 52,
    width: 52,
    top: 1,    
    zIndex: 2,    
    alignItems: "center",
    justifyContent: "center"
  },  
});
