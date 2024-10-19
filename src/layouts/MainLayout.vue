<script setup>
import { useAuthenticationStore } from "stores/authentication";
import { usePageHeader } from "stores/pageHeader";
import PageHeader from "components/PageHeader.vue";

const storePageHeader = usePageHeader();
const storeAuthentication = useAuthenticationStore();

const employeeMenuList = [
  {
    icon: "dashboard",
    label: "Dashboard",
    separator: true,
    link: "/employee/dashboard",
  },
  {
    icon: "account_circle",
    label: "Profile",
    separator: false,
    link: "/employee/profile",
  },
  {
    icon: "assignment_ind",
    label: "Attendance",
    separator: true,
    link: "/employee/attendance",
  },
  {
    icon: "fa-solid fa-file-invoice-dollar",
    label: "Payslip",
    separator: false,
    link: "/employee/payslip",
  },
  {
    icon: "mdi-account-credit-card",
    label: "Loan",
    separator: false,
    link: "/employee/loan",
  },
  {
    icon: "mdi-table-account",
    label: "Deduction Ledger",
    separator: false,
    link: "/employee/deductionLedger",
  },
  {
    icon: "fa-solid fa-file-invoice",
    label: "Voucher",
    separator: true,
    link: "/employee/invoice",
  },
  {
    icon: "fa-solid fa-note-sticky",
    label: "Request To Admin",
    separator: true,
    link: "/employee/requestToAdmin",
  },
  {
    icon: "support",
    label: "Support",
    separator: false,
    link: "/employee/support",
  },
];

const adminMenuList = [
  {
    icon: "dashboard",
    label: "Dashboard",
    separator: true,
    link: "/admin/dashboard",
  },
  {
    icon: "mdi-account-group",
    label: "Employee List",
    separator: true,
    link: "/admin/employeeList",
  },
  {
    icon: "mdi-account-cash",
    label: "Payroll Sheet",
    separator: false,
    link: "/admin/payrollSheet",
  },
  {
    icon: "mdi-account-credit-card",
    label: "Loan",
    separator: false,
    link: "/admin/loanList",
  },
  {
    icon: "fa-solid fa-file-invoice",
    label: "Voucher List",
    separator: true,
    link: "/admin/voucherList",
  },
  {
    icon: "checklist",
    label: "Approval",
    separator: false,
    link: "/admin/approvalList",
  },
  {
    icon: "mdi-chart-pie",
    label: "Reports",
    separator: true,
    link: "/admin/reports",
  },
  {
    icon: "settings",
    label: "Settings",
    separator: false,
    link: "/admin/settings",
  },
  {
    icon: "support",
    label: "Support",
    separator: false,
    link: "/admin/support",
  },
];
</script>

<template>
  <q-dialog v-model="logout" persistent>
    <q-card>
      <q-card-section class="row">
        <span class="tw-px-6">Are you sure you want to Log Out?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Yes"
          color="primary"
          v-close-popup
          @click="storeAuthentication.logoutUser()"
        />
        <q-btn flat label="No" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-layout view="lHh Lpr fFf">
    <page-header />
    <q-drawer
      v-model="storePageHeader.drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      elevated
      class="tw-bg-gray-100"
    >
      <q-scroll-area
        style="height: calc(100% - 180px); margin-top: 180px; margin-right: 8px"
      >
        <q-list padding>
          <div v-if="storeAuthentication.loginOption == 'employee'">
            <template
              v-for="(employeeMenuItem, index) in employeeMenuList"
              :key="index"
            >
              <q-item
                clickable
                :to="employeeMenuItem.link"
                active-class="bg-secondary"
                v-ripple
                class="tw-border tw-border-solid tw-rounded-r-full tw-mb-1"
              >
                <q-item-section avatar>
                  <q-icon :name="employeeMenuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ employeeMenuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator
                :key="'sep' + index"
                v-if="employeeMenuItem.separator"
                spaced="12px"
                style="width: 7rem"
              />
            </template>
          </div>
          <div v-else-if="storeAuthentication.loginOption == 'admin'">
            <template
              v-for="(adminMenuItem, index) in adminMenuList"
              :key="index"
            >
              <q-item
                clickable
                :to="adminMenuItem.link"
                active-class="bg-secondary"
                v-ripple
                class="tw-border tw-border-solid tw-rounded-r-full tw-mb-1"
              >
                <q-item-section avatar>
                  <q-icon :name="adminMenuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ adminMenuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator
                :key="'sep' + index"
                v-if="adminMenuItem.separator"
                spaced="12px"
                style="width: 7rem"
              />
            </template>
            <q-item></q-item>
          </div>
          <q-item
            clickable
            class="fixed-bottom tw-bg-gray-100"
            @click="storeAuthentication.logout"
            :disable="storeAuthentication.logoutLoading"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section> Log-out </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div
        class="absolute-top q-ml-xs"
        style="
          /* display: flex; */
          justify-content: center;
          align-items: center;
          height: 150px;
        "
      >
        <router-link class="no-decoration" to="dashboard">
          <img
            class="tw-size-28 tw-mx-auto tw-mt-3"
            src="./../assets/logo.png"
          />
        </router-link>
        <div class="q-ma-xs" style="text-align: center">
          A1 Agro Fertilizer and Chemical Supply
        </div>
      </div>
    </q-drawer>

    <div class="q-pa-lg tw-mt-10">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>

    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
      ><div>
        <q-btn fab icon="arrow_upward" color="accent" />
        <q-tooltip class="text-body2 tw-text-nowrap"> Back to Top </q-tooltip>
      </div>
    </q-page-scroller>
  </q-layout>
</template>

<style></style>
