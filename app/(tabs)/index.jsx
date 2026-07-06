import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { getFeedEventsService } from "../../Services/feedFetching";
import PostCard from "../../components/Cards/PostCard";
import Spinner from "../../components/Spinner/Spinner";

// Caché en memoria: sobrevive a la navegación entre tabs mientras la app vive
let feedCache = null;

export default function Home() {
  const [feed, setFeed] = useState(feedCache || []);
  // Solo mostramos spinner la primera vez (sin caché). Si ya hay datos, se ven al instante.
  const [loading, setLoading] = useState(!feedCache);
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    const loadFeed = async () => {
      const res = await getFeedEventsService();

      if (res?.success) {
        feedCache = res.data || [];
        setFeed(feedCache);
      }

      setLoading(false);
    };

    // Refresca siempre en segundo plano (stale-while-revalidate)
    loadFeed();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVideoId(viewableItems[0].item._id);
    }
  });

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
      renderItem={({ item }) => (
        <PostCard
          activity={item}
          activeVideoId={activeVideoId}
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}

      /* 🔥 ESPACIADO */
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}

      /* PERF */
      removeClippedSubviews
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={5}
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
    paddingHorizontal: 12, // ← separación de los bordes
    paddingVertical: 12,
  },
  emptyText: {
    color: "#9CA3AF",
  },
});
