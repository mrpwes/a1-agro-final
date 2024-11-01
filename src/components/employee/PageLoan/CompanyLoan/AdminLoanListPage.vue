<script setup>
import { usePageHeader } from "stores/pageHeader";
import { ref } from "vue";

import ViewLoanButton from "./ViewLoanButtonV2.vue";
import ArchivedLoanButton from "./ArchivedLoanButton.vue";
import AddLoanButton from "./AddLoanButton.vue";

import { useViewLoan } from "stores/employee/loanPage/companyLoan/viewLoan";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Loan List";

const storeViewLoan = useViewLoan();
storeViewLoan.getLoanList();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const tableSearch = ref("");

function formatAmountBalance(row) {
  return numberWithCommas(row[0].balance + "/" + row[0].amount);
}

const columns = [
  {
    name: "Loan ID",
    required: true,
    label: "Loan ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Loan Type",
    align: "center",
    label: "Loan Type",
    field: (row) => row.request_type_id.request_type_name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "request_subject",
    align: "center",
    label: "Subject",
    field: (row) => row.request_subject,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Recipient",
    align: "center",
    label: "Recipient",
    field: (row) =>
      row.request_employee_id.company_employee_id +
      " - " +
      row.request_employee_id.first_name +
      " " +
      row.request_employee_id.last_name,
    sortable: true,
  },
  {
    name: "Issuer",
    align: "center",
    label: "Issuer",
    field: (row) =>
      row.admin_employee_id.company_employee_id +
      " - " +
      row.admin_employee_id.first_name +
      " " +
      row.admin_employee_id.last_name,
    sortable: true,
  },
  {
    name: "Amount",
    align: "center",
    label: "Balance / Total Amount",
    field: (row) =>
      row.vale[0]
        ? formatAmountBalance(row.vale)
        : formatAmountBalance(row.partial_to_ar),
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "",
    field: "",
  },
];
</script>

<template>
  <!-- TODO: Add Voucher List Page and Connect to Database -->
  <div class="tw-w-11/12 tw-mx-auto tw-flex tw-justify-end tw-mb-5 tw-gap-4">
    <ArchivedLoanButton></ArchivedLoanButton>
  </div>
  <q-table
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
    flat
    bordered
    title="Company Loan"
    :title-class="['tw-text-xl', 'tw-font-bold']"
    :filter="tableSearch"
    :columns="columns"
    :rows="storeViewLoan.getUnarchivedLoanList"
    :rows-per-page-options="[10, 20, 0]"
    row-key="Loan ID"
  >
    >
    <template v-slot:top-right>
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
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td key="actions" class="tw-w-2/12" :props="props"
        ><ViewLoanButton :rows="props.row"></ViewLoanButton
      ></q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
