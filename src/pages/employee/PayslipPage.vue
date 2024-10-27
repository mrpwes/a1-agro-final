<script setup>
import { usePageHeader } from "stores/pageHeader";
import { usePayslipStore } from "stores/employee/payslipPage/fetchPayslipContents";
import { usePayslipFormatterStore } from "stores/employee/payslipPage/payslipFormatter";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Payslip";

const payslipStore = usePayslipStore();
const payslipFormatterStore = usePayslipFormatterStore();

payslipStore.fetchAttendanceReports();

function twoDecimalWithoutRounding(num) {
  var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  return parseFloat(with2Decimals);
}

function totalDeductions(selectedRow) {
  return (
    (selectedRow.emp_sss_contrib_audit[0]?.amount ?? 0) +
    (selectedRow.emp_philhealth_contrib_audit[0]?.amount ?? 0) +
    (selectedRow.emp_pagibig_contrib_audit[0]?.amount ?? 0) +
    (selectedRow.sssCalamityLoan ?? 0) +
    (selectedRow.sssLoan ?? 0) +
    (selectedRow.pagIbigLoan ?? 0)
  );
}

function totalNetPay(selectedRow) {
  try {
    return twoDecimalWithoutRounding(
      payslipFormatterStore.grossIncomeFormatter(
        selectedRow.rate_per_day,
        selectedRow.attendance
      ) - totalDeductions(selectedRow)
    );
  } catch (error) {
    console.error("Error calculating payroll:", error);
    return selectedRow; // or any default value you prefer
  }
}
</script>

<template>
  <div>
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
    <q-markup-table
      separator="cell"
      class="tw-rounded-3xl tw-w-6/12 tw-mx-auto tw-mb-3 tw-bg-white tw-shadow-lg"
    >
      <thead>
        <tr>
          <th colspan="3">
            <div>Gross Income</div>
          </th>
          <th colspan="3">
            <div>Deductions</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="1">
            <div>Rate Per Day:</div>
          </td>
          <td colspan="1">
            <div>₱{{ payslipStore.rows[0].rate_per_day }}</div>
          </td>
          <td colspan="1"></td>
          <td colspan="2">
            <div>SSS Contribution:</div>
          </td>
          <td>
            <div>
              ₱
              {{
                payslipStore.rows[0]?.emp_sss_contrib_audit?.[
                  payslipStore.rows[0].emp_sss_contrib_audit.length - 1
                ]?.amount ?? 0
              }}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div>Days Worked:</div>
          </td>
          <td colspan="1">
            <div>
              {{
                payslipFormatterStore.noDaysWorkedFormatter(
                  payslipStore.rows[0].attendance
                )
              }}
            </div>
          </td>
          <td>
            ₱{{
              payslipFormatterStore.grossIncomeFormatter(
                payslipStore.rows[0].rate_per_day,
                payslipStore.rows[0].attendance
              )
            }}
          </td>
          <td colspan="2">
            <div>PhilHealth Contribution:</div>
          </td>
          <td>
            <div>
              ₱
              {{
                payslipStore.rows[0]?.emp_philhealth_contrib_audit?.[
                  payslipStore.rows[0].emp_philhealth_contrib_audit.length - 1
                ]?.amount ?? 0
              }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div></div>
          </td>
          <td colspan="2">
            <div></div>
          </td>
          <td colspan="2">
            <div>Pag-IBIG Contribution:</div>
          </td>
          <td>
            <div>
              ₱
              {{
                payslipStore.rows[0]?.emp_pagibig_contrib_audit?.[
                  payslipStore.rows[0].emp_pagibig_contrib_audit.length - 1
                ]?.amount ?? 0
              }}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3"><br /></td>
          <td colspan="3"><br /></td>
        </tr>
        <tr>
          <td colspan="3">
            <div></div>
          </td>
          <td colspan="2">
            <div>SSS Calamity Loan:</div>
          </td>
          <td>
            <div>---</div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div></div>
          </td>
          <td colspan="2">
            <div>SSS Loan:</div>
          </td>
          <td>
            <div>---</div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div></div>
          </td>
          <td colspan="2">
            <div>Pag-IBIG Loan:</div>
          </td>
          <td>
            <div>---</div>
          </td>
        </tr>
        <tr>
          <td colspan="3"><br /></td>
          <td colspan="3"><br /></td>
        </tr>
        <tr>
          <td colspan="2">Total Gross Income:</td>
          <td>
            ₱{{
              payslipFormatterStore.grossIncomeFormatter(
                payslipStore.rows[0].rate_per_day,
                payslipStore.rows[0].attendance
              )
            }}
          </td>
          <td colspan="2">Total Deductions:</td>
          <td>₱{{ totalDeductions(payslipStore.rows[0]) }}</td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td colspan="2">Total Net Pay:</td>
          <td>₱{{ totalNetPay(payslipStore.rows[0]) }}</td>
        </tr>
      </tbody>
    </q-markup-table>
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
