<script setup>
import { ref } from "vue";
import { useIncomeTaxRatesStore } from "stores/admin/settingsPage/incomeTaxRates";
import HistoryAuditButton from "components/admin/PageSettings/IncomeTax/HistoryAuditButton.vue";

const incomeTaxRatesStore = useIncomeTaxRatesStore();

const viewPrompt = ref(false);
const selectedRow = ref(null);
// const tableRows = ref([]); // Reactive property to hold table rows
// const showTable = ref(false); // Reactive property to control table visibility

function openmodel() {
  viewPrompt.value = true;
  console.table(selectedRow.value);
}

incomeTaxRatesStore.fetchIncomeTaxRates();
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
  <q-btn label="Income Tax Rates Table" @click="openmodel()" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-6/12 !tw-max-w-none tw-bg-white tw-p-6">
      <div
        class="tw-text-3xl tw-font-extrabold tw-pb-3 tw-flex tw-justify-between"
      >
        <div>Income Tax Rates Table</div>
        <div>
          <q-btn
            v-if="incomeTaxRatesStore.isEditing == false"
            flat
            class="tw-bg-green-400 tw-mr-4"
            :icon="incomeTaxRatesStore.isEditing ? 'save' : 'edit'"
            label="Edit"
            @click="
              incomeTaxRatesStore.isEditing = !incomeTaxRatesStore.isEditing
            "
          />
          <q-btn
            v-else
            flat
            class="tw-bg-green-400 tw-mr-4"
            :icon="incomeTaxRatesStore.isEditing ? 'save' : 'edit'"
            label="Save"
            @click="
              incomeTaxRatesStore.isEditing = !incomeTaxRatesStore.isEditing;
              incomeTaxRatesStore.insertIncomeTaxRates();
            "
          />

          <!-- pagibigContributionTable.insertPhilhealthContributionTable(); -->

          <HistoryAuditButton></HistoryAuditButton>
          <!-- <q-btn icon="mdi-history" label="History" /> -->
          <!-- // NewHistory Button -->
        </div>
      </div>
      <!-- Conditional rendering of the table container -->
      <table border="1">
        <thead>
          <tr>
            <th>Over</th>
            <th>Not Over</th>
            <th>Basic Amount</th>
            <th>Additional Rate</th>
            <th>Excess Over</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) of incomeTaxRatesStore.tableData"
            :key="index"
          >
            <td>
              <q-input
                dense
                hide-bottom-space
                borderless
                input-class="tw-text-center"
                :disable="!incomeTaxRatesStore.isEditing"
                v-model="incomeTaxRatesStore.tableData[index].over"
              ></q-input>
            </td>
            <td>
              <q-input
                dense
                hide-bottom-space
                borderless
                input-class="tw-text-center"
                :disable="!incomeTaxRatesStore.isEditing"
                v-model="incomeTaxRatesStore.tableData[index].notOver"
              ></q-input>
            </td>
            <td>
              <q-input
                dense
                hide-bottom-space
                borderless
                input-class="tw-text-center"
                :disable="!incomeTaxRatesStore.isEditing"
                v-model="incomeTaxRatesStore.tableData[index].basicAmount"
              ></q-input>
            </td>
            <td>
              <q-input
                dense
                hide-bottom-space
                borderless
                input-class="tw-text-center"
                :disable="!incomeTaxRatesStore.isEditing"
                v-model="incomeTaxRatesStore.tableData[index].additionalRate"
              ></q-input>
            </td>
            <td>
              <q-input
                dense
                hide-bottom-space
                borderless
                input-class="tw-text-center"
                :disable="!incomeTaxRatesStore.isEditing"
                v-model="incomeTaxRatesStore.tableData[index].excessOver"
              ></q-input>
            </td>
          </tr>
        </tbody>
      </table>

      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
