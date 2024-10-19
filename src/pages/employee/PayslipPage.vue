<script setup>
import { usePageHeader } from "stores/pageHeader";
import { usePayslipStore } from "stores/employee/payslipPage/fetchPayslipContents";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Payslip";

const payslipStore = usePayslipStore();

payslipStore.fetchAttendanceReports();
</script>

<template>
  <div>
    <h1>TESTING</h1>
    <div class="noScreen">
      <div class="tw-flex tw-flex-row tw-justify-between tw-mb-10">
        <div class="tw-flex tw-flex-row">
          <img class="tw-size-28 tw-mt-3" src="src/assets/logo.png" />
          <div
            class="tw-text-1xl tw-w-1/6 tw-content-center tw-ml-2 tw-text-nowrap tw-mt-3"
          >
            A1 Agro Fertilizer and<br />
            Chemical Supply <br /><br /><text class="tw-text-nowrap"
              >+63 123 456 7890</text
            >
          </div>
        </div>
        <div>
          <div class="tw-font-bold tw-text-3xl tw-text-right">Payslip</div>
          <div class="tw-text-lg tw-text-right">#123123</div>
        </div>
      </div>
      <div class="tw-pl-10">
        <div class="tw-py-2">{{ model }}</div>
        <div class="tw-flex tw-flex-row">
          <div class="tw-pr-8">MARAAN, ARNIENO P.</div>
          <div>20190149350</div>
        </div>
      </div>
    </div>
    <table
      class="tw-rounded-3xl tw-text-nowrap tw-w-6/12 tw-mx-auto tw-mb-3 tw-bg-white tw-shadow-lg noPrint"
    >
      <tr class="tw-justify-evenly">
        <td>
          <div>
            <q-select
              rounded
              standout
              use-input
              v-model="payslipStore.selectedDate"
              @update:model-value="payslipStore.fetchAttendanceReports()"
              :options="payslipStore.selectedDateOptions"
              :option-label="(opt) => opt.date_start + ' ' + opt.date_end"
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              class="!tw-pb-0"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </td>
        <td class="tw-text-center"></td>
        <td class="tw-text-end tw-pr-3">
          {{ payslipStore.rows[0].last_name }},
          {{ payslipStore.rows[0].first_name }}
          {{ payslipStore.rows[0].middle_name }}
        </td>
      </tr>
    </table>
    <table
      class="tw-rounded-3xl tw-text-nowrap tw-w-6/12 tw-mx-auto tw-mb-3 tw-bg-white tw-border-collapse tw-shadow-lg"
    >
      <tr>
        <td
          colspan="3"
          class="tw-p-3 tw-font-extrabold tw-text-center tw-border-b tw-border-gray-400"
        >
          Gross Income
        </td>
        <td
          colspan="3"
          class="tw-p-3 tw-font-extrabold tw-text-center tw-border-b tw-border-l tw-border-gray-400"
        >
          Deductions
        </td>
      </tr>
      <tr>
        <td colspan="1" class="tw-p-3"><div>Rate Per Day:</div></td>
        <td colspan="1" class="tw-p-3">
          <div>₱{{ payslipStore.rows[0].rate_per_day }}</div>
        </td>
        <td colspan="1" class="tw-border-r tw-border-gray-400"></td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>SSS Contribution:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>₱FORMATTER</div></td>
      </tr>
      <tr>
        <td colspan="1" class="tw-p-3"><div>Days Worked:</div></td>
        <td colspan="1" class="tw-p-3"><div>TODO:</div></td>
        <td class="tw-border-r tw-border-gray-400">TODO:</td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>PhilHealth Contribution:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>₱FORMATTER</div></td>
      </tr>
      <tr>
        <td class="tw-p-3"><div>Absences:</div></td>
        <td colspan="2" class="tw-p-3 tw-border-r tw-border-gray-400">
          <div>x3</div>
        </td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>Pag-IBIG Contribution:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>₱FORMATTER</div></td>
      </tr>
      <tr>
        <td colspan="3"><br /></td>
        <td colspan="3" class="tw-border-l tw-border-gray-400"><br /></td>
      </tr>
      <tr>
        <td colspan="3" class="tw-p-3 tw-border-gray-400"><div></div></td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>SSS Calamity Loan:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>---</div></td>
      </tr>
      <tr>
        <td colspan="3" class="tw-p-3 tw-border-gray-400"><div></div></td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>SSS Loan:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>---</div></td>
      </tr>
      <tr>
        <td colspan="3" class="tw-p-3 tw-border-gray-400"><div></div></td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          <div>Pag-IBIG Loan:</div>
        </td>
        <td class="tw-p-3 tw-border-gray-400"><div>---</div></td>
      </tr>
      <tr>
        <td colspan="3"><br /></td>
        <td colspan="3" class="tw-border-l tw-border-gray-400"><br /></td>
      </tr>
      <tr>
        <td
          colspan="2"
          class="tw-border-spacing-x-3 tw-p-3 tw-border-b tw-border-gray-400"
        >
          Total Gross Income:
        </td>
        <td class="tw-p-3 tw-border-b tw-border-gray-400">₱5,112.00</td>
        <td
          colspan="2"
          class="tw-p-3 tw-border-b tw-border-l tw-border-gray-400"
        >
          Total Deductions:
        </td>
        <td class="tw-p-3 tw-border-b tw-border-gray-400">₱4780</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td colspan="2" class="tw-p-3 tw-border-l tw-border-gray-400">
          Total Net Pay:
        </td>
        <td class="tw-p-3">₱332.00</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
/* https://stackoverflow.com/questions/468881/print-div-id-printarea-div-only */
.noScreen {
  display: none;
}

@media print {
  body {
    visibility: hidden;
  }
  .noScreen {
    display: block;
  }

  #section-to-print {
    transform: scale(0.6);
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    top: 0;
    transform-origin: top left;
    /* transform-origin: top left; //IMPORTANT  */
  }
}
</style>
