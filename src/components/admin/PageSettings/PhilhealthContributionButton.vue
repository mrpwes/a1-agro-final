<script setup>
import { ref } from "vue";
import { usePhilhealthContributionTable } from "stores/admin/settingsPage/philhealthContributionTable";
import HistoryAuditButton from "components/admin/PageSettings/Philhealth/HistoryAuditButton.vue";
import { usePhilhealthHistoryButtonStore } from "stores/admin/settingsPage/History/philhealthHistoryButton";

const philhealthHistoryButtonStore = usePhilhealthHistoryButtonStore();

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
    <div class="!tw-h-min !tw-w-5/12 !tw-max-w-none tw-bg-white tw-p-6">
      <div
        class="tw-text-3xl tw-font-extrabold tw-pb-3 tw-flex tw-justify-between"
      >
        <div>Philhealth Contribution</div>
        <div class="tw-flex tw-justify-end tw-mb-5">
          <div>
            <q-btn
              v-if="philhealthContributionTable.isEditing == false"
              flat
              class="tw-bg-green-400 tw-mr-4"
              :icon="philhealthContributionTable.isEditing ? 'save' : 'edit'"
              label="Edit"
              @click="
                philhealthContributionTable.isEditing =
                  !philhealthContributionTable.isEditing
              "
            />

            <HistoryAuditButton></HistoryAuditButton>
            <!-- <q-btn icon="mdi-history" label="History" /> -->
            <!-- // NewHistory Button -->
          </div>
        </div>
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
      <div
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
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn
          flat
          label="Cancel"
          v-close-popup
          @click="
            philhealthContributionTable.isEditing = false;
            philhealthContributionTable.philHealthRateModel = null;
          "
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
