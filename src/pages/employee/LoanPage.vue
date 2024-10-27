<script setup>
import { usePageHeader } from "stores/pageHeader";
import GovernmentTable from "components/employee/PageLoan/GovernmentLoan/GovernmentTable.vue";
import AdminLoanListPage from "components/employee/PageLoan/CompanyLoan/AdminLoanListPage.vue";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Loan List";
</script>

<template>
  <div>
    <AdminLoanListPage></AdminLoanListPage>
    <GovernmentTable></GovernmentTable>
  </div>
</template>

<style scoped></style>
