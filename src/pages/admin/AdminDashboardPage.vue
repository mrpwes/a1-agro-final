<script setup>
import { ref } from "vue";
import { usePageHeader } from "stores/pageHeader";
import { useApprovalListStore } from "src/stores/admin/approvalList";
import { useDashboardStore } from "src/stores/admin/dashboard";

const storeDashboard = useDashboardStore();
storeDashboard.fetchTotalEmployees();

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Dashboard";

const storeApprovalList = useApprovalListStore();

const tableSearch = ref("");

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
}

const columns = [
  {
    name: "Reference Id",
    required: true,
    label: "Reference Id",
    align: "left",
    field: (row) => row.referenceId,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Employee Name",
    align: "center",
    label: "Employee Name",
    field: "employeeName",
    sortable: true,
  },
  {
    name: "Description",
    align: "center",
    label: "Description",
    field: "description",
    format: (val) => (val.length > 30 ? `${val.slice(0, 30)}...` : val),
    sortable: true,
  },
  {
    name: "Request Date",
    align: "center",
    label: "Request Date",
    field: "requestDate",
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "",
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
    <div class="tw-w-11/12 tw-mx-auto tw-flex tw-justify-end tw-mb-5"></div>
    <q-table
      class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
      flat
      bordered
      title="TODO Approval List"
      title-class=" tw-font-bold"
      :filter="tableSearch"
      :columns="columns"
      :rows="storeApprovalList.getApprovedIsNull"
      :rows-per-page-options="[10, 20, 0]"
      row-key="name"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="visibility" label="View" @click="openmodel(props.row)" />
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
        </q-input> </template
    ></q-table>
    <q-dialog v-model="viewPrompt">
      <div class="!tw-h-min !tw-w-4/12 !tw-max-w-full tw-bg-white tw-p-6">
        <div class="tw-grid tw-grid-cols-3 tw-gap-5 tw-pb-5">
          <div>Reference ID: {{ selectedRow.referenceId }}</div>
          <div>Name: {{ selectedRow.employeeName }}</div>
          <div>Request Date: {{ selectedRow.requestDate }}</div>
          <div class="tw-col-span-3">Description:</div>
          <div class="tw-col-span-3">
            <q-input
              :dense="dense"
              v-model="selectedRow.description"
              disable
              autogrow
              filled
              hide-bottom-space
            />
          </div>
          <div class="tw-col-span-3">Remarks:</div>
          <div class="tw-col-span-3 !tw-h-2/6">
            <q-input v-model="text" filled autogrow />
          </div>
        </div>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            class="tw-bg-red-500"
            icon="mdi-close"
            label="Disapprove"
            @click="selectedRow.isApproved = false"
            v-close-popup
          />
          <q-btn
            flat
            class="tw-bg-green-400"
            icon="mdi-check-bold"
            label="Approve"
            @click="selectedRow.isApproved = true"
            v-close-popup
          />
        </q-card-actions>
      </div>
    </q-dialog>
  </div>
</template>
