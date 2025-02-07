import { QueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export const queryClient = new QueryClient();

export const queryKeys = {
  authKey: [uuidv4()],
  usersKey: [uuidv4()],
  profilesKey: [uuidv4()],
  complimentsKey: [uuidv4()],
};

export const QUERY_KEYS = {
  authKey: ["auth"],
  usersKey: ["users"],
  profilesKey: ["profiles"],
  complimentsKey: ["compliments"],
  createProfileKey(userId: number) {
    return [...this.profilesKey, userId.toString()];
  },
  createProfileKeyWithParams(userId: number) {
    return [...this.profilesKey, userId.toString()];
  },
};

export const config = {
  server: {
    url: "http://localhost:5000/api/v1",
  },
};
