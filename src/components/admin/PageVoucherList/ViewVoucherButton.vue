<script setup>
import { ref } from "vue";
import { useViewVoucherStore } from "src/stores/admin/voucherListPage/viewVoucher";

const storeViewVoucher = useViewVoucherStore();
defineProps(["rows"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
}

//FIXME: CONTACT NUMBER ADD MORE
</script>

<template>
  <q-btn
    style="flex-wrap: nowrap !important"
    icon="visibility"
    label="VIEW"
    @click="openmodel(rows)"
  />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div id="section-to-print">
        <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
          Voucher ID {{ selectedRow.id }} &nbsp; &nbsp; &nbsp; &nbsp;
          {{ selectedRow.employeeName }}
        </div>
        <table class="tw-w-full tw-table-auto tw-border-collapse">
          <tr>
            <td>
              Recipient:
              {{
                selectedRow.recipient.last_name +
                " " +
                selectedRow.recipient.first_name
              }}
            </td>
            <td>
              Issuer:
              {{
                selectedRow.recipient.last_name +
                " " +
                selectedRow.recipient.first_name
              }}
            </td>
            <td>{{ selectedRow.date }}</td>
          </tr>

          <tr>
            <td>Description: {{ selectedRow.description }}</td>
          </tr>
          <tr>
            <td>Amount: {{ selectedRow.amount }}</td>
          </tr>
        </table>
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          :class="selectedRow.isArchive ? 'tw-bg-green-400' : 'tw-bg-red-400'"
          icon="mdi-archive"
          :label="selectedRow.isArchive ? 'Unarchive' : 'Archive'"
          @click="storeViewVoucher.archivedVoucher(selectedRow.id)"
          v-close-popup
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<style>
td {
  padding: 5px;
}
</style>
