<script setup>
import { date } from "quasar";
import { usePageHeader } from "stores/pageHeader";

import ViewApprovalButton from "components/admin/PageApprovalList/ViewApprovalButton.vue";
import ArchivedApprovalButton from "components/admin/PageApprovalList/ArchivedApprovalButton.vue";
import AddApprovalButton from "components/admin/PageApprovalList/AddApprovalButton.vue";

import { useViewApprovalStore } from "stores/admin/approvalListPage/viewApproval";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Approval List";

const storeViewApproval = useViewApprovalStore();

storeViewApproval.getApprovalList();
const columns = [
  {
    name: "Request ID",
    required: true,
    label: "Request ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Request Date",
    align: "center",
    label: "Request Date",
    field: (row) => row.request_confirmation.application_date,
    format: (val) => date.formatDate(val, "MMM D, YYYY"),
    sortable: true,
  },
  {
    name: "Subject",
    align: "center",
    label: "Subject",
    field: "subject",
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
    field: (row) => row.recipient.last_name + " " + row.recipient.first_name,
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
    <ArchivedApprovalButton></ArchivedApprovalButton>
    <AddApprovalButton></AddApprovalButton>
  </div>
  <q-table
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
    flat
    bordered
    :filter="tableSearch"
    :columns="columns"
    :rows="storeViewApproval.getUnarchivedApprovalList"
    :rows-per-page-options="[10, 20, 0]"
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td key="actions" class="tw-w-2/12" :props="props"
        ><ViewApprovalButton :rows="props.row"></ViewApprovalButton
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
