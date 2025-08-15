// src/config/api.ts
import { Platform } from "react-native";

// During dev on a PHYSICAL iPhone, this must be your computer's LAN IP.
const DEV_LAN = "http://192.168.1.83:4000"; // <-- change to your IP

// iOS Simulator can use localhost; physical device needs your LAN IP.
export const API_BASE_URL =
  Platform.OS === "ios" || Platform.OS === "android"
    ? DEV_LAN
    : "http://127.0.0.1:4000"; // for web/simulator
