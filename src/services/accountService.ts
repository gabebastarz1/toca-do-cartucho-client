import { api } from "../services/api";

class AccountService {
  async deactivateAccount(): Promise<void> {
    await api.patch("/api/auth/profile", { accountStatus: "Inactive" });
  }

  async activateAccount(): Promise<void> {
    await api.patch("/api/auth/profile", { accountStatus: "Active" });
  }
}

export const accountService = new AccountService();




