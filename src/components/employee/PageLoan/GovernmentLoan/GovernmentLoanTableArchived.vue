<script setup>
import { ref } from "vue";
import { useGovernmentLoan } from "stores/employee/loanPage/governmentLoan/governmentLoan";
import ViewLoanButton from "./ViewLoanButton.vue";

const filter = ref("");
const archivedGovernmentLoan = ref(false);

const governmentLoanStore = useGovernmentLoan();
</script>

<template>
  <q-btn
    icon="mdi-archive"
    label="Archived Gov't Loan"
    @click="archivedGovernmentLoan = true"
    class="tw-bg-white"
  />

  <q-dialog v-model="archivedGovernmentLoan" persistent>
    <div class="!tw-h-min !tw-w-9/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-table
        class="my-sticky-header-table tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        title="Archived Government Loan"
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :columns="governmentLoanStore.columns"
        :rows="governmentLoanStore.getArchivedLoans"
        :rows-per-page-options="[10, 20, 0]"
        :filter="filter"
        row-key="Loan ID"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td key="actions" class="tw-w-2/12" :props="props"
            ><ViewLoanButton :rows="props.row"></ViewLoanButton
          ></q-td>
        </template>
      </q-table>
      <div class="tw-flex tw-justify-end tw-pt-6">
        <q-btn flat label="CLOSE" class="tw-bg-green-400" v-close-popup />
      </div>
    </div>
  </q-dialog>
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
