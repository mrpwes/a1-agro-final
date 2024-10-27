<script setup>
import { usePageHeader } from "stores/pageHeader";
import GovernmentTable from "components/employee/PageLoan/GovernmentLoan/GovernmentTable.vue";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Loan List";
</script>

<template>
  <div>
    <GovernmentTable></GovernmentTable>
  </div>
</template>

<style scoped></style>
