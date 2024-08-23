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
          Name: {{ selectedRow.recipient.first_name }}
          {{ selectedRow.recipient.last_name }}
        </div>
        <div>
          Application Date:
          {{
            date.formatDate(
              selectedRow.request_confirmation.application_date,
              "MMM D, YYYY"
            )
          }}
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
        <div class="tw-col-span-3">Remarks:</div>
        <div class="tw-col-span-3 !tw-h-2/6">
          <q-input
            v-model="selectedRow.remarks"
            filled
            autogrow
            :disable="selectedRow.isArchive ? true : false"
            :readonly="selectedRow.isArchive ? true : false"
          />
        </div>
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          v-if="selectedRow.request_confirmation.status == 'Pending'"
          flat
          class="tw-bg-red-500"
          icon="mdi-close"
          label="Disapprove"
          @click="
            storeViewApproval.requestConfirmationStatus(
              selectedRow.request_confirmation.id,
              'Disapproved'
            )
          "
          v-close-popup
        />
        <q-btn
          v-if="selectedRow.request_confirmation.status == 'Pending'"
          flat
          class="tw-bg-green-400"
          icon="mdi-check-bold"
          label="Approve"
          @click="
            storeViewApproval.requestConfirmationStatus(
              selectedRow.request_confirmation.id,
              'Approved'
            )
          "
          v-close-popup
        />
        <q-btn
          flat
          :class="selectedRow.is_archive ? 'tw-bg-green-400' : 'tw-bg-red-400'"
          icon="mdi-archive"
          :label="selectedRow.is_archive ? 'Unarchive' : 'Archive'"
          @click="
            storeViewApproval.archivedRequest(
              selectedRow.id,
              selectedRow.is_archive
            )
          "
          v-close-popup
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
