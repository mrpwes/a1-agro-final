<script setup>
import { ref } from "vue";

const viewPrompt = ref(false);
const selectedRow = ref(null);
const tableRows = ref([]); // Reactive property to hold table rows
const showTable = ref(false); // Reactive property to control table visibility

function openmodel() {
  viewPrompt.value = true;
  console.table(selectedRow.value);
}

function generateTable() {
  const input = document.getElementById("inputData").value;
  const rows = input.trim().split("\n");
  const newTableRows = []; // Temporary array to hold new rows

  rows.forEach((row, index) => {
    const columns = row.split(/\s+/); // Split by whitespace
    let combinedValue;

    // Combine first two values for the first row, and first three for others
    if (index === 0) {
      combinedValue = `${columns[0]} ${columns[1]}`; // Combine first two columns
    } else {
      combinedValue = `${columns[0]} ${columns[1]} ${columns[2]}`; // Combine first three columns
    }

    const values = columns.slice(index === 0 ? 2 : 3); // Remaining columns are values
    // Create a new row object
    const rowData = {
      combinedValue,
      values: values.slice(0, 15), // Ensure we only take the first 15 values
    };
    newTableRows.push(rowData);
  });

  // Update the reactive tableRows property
  tableRows.value = newTableRows;
  showTable.value = true; // Show the table after generating it
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}
th,
td {
  border: 1px solid #000;
  text-align: center;
}
</style>

<template>
  <q-btn label="SSS Contribution Table" @click="openmodel()" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-full !tw-max-w-none tw-bg-white tw-p-6">
      <h2>Convert Textarea Input to Table</h2>
      <textarea
        id="inputData"
        rows="10"
        cols="100"
        placeholder="Paste your data here..."
      ></textarea>
      <br />
      <button @click="generateTable">Generate Table</button>

      <!-- Conditional rendering of the table container -->
      <div v-if="showTable">
        <q-markup-table dense>
          <thead>
            <tr>
              <th class="text-left">Range Value</th>
              <th class="text-right">Value 1</th>
              <th class="text-right">Value 2</th>
              <th class="text-right">Value 3</th>
              <th class="text-right">Value 4</th>
              <th class="text-right">Value 5</th>
              <th class="text-right">Value 6</th>
              <th class="text-right">Value 7</th>
              <th class="text-right">Value 8</th>
              <th class="text-right">Value 9</th>
              <th class="text-right">Value 10</th>
              <th class="text-right">Value 11</th>
              <th class="text-right">Value 12</th>
              <th class="text-right">Value 13</th>
              <th class="text-right">Value 14</th>
              <th class="text-right">Value 15</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableRows" :key="index">
              <td class="text-left">{{ row.combinedValue }}</td>
              <td class="text-right" v-for="(value, i) in row.values" :key="i">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
