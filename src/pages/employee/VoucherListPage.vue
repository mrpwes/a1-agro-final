<script setup>
import { date } from "quasar";
import { ref } from "vue";
import { usePageHeader } from "stores/pageHeader";

import ViewVoucherButton from "components/employee/PageVoucherList/ViewVoucherButton.vue";
import ArchivedVoucherButton from "components/employee/PageVoucherList/ArchivedVoucherButton.vue";

import { useViewVoucherStore } from "stores/employee/voucherListPage/viewVoucher";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Voucher List";
const tableSearch = ref("");
const storeViewVoucher = useViewVoucherStore();
storeViewVoucher.fetchListOfVouchers();

const columns = [
  {
    name: "id",
    required: true,
    label: "Voucher Id",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "subject",
    align: "center",
    label: "Subject",
    field: "subject",
    sortable: true,
  },
  {
    name: "Date",
    align: "center",
    label: "Date",
    field: (row) => row.date_issued,
    format: (val) => date.formatDate(val, "MMM D, YYYY"),
    sortable: true,
  },

  {
    name: "Recipient",
    align: "center",
    label: "Recipient",
    field: (row) => row.recipient.last_name + " " + row.recipient.first_name,
    sortable: true,
  },
  {
    name: "Issuer",
    align: "center",
    label: "Issuer",
    field: (row) => row.issuer.last_name + " " + row.issuer.first_name,
    sortable: true,
  },
  {
    name: "Amount",
    align: "center",
    label: "Amount",
    field: "amount",
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
    <ArchivedVoucherButton></ArchivedVoucherButton>
  </div>
  <q-table
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
    flat
    bordered
    :filter="tableSearch"
    :columns="columns"
    :rows="storeViewVoucher.getActive"
    :rows-per-page-options="[10, 20, 0]"
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td key="actions" class="tw-w-2/12" :props="props"
        ><ViewVoucherButton :rows="props.row"></ViewVoucherButton
      ></q-td>
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
      </q-input> </template
  ></q-table>
</template>

<style scoped></style>
