import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient.js";
import { ref } from "vue";

export const usePageHeader = defineStore("pageHeader", {
  state: () => ({
    drawer: ref(false),
    profilePicture: ref(null),
    currentPage: ref(null),
  }),

  getters: {
    getDrawer(state) {
      return state.drawer;
    },
  },

  actions: {
    toggeDrawer() {
      this.drawer = !this.drawer;
    },
    async getProfilePicture() {
      try {
        const { data, error } = await supabase.storage
          .from("users")
          .createSignedUrl(
            "c9e5eeaf-913c-48d2-9f0b-109ae109ac83/profile_image.png", //TODO: .createSignedUrl(id + "/profile-image.png", 60);
            60
          );
        if (error) {
          throw error;
        } else {
          console.log(data.signedUrl);
          this.profilePicture = data.signedUrl;
        }
      } catch (error) {
        // console.log("Error getting profile picture:", error.message);
        this.getDefaultProfile();
      }
    },
    getDefaultProfile() {
      this.profilePicture =
        "https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/public/public-bucket/default-profile-image/avatar.png";
    },
  },
});
