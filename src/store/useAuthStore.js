import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const { connectSocket } = get();
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      connectSocket();
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    const { connectSocket } = get();
    set({ isSigningUp: true });

    // console.log(data)

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });

      toast.success("Account created successfully!");
      connectSocket();
    } catch (error) {
      console.log("Error during signup", error);
      toast.error(error.response.data.error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    const { connectSocket } = get();

    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });

      toast.success("Logged in successfully!");
      connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somehing went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    const { disconnectSocket } = get();

    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });

      toast.success("Logged out successfully!");
      disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somehing went wrong");
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error in update profile: ", error);
      toast.error(error?.response?.data?.message || "Somehing went wrong");
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const socketT = io(BASE_URL, {
      withCredentials: true, // ensures cookies are sent with connection
    });

    socketT.connect();

    set({ socket: socketT });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (socket?.connected) socket.disconnect();
  },
}));
