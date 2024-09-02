<script setup>
import { usePageHeader } from "stores/pageHeader";
// import { usePayrollTableStore } from "stores/admin/payrollSheetPage/payrollTable";
import PayrollTable from "components/admin/PagePayrollSheet/PayrollSheetTable.vue";

// const payrollTableStore = usePayrollTableStore();

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Payroll Sheet";
</script>
<template>
  <div
    class="tw-w-12/12 tw-max-w-full tw-mx-auto tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse tw-p-4 tw-mt-0"
  >
    <div>
      <PayrollTable></PayrollTable>
      &nbsp;
      <!-- <LoanTable></LoanTable> -->
    </div>
  </div>
</template>
