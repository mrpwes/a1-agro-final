<script setup>
import { date } from "quasar";
import { ref } from "vue";
import { useViewApprovalStore } from "src/stores/admin/approvalListPage/viewApproval";
import viewApprovalButton from "components/admin/PageApprovalList/ViewApprovalButton.vue";

const storeViewApprovalStore = useViewApprovalStore();

const archivedEmployee = ref(false);

const tableSearch = ref("");
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
  <q-btn
    icon="mdi-archive"
    label="Archived Request"
    @click="archivedEmployee = true"
    class="tw-bg-white"
  />

  <q-dialog v-model="archivedEmployee" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
        Archived Approval
      </div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        :filter="tableSearch"
        :columns="columns"
        :rows="storeViewApprovalStore.getArchivedApprovalList"
        :rows-per-page-options="[10, 20, 0]"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div>
              <viewApprovalButton :rows="props.row"></viewApprovalButton>
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
