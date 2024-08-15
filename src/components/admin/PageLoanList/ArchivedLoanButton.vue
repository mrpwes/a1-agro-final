<script setup>
import { ref } from "vue";
import ViewLoanButton from "components/admin/PageLoanList/ViewLoanButton.vue";
import { useViewLoan } from "stores/admin/loanListPage/viewLoan";

const storeViewLoan = useViewLoan();

const archivedEmployee = ref(false);

const tableSearch = ref("");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    field: (row) =>
      (row.request_type.request_type_name === "VALE"
        ? row.vale[0].id
        : row.partial_to_ar[0].id) +
      " - " +
      row.request_type.request_type_name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Description",
    align: "center",
    label: "Description",
    field: "description",
    sortable: true,
  },
  {
    name: "Recipient",
    align: "center",
    label: "Recipient",
    field: (row) => row.employee.first_name + " " + row.employee.last_name,
    sortable: true,
  },
  {
    name: "Issuer",
    align: "center",
    label: "Issuer",
    field: (row) =>
      row.request_confirmation.employee.first_name +
      " " +
      row.request_confirmation.employee.last_name,
    sortable: true,
  },
  {
    name: "Amount",
    align: "center",
    label: "Amount",
    field: (row) =>
      "₱" +
      (row.request_type.request_type_name === "VALE"
        ? numberWithCommas(row.vale[0].amount)
        : numberWithCommas(row.partial_to_ar[0].amount)),
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
        :filter="tableSearch"
        :columns="columns"
        :rows="storeViewLoan.getArchivedLoanList"
        :rows-per-page-options="[10, 20, 0]"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div>
              <ViewLoanButton :rows="props.row"></ViewLoanButton>
            </div>
          </q-td>
        </template>
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
      </q-table>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
