<script setup>
import { ref } from "vue";
import { usePhilhealthContributionTable } from "stores/admin/settingsPage/philhealthContributionTable";
// import HistoryAuditButton from "components/admin/PageSettings/SSS/HistoryAuditButton.vue";

const philhealthContributionTable = usePhilhealthContributionTable();

const viewPrompt = ref(false);

function openmodel() {
  viewPrompt.value = true;
}

philhealthContributionTable.fetchPhilhealthContributionTable();
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
  <q-btn label="PhilHealth Contribution Table" @click="openmodel()" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-auto !tw-max-w-none tw-bg-white tw-p-6">
      <div
        class="tw-text-3xl tw-font-extrabold tw-pb-3 tw-flex tw-justify-between"
      >
        <div>Philhealth Contribution</div>
        <q-btn>Edit</q-btn>
        <q-btn>History</q-btn>
      </div>
      <div>
        Last Updated:
        {{
          philhealthContributionTable.philhealthContributionHistory[0][
            "change_date"
          ]
        }}
      </div>
      <div>
        Premium Rate:
        {{
          philhealthContributionTable.philhealthContributionHistory[0]["data"]
            .value
        }}%
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
