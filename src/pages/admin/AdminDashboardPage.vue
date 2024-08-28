<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { usePageHeader } from "stores/pageHeader";
import { useDashboardStore } from "src/stores/admin/dashboard";
import ViewApprovalButton from "components/admin/PageApprovalList/ViewApprovalButton.vue";
import { useViewApprovalStore } from "stores/admin/approvalListPage/viewApproval";

const storeDashboard = useDashboardStore();
storeDashboard.fetchTotalEmployees();

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Dashboard";

const tableSearch = ref("");

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
  <div class="tw-flex tw-justify-evenly tw-w-8/12 tw-mx-auto tw-mb-6">
    <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-center">
      <div class="tw-bg-white tw-rounded-3xl tw-shadow-md tw-p-10">
        <div class="tw-text-xl tw-font-bold">Employees</div>
        <div class="tw-text-lg">{{ storeDashboard.getTotalEmployees }}</div>
      </div>
      <div class="tw-bg-white tw-rounded-3xl tw-shadow-md tw-p-10">
        <div class="tw-text-xl tw-font-bold">Present</div>
        <div class="tw-text-lg">TODO</div>
      </div>
      <div class="tw-bg-white tw-rounded-3xl tw-shadow-md tw-p-10">
        <div class="tw-text-xl tw-font-bold">Absent</div>
        <div class="tw-text-lg">TODO</div>
      </div>
      <div class="tw-bg-white tw-rounded-3xl tw-shadow-md tw-p-10">
        <div class="tw-text-xl tw-font-bold">Late</div>
        <div class="tw-text-lg">TODO</div>
      </div>
    </div>
    <div>
      <div class="tw-bg-white tw-rounded-3xl tw-shadow-md tw-p-10">
        <div class="tw-text-center">
          <div class="tw-text-xl tw-font-bold">Birthday</div>
          <div class="tw-text-lg tw-pb-3">January TODO</div>
        </div>
        <div
          class="tw-grid tw-grid-cols-2 tw-gap-7 tw-justify-between tw-text-end"
        >
          <div class="tw-text-nowrap tw-text-left">TODO</div>
          <div>TODO</div>
        </div>
        <div
          class="tw-grid tw-grid-cols-2 tw-gap-7 tw-justify-between tw-text-end"
        >
          <div class="tw-text-nowrap tw-text-left">Arnieno Maraan</div>
          <div>01/30</div>
        </div>
      </div>
    </div>
  </div>
  <div class="tw-w-8/12 tw-mx-auto">
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
  </div>
</template>
