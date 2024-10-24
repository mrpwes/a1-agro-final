<script setup>
import { useAddGovernmentLoanStore } from "src/stores/admin/loanListPage/governmentLoan/addLoan";

const addGovernmentLoanStore = useAddGovernmentLoanStore();

// storeAddLoan.getDetails();
addGovernmentLoanStore.fetchEmployeeOptions();
addGovernmentLoanStore.fetchGovernmentLoanType();

function filterFn(val, update) {
  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    addGovernmentLoanStore.selectorEmployeeOptions =
      addGovernmentLoanStore.employeeOptions.filter(
        (v) => String(v.company_employee_id).toLowerCase().indexOf(needle) > -1
      );
  });
}
</script>

<template>
  <q-btn
    icon="mdi-plus"
    label="Add Gov't Loan"
    @click="addGovernmentLoanStore.addLoanDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="addGovernmentLoanStore.addLoanDialog" persistent>
    <div
      class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-px-6 tw-pb-3"
    >
      <q-form @submit.prevent="addGovernmentLoanStore.addLoan" autofocus>
        <div class="tw-grid tw-gap-3">
          <div id="section-to-print"></div>
          <div class="tw-text-3xl tw-font-extrabold">Add Loan</div>
          <div class="tw-text-2xl tw-flex tw-justify-between tw">
            <div>
              <q-input
                rounded
                standout="bg-teal text-white"
                label="Application No."
                v-model="addGovernmentLoanStore.application_no"
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
                  v-model="addGovernmentLoanStore.employeeOption"
                  label="Employee"
                  use-input
                  hide-selected
                  fill-input
                  hide-bottom-space
                  input-debounce="0"
                  :options="addGovernmentLoanStore.employeeOptions"
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
              v-model="addGovernmentLoanStore.type"
              label="Loan Type"
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="addGovernmentLoanStore.typeOptions"
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
                  v-model="addGovernmentLoanStore.date_start"
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
                  v-model="addGovernmentLoanStore.date_end"
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
                v-model="addGovernmentLoanStore.half_month_indicator"
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
                v-model="addGovernmentLoanStore.additional_info"
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
                  v-model="addGovernmentLoanStore.amortization"
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
                  v-model="addGovernmentLoanStore.total_amount"
                  type="number"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            @click="addGovernmentLoanStore.resetForm"
            v-close-popup
          />
          <q-btn flat class="tw-bg-green-400" label="Add Loan" type="submit" />
        </q-card-actions>
      </q-form>
    </div>
  </q-dialog>
</template>
