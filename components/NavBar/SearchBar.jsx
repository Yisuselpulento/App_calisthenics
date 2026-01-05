import  { useState, useRef } from "react";
import { View, TextInput, Text, Pressable, Image, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { searchUsersService } from "../../Services/userFetching";
import { useAuth } from "../../context/AuthContext";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { currentUser } = useAuth();
  const router = useRouter();
  const timeoutRef = useRef(null);

  const handleSearch = (value) => {
    setSearch(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const res = await searchUsersService(value);
      if (res.success) {
        setResults(res.data.filter((u) => u._id !== currentUser._id));
      } else {
        setResults([]);
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Input */}
      <TextInput
        value={search}
        onChangeText={handleSearch}
        placeholder="Buscar usuario..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

      {/* Resultados */}
      {results.length > 0 && (
        <ScrollView style={styles.results}>
          {results.map((user) => (
            <Pressable
              key={user._id}
              style={styles.resultItem}
              onPress={() => {
                setSearch("");
                setResults([]);
                router.push(`/profile/${user.username}`);
              }}
            >
              <Image
                source={{ uri: user.avatar.url }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.fullName}>{user.fullName}</Text>
                <Text style={styles.username}>@{user.username}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 300,
    minWidth: 200,
    padding: 4,
    position: "relative",
    zIndex: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  results: {
    position: "absolute",
    top: 40,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    maxHeight: 200,
    zIndex: 50,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  fullName: {
    color: "#fff",
    fontSize: 14,
  },
  username: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});
