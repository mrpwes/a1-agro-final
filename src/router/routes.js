import { useAuthenticationStore } from "src/stores/authentication";

const routes = [
  {
    path: "/",
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/admin/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/admin/AdminDashboardPage.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      const storeAuthentication = useAuthenticationStore();
      if (
        storeAuthentication.getUserRole().includes("website_admin") &&
        storeAuthentication.isAuthenticated
      ) {
        next();
      } else {
        next("/");
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
