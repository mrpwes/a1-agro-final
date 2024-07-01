<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { useAddEmployee } from "src/stores/admin/addEmployee";
// import { Notify } from "quasar";

const storeAddEmployee = useAddEmployee();

const addEmployeeDialog = ref(false);
// function addEmployee() {
//   addEmployeeDialog.value = false;

//   Notify.create({
//     icon: "done",
//     color: "positive",
//     message: "Added Employee Successfully!",
//   });
// }

function resetForm() {
  storeAddEmployee.reset();
}

function onFileInput(event) {
  storeAddEmployee.profileImage = URL.createObjectURL(event.target.files[0]);
  storeAddEmployee.profileImageUpload = event.target.files[0];

  const name = event.target.files[0].name;
  const lastDot = name.lastIndexOf(".");
  const ext = name.substring(lastDot + 1);

  storeAddEmployee.profileImageFileExtension = ext;
}

storeAddEmployee.getReferencedData();
</script>

<template>
  <q-btn
    icon="mdi-plus"
    label="Add Employee"
    @click="addEmployeeDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="addEmployeeDialog" persistent>
    <q-card class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-form @submit.prevent="storeAddEmployee.addEmployee" autofocus>
        <div>
          <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-3">
            <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
              Add New Employee
            </div>
            <div class="tw-col-span-2 tw-row-span-2 tw-self-center tw-mx-auto">
              <div>
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  @change="onFileInput($event)"
                />
              </div>
              <div class="tw-grid tw-justify-items-center">
                <q-img
                  :src="storeAddEmployee.profileImage"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
            </div>
            <div class="tw-col-span-2 tw-content-center tw-p-3">
              <div class="tw-flex tw-gap-3">
                <div class="tw-max-w-64 tw-min-w-32">
                  <q-select
                    filled
                    v-model="storeAddEmployee.employment_type_id_selected"
                    :options="storeAddEmployee.employment_type"
                    option-label="employment_type_name"
                    :option-value="employment_type_name"
                    popup-content-class="tw-capitalize"
                    :rules="[(val) => !!val || 'Field is required']"
                    lazy-rules
                    lazy-loading
                    hide-bottom-space
                    class="tw-capitalize"
                    :disable="storeAddEmployee.loading"
                  />
                </div>
                <q-input
                  filled
                  v-model="storeAddEmployee.email"
                  label="Email"
                  :rules="[(val) => !!val || 'Field is required']"
                  :disable="storeAddEmployee.loading"
                />
                <q-input
                  filled
                  v-model="storeAddEmployee.password"
                  type="password"
                  :rules="[(val) => !!val || 'Field is required']"
                  label="Password"
                  :disable="storeAddEmployee.loading"
                />
              </div>
            </div>
            <div class="tw-col-span-2 tw-content-center tw-p-3">
              <div class="tw-flex tw-gap-3">
                <q-input
                  filled
                  v-model="storeAddEmployee.last_name"
                  label="Last Name"
                  :rules="[(val) => !!val || 'Field is required']"
                  class="tw-capitalize"
                  :disable="storeAddEmployee.loading"
                />
                <q-input
                  filled
                  v-model="storeAddEmployee.first_name"
                  label="Fist Name"
                  :rules="[(val) => !!val || 'Field is required']"
                  class="tw-capitalize"
                  :disable="storeAddEmployee.loading"
                />
                <q-input
                  filled
                  v-model="storeAddEmployee.middle_name"
                  label="Middle Name"
                  class="tw-capitalize"
                  :disable="storeAddEmployee.loading"
                />
              </div>
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold tw-text-nowrap">Date Hired:</span>
              <div class="tw-max-w-52">
                <q-input
                  filled
                  v-model="storeAddEmployee.hired_date"
                  label="YYYY-MM-DD"
                  :rules="[(val) => date.isValid(val)]"
                  hide-bottom-space
                  :disable="storeAddEmployee.loading"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="storeAddEmployee.hired_date"
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
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">Contact Type:</span>
              <div class="tw-max-w-64">
                <q-select
                  filled
                  v-model="storeAddEmployee.phone_type_selected"
                  :options="storeAddEmployee.phone_type"
                  option-label="phone_type_name"
                  :option-value="phone_type_name"
                  popup-content-class="tw-capitalize"
                  :rules="[(val) => !!val || 'Field is required']"
                  lazy-rules
                  lazy-loading
                  hide-bottom-space
                  class="tw-capitalize"
                  :disable="storeAddEmployee.loading"
                />
              </div>
            </div>
            <div class="tw-col-span-1">
              <div v-if="storeAddEmployee.phone_type_selected != null">
                <span class="tw-font-semibold">Contact Number:</span>
                <div class="tw-max-w-64">
                  <q-input
                    filled
                    v-model="storeAddEmployee.phone_number"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-1">
              <div class="">
                <span class="tw-font-semibold">Birthday:</span>

                <div class="tw-max-w-52">
                  <q-input
                    filled
                    v-model="storeAddEmployee.date_of_birth"
                    label="YYYY-MM-DD"
                    :rules="[(val) => date.isValid(val)]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="storeAddEmployee.date_of_birth"
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
              <div>
                <span class="tw-font-semibold">Gender:</span>
                <div class="tw-max-w-64">
                  <q-select
                    filled
                    v-model="storeAddEmployee.gender"
                    :options="['Male', 'Female']"
                    :rules="[(val) => !!val || 'Field is required']"
                    lazy-rules
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-1">
              <div>
                <span class="tw-font-semibold">Martial Status:</span>
                <div class="tw-max-w-64">
                  <q-select
                    filled
                    v-model="storeAddEmployee.martial_status"
                    :options="[
                      'Single',
                      'Married',
                      'Widowed',
                      'Divorced',
                      'Separated',
                    ]"
                    :rules="[(val) => !!val || 'Field is required']"
                    lazy-rules
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-1">
              <div>
                <span class="tw-font-semibold">Department:</span>
                <div class="tw-max-w-64">
                  <q-input
                    filled
                    v-model="storeAddEmployee.department"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
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
                    v-model="storeAddEmployee.position"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="tw-grid tw-grid-cols-4 tw-gap-1 tw-mb-4">
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">Address:</span>
              <q-input
                filled
                v-model="storeAddEmployee.region"
                :dense="dense"
                label="Region"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.province"
                :dense="dense"
                label="Province"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.city"
                label="City"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.barangay"
                label="Barangay"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.postal_code"
                label="Postal Code"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.street"
                label="Street"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.house_number"
                label="House Number"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
            <div class="tw-col-span-1">
              <span class="tw-font-semibold">&nbsp;</span>
              <q-input
                filled
                v-model="storeAddEmployee.additional_information"
                label="Additional Information"
                :dense="dense"
                hide-bottom-space
                :disable="storeAddEmployee.loading"
              />
            </div>
          </div>
          <div class="tw-grid tw-grid-cols-3 tw-gap-3">
            <div
              class="tw-col-span-3 tw-text-lg tw-text-center tw-font-extrabold"
            >
              Payroll Information
            </div>
            <div class="tw-col-span-1">
              <div class="tw-flex tw-items-center">
                <span class="tw-font-semibold">PhilHealth Number:</span>
                <div class="tw-max-w-52">
                  <q-input
                    filled
                    v-model="storeAddEmployee.phil_health_number"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
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
                    v-model="storeAddEmployee.pag_ibig_number"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-1">
              <div class="tw-flex tw-items-center">
                <span class="tw-font-semibold">SSS Number:</span>
                <div class="tw-max-w-52">
                  <q-input
                    filled
                    v-model="storeAddEmployee.sss_number"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
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
                    v-model="storeAddEmployee.bir_tin"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
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
                    v-model="storeAddEmployee.rate_per_day"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                    :disable="storeAddEmployee.loading"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              :disable="storeAddEmployee.loading"
              label="Cancel"
              @click="resetForm"
              v-close-popup
            />
            <q-btn
              :disable="storeAddEmployee.loading"
              flat
              class="tw-bg-green-400"
              label="Add Employee"
              type="submit"
            />
          </q-card-actions>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
