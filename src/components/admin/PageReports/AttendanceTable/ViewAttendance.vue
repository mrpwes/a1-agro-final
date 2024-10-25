<script setup>
import { ref } from "vue";

defineProps(["rows", "column", "columns", "qBtnLabel"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
const currentColumnIndex = ref(null);
const currentTotalHours = ref(null);

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

function openmodel(row, column, columns) {
  currentColumnIndex.value = findIndexInArray(columns, column);
  selectedRow.value = row.row.attendance[currentColumnIndex.value - 1];
  viewPrompt.value = true;
  currentTotalHours.value = calculateTotalHours(selectedRow);
  console.log(currentTotalHours.value);
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
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      {{ columns }}
      <br /><br />
      {{ column }}
      {{}}
      <br />
      <br />
      {{ selectedRow }}
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
