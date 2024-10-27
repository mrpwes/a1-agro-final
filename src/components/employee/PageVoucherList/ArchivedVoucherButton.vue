<script setup>
import { ref } from "vue";
import { date } from "quasar";
import ViewVoucherButton from "components/employee/PageVoucherList/ViewVoucherButton.vue";
import { useViewVoucherStore } from "stores/employee/voucherListPage/viewVoucher";

const storeViewVoucher = useViewVoucherStore();

const archivedEmployee = ref(false);

const tableSearch = ref("");

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
  <q-btn
    icon="mdi-archive"
    label="Archived Voucher"
    @click="archivedEmployee = true"
    class="tw-bg-white"
  />

  <q-dialog v-model="archivedEmployee" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
        Archived Voucher
      </div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        :filter="tableSearch"
        :columns="columns"
        :rows="storeViewVoucher.getInactive"
        :rows-per-page-options="[10, 20, 0]"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div>
              <ViewVoucherButton :rows="props.row"></ViewVoucherButton>
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
