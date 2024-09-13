<script setup>
import { ref } from "vue";
import { useAddApprovalStore } from "src/stores/admin/approvalListPage/addApproval";

const addApprovalStore = useAddApprovalStore();
const addVoucherDialog = ref(false);

addApprovalStore.fetchEmployeeOptions();

function filterFn(val, update) {
  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    addApprovalStore.selectorRecipientOptions =
      addApprovalStore.recipientOptions.filter(
        (v) => String(v.company_employee_id).toLowerCase().indexOf(needle) > -1
      );
  });
}
</script>

<template>
  <q-btn
    icon="mdi-plus"
    label="Add Request"
    @click="addVoucherDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="addVoucherDialog" persistent>
    <q-card class="min-width: 500px">
      <q-form @submit.prevent="addApprovalStore.insertRequestForm" autofocus>
        <div class="tw-m-4">
          <q-card-section class="tw-pt-0 tw-pl-0">
            <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
              Add Request Form
            </div>
          </q-card-section>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Employee Name:</div>
            <q-select
              filled
              v-model="addApprovalStore.recipient"
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="addApprovalStore.selectorRecipientOptions"
              :option-label="
                (opt) =>
                  'first_name' in opt
                    ? opt.company_employee_id + ' - ' + opt.last_name
                    : ''
              "
              :option-value="id"
              @filter="filterFn"
              class="!tw-pb-0; tw-capitalize"
              popup-content-class="tw-capitalize"
            >
              <!-- @filter="filterRecipient" -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Type:</div>
            <q-select
              filled
              v-model="addApprovalStore.type"
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="addApprovalStore.typeOptions"
              class="!tw-pb-0; tw-capitalize;"
              popup-content-class="tw-capitalize"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-mb-3">
            <div>Subject:</div>
            <div class="tw-pb-3 tw-px-2">
              <q-input
                v-model="addApprovalStore.subject"
                filled
                autogrow
                class="tw-max-w-full"
                lazy-rules
              />
            </div>
          </div>
          <div class="tw-mb-3">
            <div>Description:</div>
            <div class="tw-pb-3 tw-px-2">
              <q-input
                v-model="addApprovalStore.description"
                filled
                autogrow
                class="tw-max-w-full"
                lazy-rules
              />
            </div>
          </div>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              flat
              class="tw-bg-green-400"
              label="Add Loan"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
