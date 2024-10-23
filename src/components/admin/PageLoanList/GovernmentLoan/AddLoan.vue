<script setup>
import { ref } from "vue";
import { useAddGovernmentLoanStore } from "src/stores/admin/loanListPage/governmentLoan/addLoan";

const addGovernmentLoanStore = useAddGovernmentLoanStore();
const addLoanDialog = ref(false);

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
    label="Add Loan"
    @click="addLoanDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="addLoanDialog" persistent>
    <div class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-p-6">
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
                  label="Date Start: YYYY-MM-DD"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="addGovernmentLoanStore.date_start"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div>
              <div class="tw-w-52">
                <q-input
                  rounded
                  standout="bg-teal text-white"
                  v-model="addGovernmentLoanStore.date_end"
                  label="Date End: YYYY-MM-DD"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="addGovernmentLoanStore.date_end"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="tw-w-44">
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="addGovernmentLoanStore.half_month_indicator"
                label="Monthly Schedule"
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
              />
            </div>
          </div>
          <div>
            Additional Information:
            <div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="addGovernmentLoanStore.additional_info"
                type="textarea"
              />
            </div>
          </div>
          <div class="tw-flex tw-align-middle">
            <div class="tw-my-auto">Amortization:</div>
            <div class="tw-w-2"></div>
            <div class="tw-w-32">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="addGovernmentLoanStore.amortization"
              />
            </div>
          </div>
          <div></div>
          <!-- <div>{{ selectedRow }}</div> -->
        </div>
        <!-- storeAddLoan.insertRequestForm -->
        <!-- <div class="tw-m-4">
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Employee Name:</div>
            <q-select
              filled
              v-model="addGovernmentLoanStore.employeeOption"
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="addGovernmentLoanStore.selectorEmployeeOptions"
              :option-label="
                (opt) =>
                  'first_name' in opt
                    ? opt.company_employee_id + ' - ' + opt.last_name
                    : ''
              "
              @filter="filterFn"
              :option-value="id"
              class="!tw-pb-0; tw-capitalize"
              popup-content-class="tw-capitalize"
            >
              @filter="filterRecipient"
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
              v-model="addGovernmentLoanStore.type"
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
               @filter="filterRecipient"
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
            <div class="tw-content-center tw-mr-3">Application No.:</div>
            <div class="tw-px-2">
              <q-input
                v-model="addGovernmentLoanStore.application_no"
                filled
                autogrow
                hide-bottom-space
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div>
            <div>Additional Info (Optional):</div>
            <div class="tw-pb-3 tw-px-2">
              <q-input
                v-model="addGovernmentLoanStore.additional_info"
                type="textarea"
                filled
                hide-bottom-space
              />
            </div>
          </div>
          <div>
            <div>
              <span class="tw-font-semibold tw-text-nowrap">Date Start:</span>
              <div class="tw-max-w-52">
                <q-input
                  filled
                  v-model="addGovernmentLoanStore.date_start"
                  label="YYYY-MM-DD"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="addGovernmentLoanStore.date_start"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div>
              <span class="tw-font-semibold tw-text-nowrap">Date End:</span>
              <div class="tw-max-w-52">
                <q-input
                  filled
                  v-model="addGovernmentLoanStore.date_end"
                  label="YYYY-MM-DD"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="addGovernmentLoanStore.date_end"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="tw-flex tw-mb-3">
              <div class="tw-content-center tw-mr-3">Amortization:</div>
              <div class="tw-px-2">
                <q-input
                  v-model="addGovernmentLoanStore.amortization"
                  filled
                  autogrow
                  hide-bottom-space
                  class="tw-max-w-full"
                />
              </div>
            </div>
            <div>
              <span class="tw-font-semibold">Monthly Schedule:</span>
              <div class="tw-min-w-32">
                <q-select
                  filled
                  v-model="addGovernmentLoanStore.half_month_indicator"
                  :options="['1st Half', '2nd Half']"
                  :dense="dense"
                  :rules="[(val) => val.length >= 3]"
                  hide-bottom-space
                />
              </div>
            </div>
          </div>
        </div> -->
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="resetForm" v-close-popup />
          <q-btn
            flat
            class="tw-bg-green-400"
            label="Add Loan"
            type="submit"
            v-close-popup
            :disable="addGovernmentLoanStore.disableButtonExisting"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-dialog>
</template>
