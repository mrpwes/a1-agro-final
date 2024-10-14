<script setup>
import { ref } from "vue";
import { usePagibigContributionTable } from "stores/admin/settingsPage/pagibigContributionTable";
import HistoryAuditButton from "components/admin/PageSettings/Pagibig/HistoryAuditButton.vue";

const pagibigContributionTable = usePagibigContributionTable();

const viewPrompt = ref(false);

function openmodel() {
  viewPrompt.value = true;
}

function logTableData() {
  console.log(JSON.stringify(pagibigContributionTable.tableData, null, 2)); // Log the table data in JSON format
}

logTableData();

pagibigContributionTable.fetchPagibigContributionTable();
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>

<template>
  <q-btn
    label="PhilHealth Contribution Table"
    @click="
      openmodel();
      pagibigContributionTable.fetchPagibigContributionTable();
    "
  />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-5/12 !tw-max-w-none tw-bg-white tw-p-6">
      <div
        class="tw-text-3xl tw-font-extrabold tw-pb-3 tw-flex tw-justify-between"
      >
        <div>Pag-IBIG Contribution</div>
        <div class="tw-flex tw-justify-end tw-mb-5">
          <div>
            <!-- <q-btn
              v-if="philhealthContributionTable.isEditing == false"
              flat
              class="tw-bg-green-400 tw-mr-4"
              :icon="philhealthContributionTable.isEditing ? 'save' : 'edit'"
              label="Edit"
              @click="
                philhealthContributionTable.isEditing =
                  !philhealthContributionTable.isEditing
              "
            /> -->

            <HistoryAuditButton></HistoryAuditButton>
          </div>
        </div>
      </div>
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Monthly Compensation</th>
              <th>Employee</th>
              <th>Employer Contribution</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) of pagibigContributionTable.tableData"
              :key="index"
            >
              <td>
                <div v-if="pagibigContributionTable.isEditing == false">
                  {{ row.monthly_compensation }}
                </div>
                <q-input
                  v-if="pagibigContributionTable.isEditing == true"
                  v-model="
                    pagibigContributionTable.tableData[index]
                      .monthly_compensation
                  "
                ></q-input>
              </td>
              <td>
                <div v-if="pagibigContributionTable.isEditing == false">
                  {{ row.employee_rate }}
                </div>
                <q-input
                  v-if="pagibigContributionTable.isEditing == true"
                  v-model="
                    pagibigContributionTable.tableData[index].employee_rate
                  "
                ></q-input>
              </td>
              <td>
                <div v-if="pagibigContributionTable.isEditing == false">
                  {{ row.employer_rate }}
                </div>
                <q-input
                  v-if="pagibigContributionTable.isEditing == true"
                  v-model="
                    pagibigContributionTable.tableData[index].employer_rate
                  "
                ></q-input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div
        v-if="philhealthContributionTable.isEditing == true"
        class="tw-mt-4 tw-w-4/12"
      >
        <q-input
          outlined
          v-model="philhealthContributionTable.philHealthRateModel"
          label="Premium Rate"
        />
        <q-btn
          class="tw-mt-3 tw-bg-green-400"
          label="Change Rate"
          @click="
            philhealthContributionTable.insertPhilhealthContributionTable();
            philhealthHistoryButtonStore.fetchPhilhealthHistory();
          "
        />
      </div> -->
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn
          v-if="pagibigContributionTable.isEditing == false"
          flat
          class="tw-bg-green-400 tw-mr-4"
          :icon="pagibigContributionTable.isEditing ? 'save' : 'edit'"
          label="Edit"
          @click="
            pagibigContributionTable.isEditing =
              !pagibigContributionTable.isEditing
          "
        />
        <q-btn
          v-else
          flat
          class="tw-bg-green-400 tw-mr-4"
          :icon="pagibigContributionTable.isEditing ? 'save' : 'edit'"
          label="Save"
          @click="
            pagibigContributionTable.isEditing =
              !pagibigContributionTable.isEditing;
            pagibigContributionTable.insertPhilhealthContributionTable();
          "
        />
        <q-btn
          flat
          label="Cancel"
          v-close-popup
          @click="pagibigContributionTable.isEditing = false"
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
