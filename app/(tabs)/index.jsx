import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { getFeedEventsService } from "../../Services/feedFetching";
import PostCard from "../../components/Cards/PostCard";
import Spinner from "../../components/Spinner/Spinner";

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      const res = await getFeedEventsService();

      if (res?.success) {
        setFeed(res.data || []);
      }

      setLoading(false);
    };

    loadFeed();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner size={40} />
      </View>
    );
  }

  if (feed.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          No hay actividades recientes.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={feed}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <PostCard activity={item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 12,
    gap: 12,
  },
  emptyText: {
    color: "#9CA3AF",
  },
});
