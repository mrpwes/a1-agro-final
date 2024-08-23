import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import SecureLS from "secure-ls";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  pinia.use(
    createPersistedState({
      storage: {
        getItem: (key) => {
          return new SecureLS({ isCompression: false }).get(key);
        },
        setItem: (key, value) => {
          new SecureLS({ isCompression: false }).set(key, value);
        },
      },
    })
  );
  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
