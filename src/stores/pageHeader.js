import { defineStore } from "pinia";
import { ref } from "vue";

export const usePageHeader = defineStore("pageHeader", {
  state: () => ({
    drawer: ref(false),
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
  },
});
