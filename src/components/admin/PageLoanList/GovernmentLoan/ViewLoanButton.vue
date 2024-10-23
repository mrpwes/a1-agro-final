<script setup>
import { ref } from "vue";
import { useGovtViewLoanStore } from "stores/admin/loanListPage/governmentLoan/viewLoan";

const govtViewLoanStore = useGovtViewLoanStore();

defineProps(["rows"]);

const viewPrompt = ref(false);

// https://vuejs.org/guide/components/props.html#one-way-data-flow

function openmodel(rows) {
  govtViewLoanStore.selected_row = JSON.parse(JSON.stringify(rows));
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
      <q-form>
        <div class="tw-grid tw-gap-3">
          <div id="section-to-print"></div>
          <div class="tw-text-3xl tw-font-extrabold">
            Loan ID: {{ govtViewLoanStore.selected_row.id }}
          </div>
          <div class="tw-text-2xl tw-flex tw-justify-between tw">
            <div>
              <q-input
                rounded
                standout="bg-teal text-white"
                :readonly="!govtViewLoanStore.buttonEdit"
                label="Application No."
                v-model="govtViewLoanStore.application_no"
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
                  :readonly="!govtViewLoanStore.buttonEdit"
                  v-model="govtViewLoanStore.employeeOption"
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
              :readonly="!govtViewLoanStore.buttonEdit"
              v-model="govtViewLoanStore.type"
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
                  :readonly="!govtViewLoanStore.buttonEdit"
                  v-model="govtViewLoanStore.date_start"
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
                          v-model="govtViewLoanStore.date_start"
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
                  :readonly="!govtViewLoanStore.buttonEdit"
                  v-model="govtViewLoanStore.date_end"
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
                          v-model="govtViewLoanStore.date_end"
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
                :readonly="!govtViewLoanStore.buttonEdit"
                v-model="govtViewLoanStore.half_month_indicator"
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
                :readonly="!govtViewLoanStore.buttonEdit"
                v-model="govtViewLoanStore.selected_row.additional_info"
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
                :readonly="!govtViewLoanStore.buttonEdit"
                v-model="govtViewLoanStore.selected_row.amortization"
              />
            </div>
          </div>
          <div></div>
          <!-- <div>{{ selectedRow }}</div> -->
        </div>
        <q-card-actions align="right" class="text-primary noPrint">
          <q-btn
            flat
            class="tw-bg-green-400"
            :icon="govtViewLoanStore.buttonEdit ? 'save' : 'edit'"
            :label="govtViewLoanStore.buttonEdit ? 'Save' : 'Edit'"
            @click="
              govtViewLoanStore.buttonEdit = !govtViewLoanStore.buttonEdit
            "
          />
          <q-btn flat label="Cancel" v-close-popup />
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
