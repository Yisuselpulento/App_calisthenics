import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const SelectCustom = ({ label, value, onChange, options }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          style={styles.picker}
          dropdownIconColor="white"
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: "#1f2937", // bg-stone-900
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db", // border-gray-300
  },
  picker: {
    color: "white",
    height: 44,
    width: "100%",
  },
});

export default SelectCustom;
