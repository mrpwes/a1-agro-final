<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { useViewEmployeeStore } from "src/stores/admin/employeeListPage/viewEmployee";
import viewEmployeeAuditButton from "components/admin/PageEmployeeList/ViweEmployeeButtonHistory/ViewEmployeeAuditButton.vue";

defineProps(["rows"]);

const storeViewEmployee = useViewEmployeeStore();

const viewPrompt = ref(false);
const selectedRow = ref(null);
const editingInformation = ref(false);

function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
  console.table(selectedRow.value);
}

function capitalizeFirstLetterOfEachWord(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
</script>

<template>
  <q-btn icon="visibility" label="View" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-grid tw-grid-cols-4 tw-gap-5 tw-pb-5">
        <div class="tw-col-span-2 tw-text-3xl tw-font-extrabold tw-pb-3">
          {{
            capitalizeFirstLetterOfEachWord(
              selectedRow.first_name +
                " " +
                selectedRow.middle_name +
                " " +
                selectedRow.last_name
            )
          }}
        </div>
        <div
          class="tw-col-span-2 tw-text-3xl tw-font-extrabold tw-pb-3 tw-ml-auto"
        >
          <viewEmployeeAuditButton
            :rows="selectedRow"
          ></viewEmployeeAuditButton>
        </div>
        <div class="tw-col-span-2">
          <!-- TODO: Update Image Responsiveness -->
          <img
            :src="storeViewEmployee.getProfilePicture(selectedRow.id)"
            class="tw-mx-auto tw-my-3 tw-rounded-full tw-size-36"
          />
        </div>
        <div class="tw-col-span-2 tw-content-center tw-p-3">
          <div class="tw-flex tw-gap-3">
            <q-input
              filled
              v-model="selectedRow.last_name"
              label="Last Name"
              :rules="[(val) => !!val || 'Field is required']"
              class="tw-capitalize"
              :disable="!editingInformation"
            />
            <q-input
              filled
              v-model="selectedRow.first_name"
              label="Fist Name"
              :rules="[(val) => !!val || 'Field is required']"
              class="tw-capitalize"
              :disable="!editingInformation"
            />
            <q-input
              filled
              v-model="selectedRow.middle_name"
              label="Middle Name"
              class="tw-capitalize"
              :disable="!editingInformation"
            />
          </div>
        </div>
        <div class="tw-col-span-1">
          <div>
            <span class="tw-font-semibold">Employee ID:</span>
            <div class="tw-w-36">
              <q-input
                filled
                :dense="dense"
                v-model="selectedRow.company_employee_id"
                :disable="true"
                hide-bottom-space
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <span class="tw-font-semibold tw-text-nowrap">Date Hired:</span>
          <div class="tw-max-w-52">
            <q-input
              filled
              v-model="selectedRow.hired_date"
              label="YYYY-MM-DD"
              :rules="[(val) => date.isValid(val)]"
              hide-bottom-space
              :disable="!editingInformation"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="selectedRow.hired_date" mask="YYYY-MM-DD">
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
        <div class="tw-col-span-1">
          <span class="tw-font-semibold">Contact Number:</span>
          <div class="tw-max-w-64">
            <q-input
              filled
              v-model="selectedRow.phone_number[0].phone_number"
              :dense="dense"
              :rules="[(val) => val.length >= 3]"
              hide-bottom-space
              :disable="!editingInformation"
            />
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="">
            <span class="tw-font-semibold">Birthday:</span>

            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.date_of_birth"
                :rules="[(val) => date.isValid(val)]"
                label="YYYY-MM-DD"
                hide-bottom-space
                :disable="!editingInformation"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="selectedRow.date_of_birth"
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
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Gender:</span>
            <div class="tw-w-32">
              <q-select
                filled
                v-model="selectedRow.gender"
                :options="['Male', 'Female']"
                :display-value="
                  selectedRow.gender == true || selectedRow.gender == 'Male'
                    ? 'Male'
                    : 'Female'
                "
                :rules="[(val) => !!val || 'Field is required']"
                lazy-rules
                emit-value
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Martial Status:</span>
            <q-select
              filled
              v-model="selectedRow.martial_status"
              :options="[
                'Single',
                'Married',
                'Widowed',
                'Divorced',
                'Separated',
              ]"
              :class="[
                selectedRow.martial_status == null ? 'tw-w-32' : 'tw-w-max',
              ]"
              :rules="[(val) => !!val || 'Field is required']"
              lazy-rules
              :disable="!editingInformation"
              hide-bottom-space
            />
          </div>
        </div>
        <div class="tw-col-span-1">
          <div>
            <span class="tw-font-semibold">Department:</span>
            <div class="tw-max-w-64">
              <q-input
                filled
                v-model="selectedRow.department"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div>
            <span class="tw-font-semibold">Position:</span>
            <div class="tw-max-w-64">
              <q-input
                filled
                v-model="selectedRow.position"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-4">
          <div class="tw-grid tw-grid-cols-4 tw-gap-1 tw-mb-4">
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">Address:</span>
              <q-input
                filled
                v-model="selectedRow.address[0].region"
                :dense="dense"
                label="Region"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].province"
                :dense="dense"
                label="Province"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].city"
                label="City"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].barangay"
                label="Barangay"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].postal_code"
                label="Postal Code"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].street"
                label="Street"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].house_number"
                label="House Number"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="selectedRow.address[0].additional_information"
                label="Additional Information"
                :dense="dense"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-3 tw-gap-3">
        <div class="tw-col-span-3 tw-text-lg tw-text-center tw-font-extrabold">
          Payroll Information
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">SSS Number:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.sss_number"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">SSS Contribution:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.emp_sss_contrib[0].amount"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">SSS Monthly Schedule:</span>
            <div class="tw-min-w-32">
              <q-select
                filled
                v-model="selectedRow.emp_sss_contrib[0].half_month_indicator"
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
                :display-value="
                  selectedRow.emp_sss_contrib[0].half_month_indicator === false
                    ? '1st Half'
                    : selectedRow.emp_sss_contrib[0].half_month_indicator ===
                      true
                    ? '2nd Half'
                    : selectedRow.emp_sss_contrib[0].half_month_indicator ===
                      '1st Half'
                    ? '1st Half'
                    : selectedRow.emp_sss_contrib[0].half_month_indicator ===
                      '2nd Half'
                    ? '2nd Half'
                    : 'N/A'
                "
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">PhilHealth Number:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.phil_health_number"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">PhilHealth Contribution:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.emp_philhealth_contrib[0].amount"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">PhilHealth Monthly Schedule:</span>
            <div class="tw-min-w-32">
              <q-select
                filled
                v-model="
                  selectedRow.emp_philhealth_contrib[0].half_month_indicator
                "
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
                :display-value="
                  selectedRow.emp_philhealth_contrib[0].half_month_indicator ===
                  false
                    ? '1st Half'
                    : selectedRow.emp_philhealth_contrib[0]
                        .half_month_indicator === true
                    ? '2nd Half'
                    : selectedRow.emp_philhealth_contrib[0]
                        .half_month_indicator === '1st Half'
                    ? '1st Half'
                    : selectedRow.emp_philhealth_contrib[0]
                        .half_month_indicator === '2nd Half'
                    ? '2nd Half'
                    : 'N/A'
                "
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Pag-IBIG Number:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.pag_ibig_number"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Pag-IBIG Contribution:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.emp_pagibig_contrib[0].amount"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Pag-IBIG Monthly Schedule:</span>
            <div class="tw-min-w-32">
              <q-select
                filled
                v-model="
                  selectedRow.emp_pagibig_contrib[0].half_month_indicator
                "
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
                :display-value="
                  selectedRow.emp_pagibig_contrib[0].half_month_indicator ===
                  false
                    ? '1st Half'
                    : selectedRow.emp_pagibig_contrib[0]
                        .half_month_indicator === true
                    ? '2nd Half'
                    : selectedRow.emp_pagibig_contrib[0]
                        .half_month_indicator === '1st Half'
                    ? '1st Half'
                    : selectedRow.emp_pagibig_contrib[0]
                        .half_month_indicator === '2nd Half'
                    ? '2nd Half'
                    : 'N/A'
                "
              />
            </div>
          </div>
        </div>

        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">BIR Tin:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.bir_tin"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Income Tax:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.emp_incometax_contrib[0].amount"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Tax Monthly Schedule:</span>
            <div class="tw-min-w-32">
              <q-select
                filled
                v-model="
                  selectedRow.emp_incometax_contrib[0].half_month_indicator
                "
                :options="['1st Half', '2nd Half']"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
                :display-value="
                  selectedRow.emp_incometax_contrib[0].half_month_indicator ===
                  false
                    ? '1st Half'
                    : selectedRow.emp_incometax_contrib[0]
                        .half_month_indicator === true
                    ? '2nd Half'
                    : selectedRow.emp_incometax_contrib[0]
                        .half_month_indicator === '1st Half'
                    ? '1st Half'
                    : selectedRow.emp_incometax_contrib[0]
                        .half_month_indicator === '2nd Half'
                    ? '2nd Half'
                    : 'N/A'
                "
              />
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-flex tw-items-center">
            <span class="tw-font-semibold">Rate per day:</span>
            <div class="tw-max-w-52">
              <q-input
                filled
                v-model="selectedRow.rate_per_day"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
                :disable="!editingInformation"
              />
            </div>
          </div>
        </div>
      </div>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Cancel"
          @click="editingInformation = ref(false)"
          v-close-popup
        />
        <q-btn
          v-if="editingInformation == false"
          flat
          class="tw-bg-green-400"
          :icon="editingInformation ? 'save' : 'edit'"
          label="Edit"
          @click="editingInformation = !editingInformation"
        />
        <q-btn
          v-else
          flat
          class="tw-bg-green-400"
          :icon="editingInformation ? 'save' : 'edit'"
          label="Save"
          @click="
            editingInformation = !editingInformation;
            storeViewEmployee.updateEmployeeData(selectedRow);
          "
        />
        <q-btn
          flat
          :class="selectedRow.is_archive ? 'tw-bg-green-400' : 'tw-bg-red-400'"
          icon="mdi-archive"
          :label="selectedRow.is_archive ? 'Activate' : 'Inactivate'"
          @click="
            storeViewEmployee.inactiveEmployee(
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
