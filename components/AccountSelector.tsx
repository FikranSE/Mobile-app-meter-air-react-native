import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";

const AccountSelector = ({ customerType, selectedAccount, accounts, onSelectAccount, icons }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (isOpen) {
      // Close dropdown
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      // Open dropdown
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSelect = (account) => {
    onSelectAccount(account);
    toggleDropdown();
  };

  // Generate account display name with format: type + first 4 letters of username
  const getDisplayAccountName = (account) => {
    const isPascabayar = account.id_constumer.includes("PASCA");
    const accountType = isPascabayar ? "Pascabayar" : "Prabayar";

    // Extract username (assuming it's in the username field)
    // If username doesn't exist, try to extract from other fields or use a default
    let username = account.username || "";

    // If there's no username field, try to extract from id_constumer or name fields
    if (!username && account.name) {
      username = account.name;
    } else if (!username) {
      // Default case: just use the first part of id_constumer
      const parts = account.id_constumer.split("-");
      username = parts.length > 1 ? parts[1] : "user";
    }

    // Get first 4 letters of username
    const shortUsername = username.substring(0, 4).toLowerCase();

    return `${accountType} ${shortUsername}`;
  };

  // Get the display text for the currently selected account
  const getSelectedAccountDisplay = () => {
    if (!selectedAccount) return "Pilih Akun";
    return getDisplayAccountName(selectedAccount);
  };

  // Check if an account is the selected one
  const isSelectedAccount = (account) => {
    return selectedAccount && selectedAccount.id_constumer === account.id_constumer;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8}>
        <LinearGradient colors={["#3E93FF", "#0263FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
          <Text style={styles.buttonText}>{getSelectedAccountDisplay()}</Text>
          <Image source={icons.arrowDown} style={styles.arrowIcon} tintColor="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: opacityAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            {accounts &&
              accounts.map((account) => (
                <TouchableOpacity
                  key={account.id_constumer}
                  style={[styles.option, isSelectedAccount(account) && styles.selectedOption]}
                  onPress={() => handleSelect(account)}>
                  <LinearGradient
                    colors={isSelectedAccount(account) ? ["#8CC0FF", "#0263FF"] : ["#054BBC", "#054BBC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.optionGradient}>
                    <Text style={[styles.optionText, isSelectedAccount(account) && styles.selectedText]}>{getDisplayAccountName(account)}</Text>
                    {isSelectedAccount(account) && (
                      <Image source={icons.check || require("../assets/icons/check.png")} style={styles.checkIcon} tintColor="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8CC0FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 13,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: "#054BBC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8CC0FF",
    padding: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  scrollView: {
    maxHeight: 200,
  },
  scrollViewContent: {
    paddingVertical: 2,
  },
  option: {
    borderRadius: 8,
    marginVertical: 2,
    overflow: "hidden",
  },
  selectedOption: {
    backgroundColor: "#2181FF",
  },
  optionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 13,
    flex: 1,
  },
  selectedText: {
    fontWeight: "bold",
  },
  checkIcon: {
    width: 14,
    height: 14,
    marginLeft: 8,
  },
});

export default AccountSelector;
