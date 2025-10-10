import { UserDTO } from "../api/types";

let cachedUserProfile: UserDTO | null = null;

export const userProfileCache = {
  get: (): UserDTO | null => {
    return cachedUserProfile;
  },
  set: (userProfile: UserDTO | null): void => {
    cachedUserProfile = userProfile;
  },
  clear: (): void => {
    cachedUserProfile = null;
  },
};
