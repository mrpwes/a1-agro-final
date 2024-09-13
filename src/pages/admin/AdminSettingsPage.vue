<script setup>
import { usePageHeader } from "stores/pageHeader";
// import AttendanceTable from "components/admin/PageReports/AttendanceTable.vue";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Settings";
</script>
<template>
  <div
    class="tw-w-12/12 tw-max-w-full tw-mx-auto tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse tw-p-4 tw-mt-0"
  >
    <div>
      <!-- <AttendanceTable></AttendanceTable>
      &nbsp;
      <LoanTable></LoanTable>
      <q-btn
        icon="mdi-plus"
        label="Check Date Ranges for Current Month"
        @click="storeAttendance.getAndCheckDateRangesForCurrentMonth"
        class="tw-bg-white"
      />
      <q-btn
        icon="mdi-plus"
        label="Adjustment Salary"
        @click="storeAttendance.checkAdjustmentSalary"
        class="tw-bg-white"
      />
      <q-btn
        icon="mdi-plus"
        label="createAdjustmentSalary"
        @click="storeAttendance.createAdjustmentSalary"
        class="tw-bg-white"
      />
      <q-btn
        icon="mdi-plus"
        label="createAdjustmentSalary"
        @click="storeAttendance.processAttendance"
        class="tw-bg-white"
      /> -->
    </div>
  </div>
</template>
