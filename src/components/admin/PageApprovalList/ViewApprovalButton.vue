<script setup>
import { date } from "quasar";
import { ref } from "vue";
import { useViewApprovalStore } from "src/stores/admin/approvalListPage/viewApproval";

const storeViewApproval = useViewApprovalStore();

defineProps(["rows"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
}
</script>
<template>
  <q-btn icon="visibility" label="View" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt">
    <div class="!tw-h-min !tw-w-4/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-grid tw-grid-cols-3 tw-gap-5 tw-pb-5">
        <div>Request ID: {{ selectedRow.id }}</div>
        <div>
          Name: {{ selectedRow.request_type_id.first_name }}
          {{ selectedRow.request_type_id.last_name }}
        </div>
        <div>
          Application Date:
          {{ selectedRow.request_application_date }}
        </div>
        <div class="tw-col-span-3">Subject:</div>
        <div class="tw-col-span-3">
          <q-input
            :dense="dense"
            v-model="selectedRow.subject"
            disable
            autogrow
            filled
            hide-bottom-space
          />
        </div>
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
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
