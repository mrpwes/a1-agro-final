<script setup>
import { ref } from "vue";
import ViewLoanButton from "components/admin/PageLoanList/ViewLoanButtonV2.vue";
import { useViewLoan } from "stores/employee/loanPage/companyLoan/viewLoan";

const storeViewLoan = useViewLoan();

const archivedEmployee = ref(false);

const tableSearch = ref("");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatAmountBalance(row) {
  return numberWithCommas(row[0].amount + "/" + row[0].balance);
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
    name: "Description",
    align: "center",
    label: "Description",
    field: (row) => row.request_description,
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
    label: "Amount",
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
  <q-btn
    icon="mdi-archive"
    label="Archived Loan"
    @click="archivedEmployee = true"
    class="tw-bg-white"
  />

  <q-dialog v-model="archivedEmployee" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
        Archived Loan
      </div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        title="Company Loan"
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :filter="tableSearch"
        :columns="columns"
        :rows="storeViewLoan.getArchivedLoanList"
        :rows-per-page-options="[10, 20, 0]"
        row-key="Loan ID"
      >
        <template v-slot:body-cell-actions="props">
          <q-td key="actions" class="tw-w-2/12" :props="props"
            ><ViewLoanButton :rows="props.row"></ViewLoanButton
          ></q-td>
        </template>
      </q-table>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
