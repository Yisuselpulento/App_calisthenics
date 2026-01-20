import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) {
  if (totalPages <= 1) return null;

  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const PageButton = ({ label, onPress, active, disabled }) => (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        active && styles.active,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.activeText,
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* PREV */}
      <PageButton
        label="←"
        onPress={() => onPageChange(page - 1)}
        disabled={page === 1}
      />

      {/* FIRST */}
      {start > 1 && (
        <>
          <PageButton label="1" onPress={() => onPageChange(1)} />
          {start > 2 && <Text style={styles.dots}>…</Text>}
        </>
      )}

      {/* PAGES */}
      {pages.map((p) => (
        <PageButton
          key={p}
          label={p}
          active={p === page}
          onPress={() => onPageChange(p)}
        />
      ))}

      {/* LAST */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <Text style={styles.dots}>…</Text>}
          <PageButton
            label={totalPages}
            onPress={() => onPageChange(totalPages)}
          />
        </>
      )}

      {/* NEXT */}
      <PageButton
        label="→"
        onPress={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  button: {
    minWidth: 32,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
  },

  active: {
    backgroundColor: "#FACC15",
  },

  disabled: {
    backgroundColor: "#1F2937",
  },

  text: {
    color: "#E5E7EB",
    fontWeight: "600",
  },

  activeText: {
    color: "#000",
  },

  disabledText: {
    color: "#6B7280",
  },

  dots: {
    color: "#9CA3AF",
    paddingHorizontal: 4,
  },
});
