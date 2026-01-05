// hooks/useEnergy.js
import { useState, useEffect, useCallback } from "react";
import {
  getEnergyService,
  buyEnergyBoostService,
  buyFullEnergyService,
} from "../Services/energyFetching";

export const useEnergy = () => {
  const [energy, setEnergy] = useState(0);
  const [boostMultiplier, setBoostMultiplier] = useState(1);
  const [boostUntil, setBoostUntil] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para actualizar la energía desde el backend
  const fetchEnergy = useCallback(async () => {
    const response = await getEnergyService();
    if (response.success && response.user) {
      setEnergy(response.user.energy);
      setBoostMultiplier(response.user.energyRegenMultiplier || 1);
      setBoostUntil(response.user.energyRegenBoostUntil || null);
    }
  }, []);

  // 🔹 Boost temporal x2
  const buyBoost = async () => {
    setLoading(true);
    const response = await buyEnergyBoostService();
    if (response.success && response.user) {
      setEnergy(response.user.energy);
      setBoostMultiplier(response.user.energyRegenMultiplier);
      setBoostUntil(response.user.energyRegenBoostUntil);
    }
    setLoading(false);
    return response;
  };

  // 🔹 Recarga completa de energía
  const buyFullEnergy = async () => {
    setLoading(true);
    const response = await buyFullEnergyService();
    if (response.success && response.user) {
      setEnergy(response.user.energy);
    }
    setLoading(false);
    return response;
  };

  // 🔹 Polling automático cada 60 segundos
  useEffect(() => {
    fetchEnergy(); // Trae energía al montar el hook
    const interval = setInterval(fetchEnergy, 60000); // cada 60s
    return () => clearInterval(interval);
  }, [fetchEnergy]);

  return {
    energy,
    boostMultiplier,
    boostUntil,
    loading,
    fetchEnergy,
    buyBoost,
    buyFullEnergy,
  };
};
