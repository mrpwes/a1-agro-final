<script setup>
import { ref } from "vue";

defineProps(["rows"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;

  selectedRow.value.issuer_name =
    row.issuer.company_employee_id +
    " - " +
    row.issuer.last_name +
    ", " +
    row.issuer.first_name +
    " " +
    row.issuer.middle_name;

  selectedRow.value.recipient_name =
    row.issuer.company_employee_id +
    " - " +
    row.recipient.last_name +
    ", " +
    row.recipient.first_name +
    " " +
    row.recipient.middle_name;
}

//FIXME: CONTACT NUMBER ADD MORE
</script>

<template>
  <q-btn
    style="flex-wrap: nowrap !important"
    icon="visibility"
    label="VIEW"
    @click="openmodel(rows)"
  />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-4/12 !tw-max-w-full tw-bg-white tw-p-6 tw-pb-3">
      <q-form autofocus>
        <div class="tw-grid tw-gap-3">
          <div class="tw-text-3xl tw-font-extrabold">Add Voucher</div>
          <div class="tw-flex tw-justify-between">
            <div>
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="selectedRow.recipient_name"
                label="Recipient"
                readonly
                autogrow
              />
            </div>
            <div>
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="selectedRow.issuer_name"
                label="Issuer"
                readonly
                autogrow
              />
            </div>
          </div>
          <div class="tw-flex">
            <div class="tw-my-auto">Subject:</div>
            <div class="tw-w-2"></div>
            <div class="tw-w-36">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="selectedRow.subject"
                readonly
                autogrow
                type="text"
                required
              />
            </div>
          </div>
          <div>
            Description:
            <span class="tw-text-gray-500">(Optional)</span>
            <q-input
              rounded
              standout="bg-teal text-white"
              v-model="selectedRow.description"
              readonly
              autogrow
              type="text"
            />
          </div>

          <div class="tw-flex tw-justify-between">
            <div class="tw-flex">
              <div class="tw-my-auto">Date Issued:</div>
              <div class="tw-w-2"></div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="selectedRow.date_issued"
                aria-required=""
                type="date"
                hide-bottom-space
                readonly
              />
            </div>
            <div class="tw-flex">
              <div class="tw-my-auto">Amount:</div>
              <div class="tw-w-2"></div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="selectedRow.amount"
                readonly
                :dense="dense"
                hide-bottom-space
                type="number"
                required
              />
            </div>
          </div>
        </div>
        <q-card-actions align="right">
          <q-btn flat label="CLOSE" v-close-popup />
        </q-card-actions>
      </q-form>
    </div>
  </q-dialog>
</template>

<style>
td {
  padding: 5px;
}
</style>
