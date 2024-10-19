import { useAuthenticationStore } from "src/stores/authentication";

const routes = [
  {
    path: "/",
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/admin/AdminDashboardPage.vue"),
      },
      {
        path: "employeeList",
        component: () => import("pages/admin/AdminEmployeeListPage.vue"),
      },
      {
        path: "payrollSheet",
        component: () => import("pages/admin/AdminPayrollPage.vue"),
      },
      {
        path: "loanList",
        component: () => import("pages/admin/AdminLoanListPage.vue"),
      },
      {
        path: "voucherList",
        component: () => import("pages/admin/AdminVoucherListPage.vue"),
      },
      {
        path: "approvalList",
        component: () => import("pages/admin/AdminApprovalListPage.vue"),
      },
      {
        path: "reports",
        component: () => import("pages/admin/AdminReportsPage.vue"),
      },
      {
        path: "settings",
        component: () => import("pages/admin/AdminSettingsPage.vue"),
      },
      {
        path: "support",
        component: () => import("pages/SupportPage.vue"),
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
  {
    path: "/employee",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "profile",
        component: () => import("pages/employee/EmployeeProfilePage.vue"),
      },
      {
        path: "support",
        component: () => import("pages/SupportPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
