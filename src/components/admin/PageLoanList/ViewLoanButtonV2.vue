<script setup>
import { ref } from "vue";
import { useViewLoan } from "stores/admin/loanListPage/viewLoan";

const storeViewLoan = useViewLoan();

defineProps(["rows"]);

const viewPrompt = ref(false);

function openmodel(row) {
  storeViewLoan.employeeOption = (row && row.request_employee_id) || null;
  storeViewLoan.type = (row && row.request_type_id) || null;
  storeViewLoan.subject = (row && row.request_subject) || null;
  storeViewLoan.description = (row && row.request_description) || null;

  storeViewLoan.amount =
    row && row.vale && row.vale[0] && Object.keys(row.vale[0]).length > 0
      ? row.vale[0].amount
      : row.partial_to_ar[0].amount || null;

  storeViewLoan.balance =
    row && row.vale && row.vale[0] && Object.keys(row.vale[0]).length > 0
      ? row.vale[0].balance
      : row.partial_to_ar[0].balance || null;

  storeViewLoan.vale = row && row.vale && row.vale[0] ? row.vale : null;
  storeViewLoan.partial_to_ar =
    row && row.partial_to_ar && row.partial_to_ar[0] ? row.partial_to_ar : null;
}
</script>

<template>
  <q-btn
    style="flex-wrap: nowrap !important"
    icon="visibility"
    label="VIEW"
    @click="
      openmodel(rows);
      viewPrompt = true;
    "
  />
  <q-dialog v-model="viewPrompt" persistent>
    <q-card class="min-width: 500px">
      <q-form @submit.prevent="storeViewLoan.insertPayment()" autofocus>
        <div class="tw-m-4">
          <q-card-section class="tw-pt-0 tw-pl-0">
            <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
              V2 View Loan Form
            </div>
          </q-card-section>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Employee Name:</div>
            <div class="tw-my-auto">
              <div>
                <q-select
                  rounded
                  standout="bg-teal text-white"
                  v-model="storeViewLoan.employeeOption"
                  disable
                  use-input
                  hide-selected
                  fill-input
                  hide-bottom-space
                  input-debounce="0"
                  :options="storeViewLoan.employeeOptions"
                  :option-label="
                    (opt) =>
                      'first_name' in opt
                        ? opt.company_employee_id +
                          ' - ' +
                          opt.last_name +
                          ' ' +
                          opt.first_name
                        : ''
                  "
                  @filter="filterFn"
                  required
                  :option-value="id"
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
            </div>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Type:</div>
            <q-select
              rounded
              standout="bg-teal text-white"
              v-model="storeViewLoan.type"
              disable
              required
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="storeViewLoan.typeOptions"
              option-label="request_type_name"
              class="!tw-pb-0; tw-capitalize;"
              popup-content-class="tw-capitalize"
              emit-value
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
            <div class="tw-content-center tw-mr-3">Subject:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeViewLoan.subject"
                required
                autogrow
                hide-bottom-space
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div>
            <div>Description:</div>
            <div class="tw-pb-3 tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeViewLoan.description"
                disable
                required
                type="textarea"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Total Amount:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                type="number"
                v-model="storeViewLoan.amount"
                disable
                required
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Balance:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                type="number"
                v-model="storeViewLoan.balance"
                disable
                required
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Payment:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                type="number"
                v-model="storeViewLoan.payment"
                :readonly="!storeViewLoan.is_paying"
                :rules="[
                  (val) =>
                    val <= storeViewLoan.balance ||
                    'Payment cannot be greater than balance',
                ]"
                required
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div v-if="storeViewLoan.expectedNewBalance" class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3 tw-text-gray-500">
              Expected New Balance:
            </div>
            <div class="tw-px-2">
              <p class="tw-max-w-full bg-teal tw-text-white tw-rounded tw-p-2">
                {{ storeViewLoan.expectedNewBalance }}
              </p>
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="text-primary noPrint">
          <q-btn
            v-if="storeViewLoan.is_paying === false"
            label="Payment"
            class="tw-bg-green-400"
            :disable="storeViewLoan.is_paying"
            @click="storeViewLoan.is_paying = true"
          />
          <q-btn
            v-else
            label="Save"
            class="tw-bg-green-400"
            v-close-popup
            type="submit"
          />
          <q-btn
            flat
            label="CLOSE"
            v-close-popup
            @click="
              storeViewLoan.is_paying = false;
              storeViewLoan.resetForm();
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style>
td {
  padding: 5px;
}
</style>
