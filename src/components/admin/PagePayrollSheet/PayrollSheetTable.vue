<script setup>
import { ref } from "vue";
// import { exportFile, useQuasar, date } from "quasar";
// import { format } from "date-fns";
import { usePayrollTableStore } from "stores/admin/payrollSheetPage/payrollTable";
import { usePayrollTableFormatterStore } from "stores/admin/payrollSheetPage/payrollTableFormatter";

import ViewPayrollRowButton from "components/admin/PagePayrollSheet/ViewPayrollRowButton.vue";
// import { useContributionStore } from "stores/admin/payrollSheetPage/contribution";

//FIXME: PROFILE IMAGE ATTENDANCE REPORT

//FIXME: https://stackoverflow.com/questions/70720370/display-value-derived-from-field-instead-of-field-itself-in-q-table-column
// BETTER CODE FOR DISPLAYING VALUE DERIVED FROM FIELD IN Q-TABLE COLUMN

const payrollTableStore = usePayrollTableStore();
const payrollTableFormatterStore = usePayrollTableFormatterStore();
// const contributionStore = useContributionStore();

const tableSearch = ref("");

const popupEdit = ref(false);

payrollTableStore.fetchAttendanceReports();

payrollTableFormatterStore.fetchSssContributionTable();
payrollTableFormatterStore.fetchPhilhealthContributionTable();
payrollTableFormatterStore.fetchPagibigContributionTable();

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

function totalDeductions(selectedRow) {
  return (
    (selectedRow.emp_sss_contrib_audit[0]?.amount ?? 0) +
    (selectedRow.emp_philhealth_contrib_audit[0]?.amount ?? 0) +
    (selectedRow.emp_pagibig_contrib_audit[0]?.amount ?? 0) +
    totalAmortization(selectedRow.government_loan_audit, 1) +
    totalAmortization(selectedRow.government_loan_audit, 2) +
    totalAmortization(selectedRow.government_loan_audit, 3)
  );
}

function twoDecimalWithoutRounding(num) {
  var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  return parseFloat(with2Decimals);
}

function totalNetPay(selectedRow) {
  try {
    return twoDecimalWithoutRounding(
      payrollTableFormatterStore.grossIncomeFormatter(
        selectedRow.rate_per_day,
        selectedRow.attendance
      ) - totalDeductions(selectedRow)
    );
  } catch (error) {
    console.error("Error calculating payroll:", error);
    return selectedRow; // or any default value you prefer
  }
}

function exportTableToCSV(tableId) {
  const table = document.getElementById(tableId);
  let csvContent = "";

  // Get the table headers and remove "arrow_upward"
  const headers = Array.from(table.querySelectorAll("th")).map((th) =>
    th.innerText.replace(/arrow_upward/g, "")
  );
  csvContent += headers.join(",") + "\n";

  // Get the table rows, excluding the last column
  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Skip the header row
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td"))
      .slice(0, -1)
      .map((td) => td.innerText); // Exclude the last cell
    csvContent += cells.join(",") + "\n";
  });

  // Get today's date in the desired format
  const today = new Date();
  const options = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = today
    .toLocaleDateString("en-US", options)
    .replace(",", "")
    .replace(/\s+/g, "-");

  // Create a link to download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Payroll-Sheet-Report-${formattedDate}.csv`);

  // Append the link to the body (not visible)
  document.body.appendChild(link);

  // Automatically click the link to trigger the download
  link.click();

  // Clean up: remove the link and revoke the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatToTwoDecimalPlaces(num) {
  // Multiply by 100, truncate to an integer, then divide by 100
  return Math.floor(num * 100) / 100;
}
</script>

<template>
  <q-table
    id="exportTable"
    class="tw-border tw-rounded-3xl tw-shadow-lg"
    flat
    bordered
    dense
    title="Attendance Report"
    :title-class="['tw-text-xl', 'tw-font-bold']"
    :columns="payrollTableStore.payrollColumns['columns']"
    :rows="payrollTableStore.getUnarchived"
    :rows-per-page-options="[0]"
    :filter="tableSearch"
    :filter-method="payrollTableStore.customFilter"
    separator="cell"
    row-key="name"
  >
    <template v-slot:top-right>
      <q-btn
        color="blue"
        icon-right="archive"
        label="Export to CSV"
        no-caps
        @click="exportTableToCSV('exportTable')"
        class="tw-mr-16"
      />
      <q-input
        borderless
        dense
        debounce="300"
        v-model="tableSearch"
        placeholder="Search Name"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:top-left>
      <q-select
        rounded
        standout
        use-input
        v-model="payrollTableStore.selectedDate"
        @update:model-value="payrollTableStore.fetchAttendanceReports()"
        :options="payrollTableStore.selectedDateOptions"
        :option-label="(opt) => opt.date_start + ' ' + opt.date_end"
        hide-selected
        fill-input
        hide-bottom-space
        input-debounce="0"
        class="!tw-pb-0"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td key="actions" class="tw-w-2/12" :props="props"
        ><ViewPayrollRowButton :rows="props.row"></ViewPayrollRowButton
      ></q-td>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="employeeId" :props="props" auto-width
          >{{ props.row.company_employee_id }}
        </q-td>
        <q-td key="employeeName" :props="props" auto-width>{{
          props.row.first_name + " " + props.row.last_name
        }}</q-td>
        <q-td key="noDaysWorked" :props="props" auto-width>
          {{
            (
              payrollTableFormatterStore.calculateTotalAttendanceHours(
                props.row.attendance
              ) / 8
            ).toFixed(4)
          }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.noDaysWorked"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="ratePerDay" :props="props" auto-width>
          {{ props.row.rate_per_day.toFixed(2) }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.ratePerDay"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="total" :props="props" auto-width>
          {{
            payrollTableFormatterStore.grossIncomeFormatter(
              props.row.rate_per_day,
              props.row.attendance
            )
          }}
        </q-td>
        <q-td key="sss" :props="props" auto-width>
          {{
            props.row.emp_sss_contrib_audit.length > 0
              ? props.row.emp_sss_contrib_audit[
                  props.row.emp_sss_contrib_audit.length - 1
                ].amount ?? 0
              : 0
          }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.sss"
            button
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="philHealth" :props="props" auto-width>
          {{
            props.row.emp_philhealth_contrib_audit.length > 0
              ? props.row.emp_philhealth_contrib_audit[
                  props.row.emp_philhealth_contrib_audit.length - 1
                ].amount ?? 0
              : 0
          }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.philHealth"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="pagIbig" :props="props" auto-width>
          {{
            props.row.emp_pagibig_contrib_audit.length > 0
              ? props.row.emp_pagibig_contrib_audit[
                  props.row.emp_pagibig_contrib_audit.length - 1
                ].amount ?? 0
              : 0
          }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.pagIbig"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="sssCalamityLoan" :props="props" auto-width>
          {{ totalAmortization(props.row.government_loan_audit, 2) }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.sssCalamityLoan"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="sssLoan" :props="props" auto-width>
          {{ totalAmortization(props.row.government_loan_audit, 1) }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.sssLoan"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="pagIbigLoan" :props="props" auto-width>
          {{ totalAmortization(props.row.government_loan_audit, 3) }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.pagIbigLoan"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <!-- <q-td key="VALE" :props="props" auto-width>
          {{ props.row.VALE }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.VALE"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="AR" :props="props" auto-width>
          {{ props.row.AR }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.AR"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td> -->
        <q-td key="NetPay" :props="props" auto-width>
          {{ totalNetPay(props.row) }}
        </q-td>
        <q-td key="overVale" :props="props" auto-width>
          {{ props.row.overVale }}
          <q-popup-edit
            :disable="!popupEdit"
            v-model.number="props.row.overVale"
            buttons
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="actions" auto-width :props="props"
          ><ViewPayrollRowButton :rows="props.row"></ViewPayrollRowButton
        ></q-td>
      </q-tr>
    </template>
  </q-table>
</template>
