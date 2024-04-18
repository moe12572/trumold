import React, { useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  SIZES,
  FONTS,
  BUTTON,
  BUTTONTEXT,
  COLORS,
  icons,
} from "../../constants";
import { getCurrentUserInfo } from "../../utils/services/StorageService";
import RenderItem from "./RenderItem";

const Scale = (props) => {
  const { size, returnValue, setSelectedScale, type } = props;
  const weightUnits = [{ label: "Lbs" }, { label: "Kg" }];
  const heightUnits = [{ label: "Ft" }, { label: "Cm" }];

  const [sliderValue, setSliderValue] = useState(0);
  const [_sliderValue, set_SliderValue] = useState(0);
  const [tempSliderValue, setTempSliderValue] = useState(0);
  const [firstIndexSlide, setFirstIndexSlide] = useState(size ? size + 10 : 10);
  const [unit, setUnit] = useState(null);
  const slider_items = Array.from(Array(999).keys());
  const [selectedWeight, setSelectedWeight] = useState("Lbs");
  const [selectedHeight, setSelectedHeight] = useState("Ft");
  const [isChanged, setIsChanged] = useState(false);
  const flatListRef = React.useRef();

  useEffect(() => {
    defaultValueSet();
    if (props.for === "height") {
      setSelectedScale(selectedHeight);
    } else {
      setSelectedScale(selectedWeight);
    }
  }, []);

  const defaultValueSet = (_selectedWeight = "Lbs") => {
    setTimeout(() => {
      switch (_selectedWeight) {
        case "Lbs":
          setFirstIndexSlide(parseInt(size) + 10);
          setTimeout(() => {
            flatListRef.current.scrollToIndex({
              animated: false,
              index: size ? size : 0,
            });
          }, 100);
          break;
        case "Kg":
          let weight_kg = size * 0.453592; //1 pound=0.453592
          setFirstIndexSlide(parseInt(weight_kg) + 10);
          setTimeout(() => {
            flatListRef.current.scrollToIndex({
              animated: false,
              index: weight_kg,
            });
          }, 100);
          break;
        case "Ft":
          setFirstIndexSlide(parseInt(size) + 10);
          setTimeout(() => {
            flatListRef.current.scrollToIndex({
              animated: false,
              index: size ? size : 0,
            });
          }, 100);
          break;
        case "Cm":
          let height_cm = size * 30.48; //1 fit=0.453592
          setFirstIndexSlide(parseInt(height_cm) + 10);
          setTimeout(() => {
            flatListRef.current.scrollToIndex({
              animated: false,
              index: height_cm.toFixed(1),
            });
          }, 100);
          break;
        default:
          break;
      }
    }, 200);
  };

  const updateWeightUnit = (item) => {
    setUnit(item.label);
    setSelectedWeight(item.label);
    setSelectedScale(item.label);
    setSliderValue(0);
    returnValue(0);
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    defaultValueSet(item.label);
  };

  const updateHeightUnit = (item) => {
    setUnit(item.label);
    setSelectedHeight(item.label);
    setSelectedScale(item.label);
    setSliderValue(0);
    returnValue(0);
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    defaultValueSet(item.label);
  };

  useEffect(() => {
    setTimeout(() => {
      _getUser();
    }, 1000);
  }, []);

  const _getUser = async () => {
    let user = await getCurrentUserInfo();
    let value = size;
    
    switch (type) {
      case "weight":
        let weight = user.weight;
        if (weight !== null) {
          value = parseInt(weight);
          let w =weight.replace(/[0-9]/g, "");
          setSelectedWeight(w.trim());
          setSelectedScale(w.trim());
          setUnit(w.trim());
        }
        break;
      case "height":
        if (user.height !== null) {
          value = parseFloat(user.height).toFixed(1);
          let height = user.height;
          let h =height.replace(/[0-9.]/g, "");
          setUnit(h.trim());
          setSelectedHeight(h.trim());
          setSelectedScale(h.trim());
        }
        break;
      case "targetWeight":
        if (user.traget_weight !== null) {
          value = parseInt(user.traget_weight);
          let traget_weight = user.traget_weight;
          let t = traget_weight.replace(/[0-9]/g, "");
          setSelectedWeight(t.trim());
          setSelectedScale(t.trim());
          setUnit(t.trim());
        }
        break;
      default:
        break;
    }
    setSliderValue(value);
    returnValue(value);
    set_SliderValue(value);
    setFirstIndexSlide(value + 10);
  };


  const weightButtons = () => {
    return (
      <View style={styles.row}>
        {weightUnits.map((item) => {
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => updateWeightUnit(item)}
              activeOpacity={1}
              style={[
                selectedWeight === item.label
                  ? { ...BUTTON.primary, width: 150 }
                  : {
                      ...BUTTON.secondary,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      width: 150,
                    },
              ]}
            >
              <Text
                style={[
                  selectedWeight === item.label
                    ? { ...BUTTONTEXT.primary }
                    : { ...BUTTONTEXT.primary, color: COLORS.dark },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const heightButtons = () => {
    return (
      <View style={styles.row}>
        {heightUnits.map((item) => {
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => updateHeightUnit(item)}
              activeOpacity={1}
              style={[
                selectedHeight === item.label
                  ? { ...BUTTON.primary, width: 150 }
                  : {
                      ...BUTTON.secondary,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      width: 150,
                    },
              ]}
            >
              <Text
                style={[
                  selectedHeight === item.label
                    ? { ...BUTTONTEXT.primary }
                    : { ...BUTTONTEXT.primary, color: COLORS.dark },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const sliderScrollEvent = (event) => {
    selectedHeight === "Ft" && props.for === "height"
      ? sliderScrollForHeightFTUnit(event)
      : sliderScroll(event);
  };

  const sliderScroll = (event) => {
    let value = parseInt((event.nativeEvent.contentOffset.x * 5) / SIZES.width);
    setTempSliderValue(value);
    if (_sliderValue !== 0) {
      setSliderValue(_sliderValue);
      returnValue(_sliderValue);
      set_SliderValue(0);
    } else {
      if (tempSliderValue < value) {
        if (tempSliderValue === 0) {
          setSliderValue(
            parseInt(event.nativeEvent.contentOffset.x / SIZES.width)
          );
          returnValue(
            parseInt(event.nativeEvent.contentOffset.x / SIZES.width)
          );
        } else {
          setSliderValue(parseInt(sliderValue) + 1);
          returnValue(parseInt(sliderValue) + 1);
        }
      }
      if (tempSliderValue > value) {
        setSliderValue(sliderValue !== 0 ? parseInt(sliderValue) - 1 : 0);
        returnValue(sliderValue !== 0 ? parseInt(sliderValue) - 1 : 0);
      }
    }
  };

  const sliderScrollForHeightFTUnit = (event) => {
    if (_sliderValue !== 0) {
      setSliderValue(_sliderValue);
      returnValue(_sliderValue);
      set_SliderValue(0);
    } else {
      setSliderValue(
        (event.nativeEvent.contentOffset.x / SIZES.width).toFixed(1)
      );
      returnValue((event.nativeEvent.contentOffset.x / SIZES.width).toFixed(1));
    }
  };

  const prevNumbers = () => {
    return selectedHeight === "Ft" && props.for === "height" ? (
      <>
        <Text style={[styles.text, { opacity: 0.1 }]}>
          {sliderValue > 2 ? Math.round(sliderValue) - 2 : "-"}
        </Text>
        <Text style={[styles.text, { opacity: 0.3 }]}>
          {sliderValue > 1 ? Math.round(sliderValue) - 1 : "-"}
        </Text>
      </>
    ) : (
      <>
        <Text style={[styles.text, { opacity: 0.1 }]}>
          {sliderValue > 10 ? Math.round(sliderValue) - 10 : "-"}
        </Text>
        <Text style={[styles.text, { opacity: 0.3 }]}>
          {sliderValue > 5 ? Math.round(sliderValue) - 5 : "-"}
        </Text>
      </>
    );
  };

  const nextNumbers = () => {
    return selectedHeight === "Ft" && props.for === "height" ? (
      <>
        <Text style={[styles.text, { opacity: 0.3 }]}>
          {Math.round(sliderValue) + 1}
        </Text>
        <Text style={[styles.text, { opacity: 0.1 }]}>
          {Math.round(sliderValue) + 2}
        </Text>
      </>
    ) : (
      <>
        <Text style={[styles.text, { opacity: 0.3 }]}>
          {Math.round(sliderValue) + 5}
        </Text>
        <Text style={[styles.text, { opacity: 0.1 }]}>
          {Math.round(sliderValue) + 10}
        </Text>
      </>
    );
  };

  const onChangeNumber = (value) => {
    if (selectedHeight === "Ft" && props.for === "height") {
      if (value < 20) {
        setSliderValue(value);
        returnValue(value);
        set_SliderValue(value);
        setIsChanged(true);
        setFirstIndexSlide(parseInt(value) + 10);
      }
    } else {
      if (value < 999) {
        setSliderValue(value);
        returnValue(value);
        set_SliderValue(value);
        setIsChanged(true);
        setFirstIndexSlide(parseInt(value) + 10);
      }
    }
  };

  const handleDismissKeyboard = () => {
    if (isChanged) {
      flatListRef.current.scrollToIndex({
        animated: false,
        index: sliderValue,
      });
      setIsChanged(false);
    }
  };

  return (
    <View>
      <View>
        <>
          {props.for === "weight" && weightButtons("Kg")}
          {props.for === "height" && heightButtons()}
        </>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.unitWrap}>
            <TextInput
              onChangeText={onChangeNumber}
              onBlur={handleDismissKeyboard}
              maxLength={
                props.for === "height" && selectedHeight === "Ft" ? 4 : 3
              }
              style={[
                {
                  height: 100,
                },
                styles.textBig,
              ]}
              value={sliderValue ? sliderValue.toString() : ""}
              keyboardType="numeric"
            />

            {props.for === "weight" && (
              <Text style={styles.text}>{unit ? unit : selectedWeight}</Text>
            )}
            {props.for === "height" && (
              <Text style={styles.text}>{unit ? unit : selectedHeight}</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        <FlatList
          style={{ zIndex: 1 }}
          ref={flatListRef}
          contentContainerStyle={styles.heightsliderscrollcontainer}
          data={slider_items}
          horizontal={true}
          decelerationRate={"fast"}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            sliderScrollEvent(event);
          }}
          initialNumToRender={firstIndexSlide}
          // initialScrollIndex={12}
          renderItem={_renderitem}
        />
        <View
          style={{
            flexDirection: "row",
            width: SIZES.width,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {prevNumbers()}
          <Image
            source={icons.scaleIcon}
            style={{ height: 10, width: 12, resizeMode: "contain" }}
          />
          {nextNumbers()}
        </View>
      </View>
    </View>
  );
  
};

export default memo(Scale);

const _renderitem = ({ item }) => <RenderItem item={item} />;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.basePadding,
  },
  unitWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.basePadding * 3,
    marginBottom: SIZES.basePadding,
  },
  secondaryBtn: {},
  text: {
    ...FONTS.body2,
    width: 30,
    textAlign: "center",
  },
  textBig: {
    ...FONTS.labelXLMedium,
  },
});
