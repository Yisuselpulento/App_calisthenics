import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import {
  signupService,
  loginService,
  checkAuthService,
} from "../Services/AuthFetching";

import { getProfileByUsernameService } from "../Services/ProfileFetching";
import { toggleFollowService } from "../Services/followFetching";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [viewedProfile, setViewedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  /* ------------------ UPDATE USER ------------------ */
  const updateCurrentUser = (user) => {
    setCurrentUser(user);

    if (viewedProfile?._id === user._id) {
      setViewedProfile((prev) => ({
        ...prev,
        ...user,
      }));
    }
  };

  const updateViewedProfile = (user) => {
    setViewedProfile(user);
  };

  /* ------------------ RESTORE SESSION ------------------ */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await checkAuthService();

        if (res.success) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ------------------ LOAD PROFILE ------------------ */
  const loadProfile = async (username) => {
    if (viewedProfile?.username === username) return;

    setProfileLoading(true);
    try {
      const res = await getProfileByUsernameService(username);
      if (res.success) setViewedProfile(res.user || res.data);
      else setViewedProfile(null);
    } catch (err) {
      console.error(err);
      setViewedProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  /* ------------------ AUTH ACTIONS ------------------ */
  const signup = async (formData) => {
    return await signupService(formData);
  };

  const login = async (formData) => {
    const res = await loginService(formData);

    if (res.success && res.token) {
      await SecureStore.setItemAsync("authToken", res.token);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
    }

    return res;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setCurrentUser(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  /* ------------------ FOLLOW ------------------ */
  const toggleFollow = async (targetUser) => {
    if (followLoading) return;

    setFollowLoading(true);
    const res = await toggleFollowService(targetUser._id);

    if (res?.success) {
      updateCurrentUser(res.user);
    }

    setFollowLoading(false);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        signup,
        login,
        logout,
        updateCurrentUser,
        updateViewedProfile,
        viewedProfile,
        profileLoading,
        loadProfile,
        toggleFollow,
        followLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
