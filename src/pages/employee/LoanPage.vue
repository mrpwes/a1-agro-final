<script setup>
import { usePageHeader } from "stores/pageHeader";
import GovernmentTable from "components/employee/PageLoan/GovernmentTable.vue";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Loan List";
</script>

<template>
  <div>
    <h1>TESTING</h1>
    <GovernmentTable></GovernmentTable>
  </div>
</template>

<style scoped></style>
