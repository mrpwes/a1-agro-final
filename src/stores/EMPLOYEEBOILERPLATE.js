import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";

const storeAuthentication = useAuthenticationStore();

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({}),
  getters: {},
  actions: {},
});
