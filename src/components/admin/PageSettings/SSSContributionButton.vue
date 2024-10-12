<script setup>
import { ref } from "vue";
import { useSssContributionTableStore } from "stores/admin/settingsPage/sssContributionTable";
import HistoryAuditButton from "components/admin/PageSettings/SSS/HistoryAuditButton.vue";

const sssContributionTableStore = useSssContributionTableStore();

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
    console.log(rowData);
  });

  // Update the reactive tableRows property
  tableRows.value = newTableRows;
  console.log(JSON.stringify(tableRows.value));
  showTable.value = true; // Show the table after generating it
  sssContributionTableStore.insertSssContributionTable(tableRows.value);
}

async function showExistingTable() {
  await sssContributionTableStore.fetchSssContributionTable();
  tableRows.value = sssContributionTableStore.sssContributionHistory[0].data;
  showTable.value = true; // Show the table after generating it
}

showExistingTable();
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
      <div
        class="tw-text-3xl tw-font-extrabold tw-pb-3 tw-flex tw-justify-between"
      >
        <div>SSS Contribution Table</div>
        <div>
          Last Updated:
          {{ sssContributionTableStore.sssContributionHistory[0].change_date }}
        </div>
      </div>
      <div class="tw-flex tw-justify-end tw-mb-5">
        <div>
          <q-btn
            v-if="sssContributionTableStore.isEditing == false"
            flat
            class="tw-bg-green-400"
            :icon="sssContributionTableStore.isEditing ? 'save' : 'edit'"
            label="Edit"
            @click="
              sssContributionTableStore.isEditing =
                !sssContributionTableStore.isEditing
            "
          />

          <HistoryAuditButton></HistoryAuditButton>
          <!-- <q-btn icon="mdi-history" label="History" /> -->
          <!-- // NewHistory Button -->
        </div>
      </div>
      <div
        v-if="sssContributionTableStore.isEditing"
        class="tw-flex tw-justify-center tw-mb-6"
      >
        <div>
          <textarea
            id="inputData"
            rows="10"
            cols="100"
            placeholder="Paste your data here..."
            class="tw-border-4 tw-border-gray-400 tw-p-2"
          ></textarea>
          <br />
          <q-btn class="tw-bg-green-400" @click="generateTable"
            >Change Table</q-btn
          >
        </div>
      </div>
      <!-- Conditional rendering of the table container -->
      <div v-if="showTable">
        <q-markup-table dense>
          <thead>
            <tr>
              <th rowspan="2" class="text-left">RANGE OF COMPENSATION</th>
              <th colspan="3">TESTING</th>
              <th colspan="12">AMOUNT OF CONTRIBUTIONS</th>
            </tr>
            <tr>
              <th class="text-right">Regular SS EC</th>
              <th class="text-right">WISP</th>
              <th class="text-right">TOTAL</th>
              <th class="text-right">ER</th>
              <th class="text-right">EE</th>
              <th class="text-right">TOTAL</th>
              <th class="text-right">ER</th>
              <th class="text-right">EE</th>
              <th class="text-right">TOTAL</th>
              <th class="text-right">ER</th>
              <th class="text-right">EE</th>
              <th class="text-right">TOTAL</th>
              <th class="text-right">ER</th>
              <th class="text-right">EE</th>
              <th class="text-right">TOTAL</th>
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
