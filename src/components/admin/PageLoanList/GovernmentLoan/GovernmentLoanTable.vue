<script setup>
import { useGovernmentLoan } from "src/stores/admin/loanListPage/governmentLoan/governmentLoan";
import AddLoan from "./AddLoan.vue";
import ViewLoanButton from "./ViewLoanButton.vue";

const governmentLoanStore = useGovernmentLoan();
governmentLoanStore.fetchGovernmentLoanList();
</script>

<template>
  <div class="tw-mt-6">
    <div class="tw-w-11/12 tw-mx-auto tw-flex tw-justify-end tw-mb-5 tw-gap-4">
      <AddLoan></AddLoan>
    </div>
    <div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        title="Government Loan"
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :filter="tableSearch"
        :columns="governmentLoanStore.columns"
        :rows="governmentLoanStore.rows"
        :rows-per-page-options="[10, 20, 0]"
        row-key="Loan ID"
      >
        <template v-slot:body-cell-actions="props">
          <q-td key="actions" class="tw-w-2/12" :props="props"
            ><ViewLoanButton :rows="props.row"></ViewLoanButton
          ></q-td>
        </template>
        <!-- <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="tableSearch"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> </template
      > -->
      </q-table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
th {
  background-color: #f2f2f2;
}
</style>
