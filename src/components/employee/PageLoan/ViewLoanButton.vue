<script setup>
import { ref } from "vue";
import { useGovtViewLoanStore } from "stores/employee/loanPage/governmentLoan/viewLoan";

const govtViewLoanStore = useGovtViewLoanStore();

defineProps(["rows"]);

const viewPrompt = ref(false);

// https://vuejs.org/guide/components/props.html#one-way-data-flow

function openmodel(rows) {
  govtViewLoanStore.selected_row = JSON.parse(JSON.stringify(rows));
  govtViewLoanStore.id = (rows && rows.id) || null;
  govtViewLoanStore.application_no = (rows && rows.application_no) || null;
  govtViewLoanStore.employeeOption = (rows && rows.employee) || null;
  govtViewLoanStore.type = (rows && rows.government_loan_type) || null;
  govtViewLoanStore.date_start = (rows && rows.date_start) || null;
  govtViewLoanStore.date_end = (rows && rows.date_end) || null;
  govtViewLoanStore.half_month_indicator =
    (rows && rows.half_month_indicator === "2nd Half"
      ? "2nd Half"
      : "1st Half") || null;

  govtViewLoanStore.additional_info = (rows && rows.additional_info) || null;
  govtViewLoanStore.amortization = (rows && rows.amortization) || null;
  govtViewLoanStore.total_amount = (rows && rows.total_amount) || null;
  govtViewLoanStore.is_archive = (rows && rows.is_archive) || null;

  viewPrompt.value = true;
}

govtViewLoanStore.fetchEmployeeOptions();
govtViewLoanStore.fetchGovernmentLoanType();
</script>

<template>
  <q-btn
    style="flex-wrap: nowrap !important"
    icon="visibility"
    label="VIEW"
    @click="openmodel(rows)"
  />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-form @submit.prevent="govtViewLoanStore.updateLoan()">
        <div class="tw-grid tw-gap-3">
          <div id="section-to-print"></div>
          <div class="tw-text-3xl tw-font-extrabold">
            View Loan ID: {{ govtViewLoanStore.id }}
          </div>
          <div class="tw-text-2xl tw-flex tw-justify-between tw">
            <div>
              <q-input
                rounded
                standout="bg-teal text-white"
                label="Application No."
                v-model="govtViewLoanStore.application_no"
                disable
                input-class="tw-text-1xl "
                autogrow
                type="text"
                required
              >
                <template v-slot:label
                  ><span class="tw-font-bold">Application No.</span></template
                >
              </q-input>
            </div>
            <div class="tw-my-auto">
              <div>
                <q-select
                  rounded
                  standout="bg-teal text-white"
                  v-model="govtViewLoanStore.employeeOption"
                  disable
                  label="Employee"
                  use-input
                  hide-selected
                  fill-input
                  hide-bottom-space
                  input-debounce="0"
                  :options="govtViewLoanStore.employeeOptions"
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
          <div class="tw-w-64">
            <q-select
              rounded
              standout="bg-teal text-white"
              v-model="govtViewLoanStore.type"
              :readonly="!govtViewLoanStore.is_editing"
              label="Loan Type"
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="govtViewLoanStore.typeOptions"
              option-label="government_loan_type_name"
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
          <div class="tw-flex tw-justify-between">
            <div>
              <div class="tw-w-52">
                <q-input
                  rounded
                  standout="bg-teal text-white"
                  v-model="govtViewLoanStore.date_start"
                  :readonly="!govtViewLoanStore.is_editing"
                  required
                  label="Date Start"
                  type="date"
                  hide-bottom-space
                />
              </div>
            </div>
            <div>
              <div class="tw-w-52">
                <q-input
                  rounded
                  standout="bg-teal text-white"
                  v-model="govtViewLoanStore.date_end"
                  :readonly="!govtViewLoanStore.is_editing"
                  required
                  label="Date Start"
                  type="date"
                  hide-bottom-space
                />
              </div>
            </div>

            <div class="tw-w-44">
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="govtViewLoanStore.half_month_indicator"
                :readonly="!govtViewLoanStore.is_editing"
                required
                label="Monthly Schedule"
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                hide-bottom-space
              />
            </div>
          </div>
          <div>
            Additional Information:
            <span class="tw-text-gray-500">(Optional)</span>
            <div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="govtViewLoanStore.additional_info"
                :readonly="!govtViewLoanStore.is_editing"
                type="textarea"
              />
            </div>
          </div>
          <div class="tw-flex tw-justify-around">
            <div class="tw-flex tw-align-middle">
              <div class="tw-my-auto">Amortization:</div>
              <div class="tw-w-2"></div>
              <div class="tw-w-32">
                <q-input
                  rounded
                  standout="bg-teal text-white"
                  v-model="govtViewLoanStore.amortization"
                  :readonly="!govtViewLoanStore.is_editing"
                  type="number"
                  required
                />
              </div>
            </div>
            <div class="tw-flex tw-align-middle">
              <div class="tw-my-auto">Total Amount:</div>
              <div class="tw-w-2"></div>
              <div class="tw-w-32">
                <q-input
                  rounded
                  standout="bg-teal text-white"
                  v-model="govtViewLoanStore.total_amount"
                  :readonly="!govtViewLoanStore.is_editing"
                  type="number"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="text-primary noPrint">
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
