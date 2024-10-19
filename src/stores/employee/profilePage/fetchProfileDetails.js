import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";

const storeAuthentication = useAuthenticationStore();

export const useProfileStore = defineStore("profile", {
  state: () => ({
    currentUser: storeAuthentication.getEmployeeId,
    profileDetails: null,
    profilePicture: null,
  }),
  actions: {
    async getProfileDetails() {
      this.getCurrentProfilePicture();
      const { data, error } = await supabase
        .from("employee")
        .select("*")
        .eq("id", this.currentUser)
        .single();
      if (error) {
        console.error(error);
      } else {
        this.profileDetails = data;
      }
    },

    async getCurrentProfilePicture() {
      this.profilePicture =
        "https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/public/employee_avatar/" +
        this.currentUser +
        ".jpg";
    },
  },
});
