import React from "react";
import { useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { COLORS } from "../../constants";
import { GOOGLE_API_KEY } from "../../utils";

const Location = (props) => {
  const {onPress,placeholder,...otherProps} = props;
  return (
    <GooglePlacesAutocomplete
      styles={{
        container: { width: "100%" },
        textInputContainer: {
          borderWidth: 1,
          borderColor: COLORS.grey,
          height: 50,
          borderRadius: 10,
          paddingVertical: 2,
          marginBottom: 10,
        },
        listView: { backgroundColor: "white" },
      }}
      placeholder= {placeholder}
      fetchDetails={true}
      onPress={onPress}
      onFail={(error) => console.log(error)}
      onNotFound={() => console.log("no results")}
      query={{
        key: GOOGLE_API_KEY,
        language: "en",
        components: "country:usa"
      }}
      {...otherProps}
    />
  );
};

export default Location;
