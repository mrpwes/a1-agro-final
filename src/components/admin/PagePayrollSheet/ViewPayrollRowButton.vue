<script setup>
import { ref } from "vue";
// import { date } from "quasar";
import { Notify } from "quasar";

import { usePayrollTableFormatterStore } from "stores/admin/payrollSheetPage/payrollTableFormatter";

const payrollTableFormatterStore = usePayrollTableFormatterStore();

defineProps(["rows"]);
const counterSMS = ref(0);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
}

function sendSMS() {
  counterSMS.value += 1;
  Notify.create({
    icon: "done",
    color: "positive",
    message: "SMS Sent!",
  });
}

function totalAmortization(data, governmentLoanID) {
  // Filter the data for entries with government_loan_type_id = 1
  const filteredData = data.filter(
    (item) => item.government_loan_type_id === governmentLoanID
  );

  // Sum the amortization values of the filtered entries
  const totalAmortization = filteredData.reduce(
    (total, item) => total + item.amortization,
    0
  );

  return totalAmortization;
}

function totalDeductions() {
  return (
    (selectedRow.value.emp_sss_contrib_audit[
      selectedRow.value.emp_sss_contrib_audit.length - 1
    ]?.amount ?? 0) +
    (selectedRow.value.emp_philhealth_contrib_audit[
      selectedRow.value.emp_philhealth_contrib_audit.length - 1
    ]?.amount ?? 0) +
    (selectedRow.value.emp_pagibig_contrib_audit[
      selectedRow.value.emp_pagibig_contrib_audit.length - 1
    ]?.amount ?? 0) +
    totalAmortization(selectedRow.value.government_loan_audit, 1) +
    totalAmortization(selectedRow.value.government_loan_audit, 2) +
    totalAmortization(selectedRow.value.government_loan_audit, 3)
  );
}

function twoDecimalWithoutRounding(num) {
  var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  return parseFloat(with2Decimals);
}

function totalNetPay() {
  try {
    return twoDecimalWithoutRounding(
      payrollTableFormatterStore.grossIncomeFormatter(
        selectedRow.value.rate_per_day,
        selectedRow.value.attendance
      ) - totalDeductions()
    );
  } catch (error) {
    console.error("Error calculating payroll:", error);
    return 0; // or any default value you prefer
  }
}

//FIXME: CONTACT NUMBER ADD MORE
</script>

<template>
  <q-btn unelevated padding="none" icon="visibility" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div id="section-to-print">
        <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
          {{
            selectedRow.company_employee_id +
            " - " +
            selectedRow.first_name +
            " " +
            selectedRow.last_name
          }}
        </div>
        <q-markup-table separator="cell" flat bordered dense>
          <thead>
            <tr>
              <th class="tw-text-center tw-font-bold tw-border" colspan="3">
                Gross
              </th>
              <th class="tw-text-center tw-font-bold tw-border" colspan="2">
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tw-border">Rate Per Day:</td>
              <td class="tw-border">{{ selectedRow.rate_per_day }}</td>
              <td class="tw-border"></td>
              <td class="tw-border">SSS Contribution:</td>
              <td class="tw-border tw-flex tw-justify-between">
                <div class="tw-text-gray-500">
                  {{
                    payrollTableFormatterStore.findSSSRange(
                      selectedRow.rate_per_day * 30
                    )
                  }}
                </div>
                <div>
                  {{
                    selectedRow.emp_sss_contrib_audit &&
                    selectedRow.emp_sss_contrib_audit.length > 0
                      ? selectedRow.emp_sss_contrib_audit[
                          selectedRow.emp_sss_contrib_audit.length - 1
                        ].amount ?? 0
                      : 0
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="tw-border">Day Worked:</td>
              <td class="tw-border">
                {{
                  payrollTableFormatterStore.noDaysWorkedFormatter(
                    selectedRow.attendance
                  )
                }}
              </td>
              <td class="tw-border">
                {{
                  payrollTableFormatterStore.grossIncomeFormatter(
                    selectedRow.rate_per_day,
                    selectedRow.attendance
                  )
                }}
              </td>
              <td class="tw-border">PhilHealth Contribution:</td>
              <!-- <td class="tw-border">
                {{ selectedRow.emp_philhealth_contrib_audit[0]?.amount ?? 0 }}
              </td> -->
              <td class="tw-border tw-flex tw-justify-between">
                <div class="tw-text-gray-500">
                  {{
                    (payrollTableFormatterStore.philhealthContributionRate /
                      2 /
                      100) *
                    (selectedRow.rate_per_day * 30)
                  }}
                </div>
                <div>
                  {{
                    selectedRow.emp_philhealth_contrib_audit[
                      selectedRow.emp_philhealth_contrib_audit.length - 1
                    ]?.amount ?? 0
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">Pag-IBIG Contribution:</td>
              <td class="tw-border tw-flex tw-justify-between">
                <div class="tw-text-gray-500">
                  {{
                    payrollTableFormatterStore.calculatePagibigContribution(
                      selectedRow.rate_per_day
                    )
                  }}
                </div>
                <div>
                  {{
                    selectedRow.emp_pagibig_contrib_audit[
                      selectedRow.emp_pagibig_contrib_audit.length - 1
                    ]?.amount ?? 0
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border">&nbsp;</td>
              <td class="tw-border"></td>
              <td class="tw-border"></td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">SSS Calamity Loan:</td>
              <td class="tw-border tw-text-end">
                {{ totalAmortization(selectedRow.government_loan_audit, 2) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">SSS Salary Loan:</td>
              <td class="tw-border tw-text-end">
                {{ totalAmortization(selectedRow.government_loan_audit, 1) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">Pag-IBIG Loan:</td>
              <td class="tw-border tw-text-end">
                {{ totalAmortization(selectedRow.government_loan_audit, 3) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border">&nbsp;</td>
              <td class="tw-border"></td>
              <td class="tw-border"></td>
            </tr>
            <tr>
              <td colspan="2" class="tw-border">Total Gross Income:</td>
              <td class="tw-border">
                {{
                  payrollTableFormatterStore.grossIncomeFormatter(
                    selectedRow.rate_per_day,
                    selectedRow.attendance
                  )
                }}
              </td>
              <td class="tw-border">Total Deductions:</td>
              <td class="tw-border tw-justify-end tw-text-end">
                {{ totalDeductions() }}
              </td>
            </tr>
            <tr>
              <td class="tw-border" colspan="3"></td>
              <td class="tw-border">Total Net Pay:</td>
              <td class="tw-border tw-text-end">
                {{ totalNetPay() }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          class="tw-bg-green-400"
          icon="mdi-message"
          :label="counterSMS === 0 ? 'SEND SMS' : 'SEND SMS ' + counterSMS"
          :onclick="sendSMS"
        />
        <q-btn
          flat
          class="tw-bg-green-400"
          icon="print"
          label="print payslip"
          onclick="window.print()"
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<style>
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
