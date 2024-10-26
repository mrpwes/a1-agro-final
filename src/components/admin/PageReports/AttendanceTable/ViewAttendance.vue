<script setup>
import { ref } from "vue";
import { useReportsViewAttendanceTable } from "stores/admin/reportsPage/viewAttendanceTable/viewAttendanceTable";

const viewReportsAttendanceTableStore = useReportsViewAttendanceTable();

defineProps(["rows", "column", "columns", "qBtnLabel"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
const currentColumnIndex = ref(null);
const currentTotalHours = ref(null);

function openmodel(row, column, columns) {
  currentColumnIndex.value = findIndexInArray(columns, column);
  selectedRow.value = row.row.attendance[currentColumnIndex.value - 1];
  viewPrompt.value = true;
  currentTotalHours.value = calculateTotalHours(selectedRow);
  console.log(currentTotalHours.value);

  viewReportsAttendanceTableStore.attendanceID = selectedRow.value.id;
  viewReportsAttendanceTableStore.attendanceDate = selectedRow.value.date;
  viewReportsAttendanceTableStore.attendanceRemarks = selectedRow.value.remarks;
  viewReportsAttendanceTableStore.attendanceTimeIn = selectedRow.value.time_in;
  viewReportsAttendanceTableStore.attendanceTimeOut =
    selectedRow.value.time_out;
  viewReportsAttendanceTableStore.attendanceEmployeeID =
    selectedRow.value.employee_id;
  viewReportsAttendanceTableStore.attendanceType =
    selectedRow.value.attendance_type_id;
  viewReportsAttendanceTableStore.attendanceAdjustmentSalaryID =
    selectedRow.value.adjustment_salary_id;
}

function findIndexInArray(array, targetObject) {
  return array.findIndex(
    (item) =>
      item.name === targetObject.name &&
      item.align === targetObject.align &&
      item.label === targetObject.label &&
      item.sortable === targetObject.sortable &&
      item.__iconClass === targetObject.__iconClass &&
      item.__thClass === targetObject.__thClass
  );
}

function calculateTotalHours(row) {
  const currentDate = new Date();
  const rowDate = new Date(row.date);

  // Check if the row date is today or in the future
  if (rowDate >= currentDate) {
    return "N/A";
  }

  let totalHours;

  const timeIn = row.time_in ? new Date(row.time_in) : null;
  const timeOut = row.time_out ? new Date(row.time_out) : null;

  // Check if time_in is null and time_out is also null
  if (timeOut === null && timeIn !== null) {
    return "No Time Out";
  } else if (
    row.attendance_type_id !== 1 &&
    row.attendance_type_id !== undefined
  ) {
    return capitalizeFirstLetterOfEachWord(
      row.attendance_type.attendance_type_name
    );
  } else {
    // Set timeIn to 8 AM if it's before 8 AM
    if (timeIn) {
      const eightAM = new Date(timeIn);
      eightAM.setHours(8, 0, 0, 0);
      if (timeIn < eightAM) {
        timeIn.setHours(8, 0, 0, 0);
      }
    }

    // Set timeOut to 5 PM if it's after 5 PM
    if (timeOut) {
      const fivePM = new Date(timeOut);
      fivePM.setHours(17, 0, 0, 0);
      if (timeOut > fivePM) {
        timeOut.setHours(17, 0, 0, 0);
      }

      // Calculate total hours worked
      if (timeIn && timeOut) {
        totalHours = ((timeOut - timeIn) / (1000 * 60 * 60)).toFixed(2);

        const onePM = new Date(timeOut);
        onePM.setHours(13, 0, 0, 0);
        if (timeOut > onePM) {
          totalHours = (parseFloat(totalHours) - 1).toFixed(2); // Subtract 1 hour for lunch
        }
      } else {
        totalHours = "No Time Out";
      }
    } else {
      totalHours = "No Time Out";
    }
  }

  return totalHours;
}

// Helper function to capitalize the first letter of each word
function capitalizeFirstLetterOfEachWord(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>

<template>
  <q-btn
    unelevated
    padding="none"
    :label="qBtnLabel"
    @click="openmodel(rows, column, columns)"
    class="!tw-font-normal !tw-capitalize"
  />
  <q-dialog v-model="viewPrompt" persistent>
    <div
      v-if="selectedRow.id != null && selectedRow.attendance_type_id == 1"
      class="!tw-h-min !tw-w-4/12 !tw-max-w-full tw-bg-white tw-p-6"
    >
      <q-form
        @submit.prevent="viewReportsAttendanceTableStore.updateAttendance()"
      >
        <div class="tw-grid tw-gap-7">
          <div class="tw-text-3xl tw-font-extrabold tw-flex tw-justify-between">
            <div>Attendance ID: {{ selectedRow.id }}</div>
            <div>{{ column.label }}</div>
          </div>
          <div>
            Employee: {{ selectedRow.employee.company_employee_id }} -
            {{ selectedRow.employee.last_name }},
            {{ selectedRow.employee.first_name }}
          </div>
          <div>
            Remarks:
            <q-input
              rounded
              standout="bg-teal text-white"
              v-model="viewReportsAttendanceTableStore.attendanceRemarks"
              type="textarea"
              autogrow
              :disable="!viewReportsAttendanceTableStore.is_editing"
            />
          </div>
          <div class="tw-flex tw-justify-between">
            <div>
              Time In:
              <q-btn
                rounded
                standout="bg-teal text-white"
                icon="access_time"
                :label="viewReportsAttendanceTableStore.getFormattedTimeIn"
                :disable="!viewReportsAttendanceTableStore.is_editing"
              >
                <q-popup-proxy
                  @before-show="
                    viewReportsAttendanceTableStore.updateProxy(
                      (isTimeIn = true)
                    )
                  "
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="
                      viewReportsAttendanceTableStore.attendanceTimeInProxy
                    "
                    mask="YYYY-MM-DDTHH:mm:ss"
                    :hour-options="viewReportsAttendanceTableStore.hourOptions"
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Cancel"
                        color="primary"
                        flat
                        v-close-popup
                      />
                      <q-btn
                        label="OK"
                        color="primary"
                        flat
                        @click="
                          viewReportsAttendanceTableStore.saveProxy(
                            (isTimeIn = true)
                          )
                        "
                        v-close-popup
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-btn>
            </div>

            <div>
              Time Out:
              <q-btn
                rounded
                standout="bg-teal text-white"
                icon="access_time"
                :label="viewReportsAttendanceTableStore.getFormattedTimeOut"
                :disable="!viewReportsAttendanceTableStore.is_editing"
              >
                <q-popup-proxy
                  @before-show="
                    viewReportsAttendanceTableStore.updateProxy(
                      (isTimeIn = false)
                    )
                  "
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="
                      viewReportsAttendanceTableStore.attendanceTimeOutProxy
                    "
                    mask="YYYY-MM-DDTHH:mm:ss"
                    :hour-options="viewReportsAttendanceTableStore.hourOptions"
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Cancel"
                        color="primary"
                        flat
                        v-close-popup
                      />
                      <q-btn
                        label="OK"
                        color="primary"
                        flat
                        @click="
                          viewReportsAttendanceTableStore.saveProxy(
                            (isTimeIn = false)
                          )
                        "
                        v-close-popup
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="text-primary noPrint">
          <q-btn
            v-if="viewReportsAttendanceTableStore.is_editing == false"
            flat
            class="tw-bg-green-400"
            :icon="viewReportsAttendanceTableStore.is_editing ? 'save' : 'edit'"
            :label="
              viewReportsAttendanceTableStore.is_editing ? 'Save' : 'Edit'
            "
            @click="viewReportsAttendanceTableStore.is_editing = true"
          />
          <q-btn
            v-else
            flat
            type="submit"
            class="tw-bg-green-400"
            :icon="viewReportsAttendanceTableStore.is_editing ? 'save' : 'edit'"
            :label="
              viewReportsAttendanceTableStore.is_editing ? 'Save' : 'Edit'
            "
          />
          <q-btn
            flat
            label="CLOSE"
            @click="viewReportsAttendanceTableStore.resetForm"
            v-close-popup
          />
        </q-card-actions>
      </q-form>
    </div>
    <div v-else>
      {{ selectedRow }}
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
