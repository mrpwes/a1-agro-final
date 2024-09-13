<script setup>
import { ref } from "vue";
import { useViewLoan } from "stores/admin/loanListPage/viewLoan";

const storeViewLoan = useViewLoan();

defineProps(["rows"]);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
  // console.table(selectedRow.value);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
          Loan ID - {{ selectedRow.id }}
          <br />
          <span class="tw-text-base tw-font-normal tw-text-gray-500">
            {{ selectedRow.request_type.request_type_name }} -
            {{
              selectedRow.vale && selectedRow.vale.length > 0
                ? selectedRow.vale[0].id
                : selectedRow.partial_to_ar[0].id
            }}
          </span>
        </div>
        <table class="tw-w-full tw-table-auto tw-border-collapse">
          <tr>
            <td>
              Recipient: {{ selectedRow.employee.last_name }},
              {{ selectedRow.employee.first_name }} - CONTACTNUMBERTODO!
            </td>
            <td>
              Issuer:
              {{ selectedRow.request_confirmation.employee.last_name }},
              {{ selectedRow.request_confirmation.employee.first_name }}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              Amount:
              {{
                selectedRow.request_type.request_type_name === "VALE"
                  ? numberWithCommas(selectedRow.vale[0].amount)
                  : numberWithCommas(selectedRow.partial_to_ar[0].amount)
              }}
            </td>
          </tr>
        </table>
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          :class="
            selectedRow.vale && selectedRow.vale.length > 0
              ? selectedRow.vale[0].is_archive
                ? 'tw-bg-green-400'
                : 'tw-bg-red-400'
              : selectedRow.partial_to_ar[0].is_archive
              ? 'tw-bg-green-400'
              : 'tw-bg-red-400'
          "
          icon="mdi-archive"
          :label="
            selectedRow.vale && selectedRow.vale.length > 0
              ? selectedRow.vale[0].is_archive
                ? 'Unarchive'
                : 'Archive'
              : selectedRow.partial_to_ar[0].is_archive
              ? 'Unarchive'
              : 'Archive'
          "
          @click="
            storeViewLoan.archivedLoan(
              selectedRow.vale && selectedRow.vale.length > 0
                ? selectedRow.vale[0].id
                : selectedRow.partial_to_ar[0].id,
              selectedRow.vale && selectedRow.vale.length > 0
                ? 'vale'
                : 'partial_to_ar',
              selectedRow.vale && selectedRow.vale.length > 0
                ? selectedRow.vale[0].is_archive
                : selectedRow.partial_to_ar[0].is_archive,
              selectedRow.id,
              selectedRow.is_archive,
              selectedRow.request_confirmation.id,
              selectedRow.request_confirmation.is_archive
            )
          "
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
