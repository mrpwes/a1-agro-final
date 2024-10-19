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

async function refresh() {
  selectedRow.value = await storeViewLoan.getSelectedLoan(selectedRow.value.id);
  storeViewLoan.getLoanList();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatAmountBalance(row) {
  return numberWithCommas(row[0].amount + "/" + row[0].balance);
}

function formatAmount(row) {
  return numberWithCommas(row[0].amount);
}

function formatBalance(row) {
  return numberWithCommas(row[0].balance);
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
            {{ selectedRow.request_type_id.request_type_name }} ID -
            {{
              selectedRow.vale[0]
                ? selectedRow.vale[0].id
                : selectedRow.partial_to_ar[0].id
            }}
          </span>
        </div>
        <table class="tw-w-full tw-table-auto tw-border-collapse">
          <tr>
            <td>
              Recipient:
              {{ selectedRow.request_employee_id.company_employee_id }} -
              {{ selectedRow.request_employee_id.last_name }},
              {{ selectedRow.request_employee_id.first_name }}
            </td>
            <td>
              Issuer:
              {{ selectedRow.admin_employee_id.company_employee_id }} -
              {{ selectedRow.admin_employee_id.last_name }},
              {{ selectedRow.admin_employee_id.first_name }}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              Amount:
              {{
                selectedRow.vale[0]
                  ? formatAmount(selectedRow.vale)
                  : formatAmount(selectedRow.partial_to_ar)
              }}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              Balance:
              {{
                selectedRow.vale[0]
                  ? formatBalance(selectedRow.vale)
                  : formatBalance(selectedRow.partial_to_ar)
              }}
            </td>
          </tr>
          <tr>
            <td></td>

            <td v-if="storeViewLoan.paymentButton === true">
              <q-input v-model="storeViewLoan.payment"> </q-input>
            </td>
          </tr>
        </table>
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn
          flat
          label="Cancel"
          v-close-popup
          @click="storeViewLoan.paymentButton = false"
        />
        <q-btn
          v-if="storeViewLoan.paymentButton === false"
          label="Payment"
          @click="storeViewLoan.paymentButton = true"
        />
        <q-btn
          v-else
          label="Save"
          @click="
            storeViewLoan.paymentButton = false;
            storeViewLoan.insertPayment(selectedRow).then(() => {
              refresh();
            });
          "
        />
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
            selectedRow.is_archive
              ? storeViewLoan.unarchivedLoan(
                  selectedRow.id,
                  selectedRow.request_type_id.id,
                  selectedRow.vale[0]
                    ? selectedRow.vale[0].id
                    : selectedRow.partial_to_ar[0].id
                )
              : storeViewLoan.archivedLoan(
                  selectedRow.id,
                  selectedRow.request_type_id.id,
                  selectedRow.vale[0]
                    ? selectedRow.vale[0].id
                    : selectedRow.partial_to_ar[0].id
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
