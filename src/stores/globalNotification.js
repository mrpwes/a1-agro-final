import { defineStore } from "pinia";
import { Notify } from "quasar";
import { useQuasar } from "quasar";

export const useGlobalNotificationStore = defineStore("globalNotification", {
  state: () => ({
    is_loading: false,
  }),
  actions: {
    showSuccessNotification(message) {
      Notify.create({
        message: message,
        color: "positive",
        position: "bottom",
        timeout: 3200,
      });
    },
    showErrorNotification(message) {
      Notify.create({
        message: message,
        color: "negative",
        position: "bottom",
        timeout: 3200,
      });
    },

    toggleLoading() {
      const $q = useQuasar();
      this.is_loading = !this.is_loading;

      if (this.is_loading) {
        $q.loading.show({
          message: "Some important process is in progress. Hang on...",
        });
      } else {
        $q.loading.hide();
      }
    },
  },
  getters: {},
});
