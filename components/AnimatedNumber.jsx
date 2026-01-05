import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";

export default function AnimatedNumber({
  value,
  duration = 1000,
  interval = 50,
  decimals = 0,
  style,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const current = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const steps = Math.ceil(duration / interval);
    const stepValue = value / steps;
    current.current = 0;

    const animate = () => {
      current.current += stepValue;
      if (current.current >= value) {
        setDisplayValue(value);
        return;
      }
      setDisplayValue(current.current);
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <Text style={style}>
      {displayValue.toFixed(decimals)}
    </Text>
  );
}
