<script setup>
import { ref, watch } from "vue";
import { date } from "quasar";
import { useEmployeeListStore } from "src/stores/admin/employeeList";
import { Notify } from "quasar";

const storeEmployeeList = useEmployeeListStore();
//FIXME: CONTACT NUMBER ADD MORE

const addEmployeeDialog = ref(false);

const lastName = ref("");
const lastNameRef = ref(null);
const middleName = ref("");
const middleNameRef = ref(null);
const firstName = ref("");
const firstNameRef = ref(null);

// const dateHired = ref(date.formatDate(Date.now(), "M/D/YYYY"));
const employeeId = ref(storeEmployeeList.getHighestEmployeeIDNumber);

watch(storeEmployeeList.rows, () => {
  employeeId.value = storeEmployeeList.getHighestEmployeeIDNumber;
});

const employeeIdRef = ref(null);
const dateHired = ref(date.formatDate(Date.now(), "MM-DD-YYYY"));
const dateHiredRef = ref(null);
const contactNumber = ref("");
const contactNumberRef = ref(null);

const birthday = ref("");
const birthdayRef = ref(null);
const gender = ref("");
const genderRef = ref(null);
const martialStatus = ref("Single");
const martialStatusRef = ref(null);
const department = ref("");
const departmentRef = ref(null);
const position = ref("");
const positionRef = ref(null);
const address = ref("");
const addressRef = ref(null);

const philHealthNumber = ref("");
const philHealthNumberRef = ref(null);
const pagIbigNumber = ref("");
const pagIbigNumberRef = ref(null);
const sssNumber = ref("");
const sssNumberRef = ref(null);
const birTin = ref("");
const birTinRef = ref(null);
const ratePerDay = ref("");
const ratePerDayRef = ref(null);

function addEmployee() {
  var employeeId = storeEmployeeList.getHighestEmployeeIDNumber;
  lastNameRef.value.validate();
  middleNameRef.value.validate();
  firstNameRef.value.validate();
  dateHiredRef.value.validate();
  contactNumberRef.value.validate();
  // birthdayRef.value.validate();
  genderRef.value.validate();
  martialStatusRef.value.validate();
  departmentRef.value.validate();
  positionRef.value.validate();
  addressRef.value.validate();
  philHealthNumberRef.value.validate();
  pagIbigNumberRef.value.validate();
  sssNumberRef.value.validate();
  birTinRef.value.validate();
  ratePerDayRef.value.validate();
  if (
    lastNameRef.value.hasError ||
    middleNameRef.value.hasError ||
    firstNameRef.value.hasError ||
    dateHiredRef.value.hasError ||
    contactNumberRef.value.hasError ||
    // birthdayRef.value.hasError ||
    genderRef.value.hasError ||
    martialStatusRef.value.hasError ||
    departmentRef.value.hasError ||
    positionRef.value.hasError ||
    addressRef.value.hasError ||
    philHealthNumberRef.value.hasError ||
    pagIbigNumberRef.value.hasError ||
    sssNumberRef.value.hasError ||
    birTinRef.value.hasError ||
    ratePerDayRef.value.hasError
  ) {
    // Has Error
  }
  const arr = {
    employeeImg: "../../../assets/boy-avatar.png",
    birthday: birthday.value,
    martialStatus: martialStatus.value,
    address: address.value,

    employeeId: employeeId,
    name: {
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
    },
    gender: gender.value,
    contactNumber: contactNumber.value,

    dateHired: dateHired.value, //MM-DD-YYYY
    // employmentStatus: employmentStatus,
    position: position.value,
    department: department.value,
    ratePerDay: ratePerDay.value,

    philHealthNumber: philHealthNumber.value,
    pagIBIGNumber: pagIbigNumber.value,
    sssNumber: sssNumber.value,
    birTin: birTin.value,
    isArchive: false,
  };

  storeEmployeeList.rows.push(arr);

  addEmployeeDialog.value = false;

  resetForm();

  Notify.create({
    icon: "done",
    color: "positive",
    message: "Added Employee Successfully!",
  });
}

function resetForm() {
  lastName.value = "";
  middleName.value = "";
  firstName.value = "";
  contactNumber.value = "";
  birthday.value = "";
  gender.value = "";
  department.value = "";
  position.value = "";
  address.value = "";
  philHealthNumber.value = "";
  pagIbigNumber.value = "";
  sssNumber.value = "";
  birTin.value = "";
  ratePerDay.value = "";
}
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
      <q-form @submit.prevent="addEmployee" autofocus>
        <div>
          <div class="tw-grid tw-grid-cols-4 tw-gap-5 tw-pb-5">
            <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
              Add New Employee
            </div>
            <div class="tw-col-span-2">
              <img
                src="../../../assets/boy-avatar.png"
                class="tw-mx-auto tw-my-3 tw-rounded-full tw-size-36"
              />
            </div>
            <div class="tw-col-span-2 tw-content-center tw-p-3">
              <div class="tw-flex tw-gap-3">
                <q-input
                  filled
                  v-model="lastName"
                  ref="lastNameRef"
                  label="Last Name"
                  :rules="[(val) => !!val || 'Field is required']"
                />
                <q-input
                  filled
                  v-model="middleName"
                  ref="middleNameRef"
                  label="Middle Name"
                />
                <q-input
                  filled
                  v-model="firstName"
                  ref="firstNameRef"
                  label="Fist Name"
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
                    v-model="employeeId"
                    ref="employeeIdRef"
                    disable
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
                  v-model="dateHired"
                  ref="dateHiredRef"
                  label="MM-DD-YYYY"
                  :rules="[(val) => date.isValid(val)]"
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
                          v-model="dateHired"
                          ref="dateHiredRef"
                          mask="MM-DD-YYYY"
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
              <span class="tw-font-semibold">Contact Number:</span>
              <div class="tw-max-w-64">
                <q-input
                  filled
                  v-model="contactNumber"
                  ref="contactNumberRef"
                  :dense="dense"
                  :rules="[(val) => val.length >= 3]"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="tw-col-span-1">
              <div class="">
                <span class="tw-font-semibold">Birthday:</span>

                <div class="tw-max-w-52">
                  <q-input
                    filled
                    v-model="birthday"
                    ref="birthdayRef"
                    label="MM-DD-YYYY"
                    :rules="[(val) => date.isValid(val)]"
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
                            v-model="birthday"
                            ref="birthdayRef"
                            mask="MM-DD-YYYY"
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
                    v-model="gender"
                    ref="genderRef"
                    :options="['Male', 'Female']"
                    :rules="[(val) => !!val || 'Field is required']"
                    lazy-rules
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-1">
              <div class="tw-flex tw-items-center">
                <span class="tw-font-semibold">Martial Status:</span>
                <q-select
                  filled
                  v-model="martialStatus"
                  ref="martialStatusRef"
                  :options="[
                    'Single',
                    'Married',
                    'Widowed',
                    'Divorced',
                    'Separated',
                  ]"
                  :class="[martialStatus == null ? 'tw-w-32' : 'tw-w-max']"
                  :rules="[(val) => !!val || 'Field is required']"
                  lazy-rules
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
                    v-model="department"
                    ref="departmentRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
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
                    v-model="position"
                    ref="positionRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="tw-col-span-4">
              <span class="tw-font-semibold">Address:</span>
              <q-input
                filled
                v-model="address"
                ref="addressRef"
                :dense="dense"
                :rules="[(val) => val.length >= 3]"
                hide-bottom-space
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
                    v-model="philHealthNumber"
                    ref="philHealthNumberRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
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
                    v-model="pagIbigNumber"
                    ref="pagIbigNumberRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
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
                    v-model="sssNumber"
                    ref="sssNumberRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
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
                    v-model="birTin"
                    ref="birTinRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
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
                    v-model="ratePerDay"
                    ref="ratePerDayRef"
                    :dense="dense"
                    :rules="[(val) => val.length >= 3]"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
          </div>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" @click="resetForm" v-close-popup />
            <q-btn
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
