<script setup>
import { useSssHistoryButtonStore } from "stores/admin/settingsPage/History/sssHistoryButton";

const sssHistoryButtonStore = useSssHistoryButtonStore();

sssHistoryButtonStore.fetchSssHistory();
</script>

<template>
  <q-btn
    icon="mdi-history"
    label="History"
    @click="sssHistoryButtonStore.triggerPrompt"
  />
  <q-dialog v-model="sssHistoryButtonStore.viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-9/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-table
        class="tw-border tw-rounded-3xl tw-shadow-lg"
        flat
        bordered
        dense
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :filter="tableSearch"
        :rows-per-page-options="[0]"
        separator="cell"
        row-key="audit_id"
        :rows="sssHistoryButtonStore.historyDataRows"
        :columns="sssHistoryButtonStore.historyDataColumns"
      >
      </q-table>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<style scoped>
.tw-py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.tw-px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.tw-ml-4 {
  margin-left: 1rem;
}
.tw-flex {
  display: flex;
}
.tw-items-center {
  align-items: center;
}
</style>
