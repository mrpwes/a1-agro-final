<script setup>
import { ref } from "vue";
// import { exportFile, useQuasar, date } from "quasar";
import { usePayrollTableStore } from "stores/admin/payrollSheetPage/payrollTable";
import { usePayrollTableFormatterStore } from "stores/admin/payrollSheetPage/payrollTableFormatter";

// import { format } from "date-fns";

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
// payrollTableStore.getEmployeeNoAttendance();
// contributionStore.getContributions();

// function getContributionTable(row) {
//   return
// }

// function getContributionBasedOnSelectedDate(row) {
//   if (row == 0) {
//     return 0;
//   }
//   console.log(row);
// }
</script>

<template>
  <q-table
    class="tw-border tw-rounded-3xl tw-shadow-lg"
    flat
    bordered
    dense
    title="Attendance Report"
    :title-class="['tw-text-xl', 'tw-font-bold']"
    :filter="tableSearch"
    :columns="payrollTableStore.payrollColumns['columns']"
    :rows="payrollTableStore.rows"
    :rows-per-page-options="[0]"
    separator="cell"
    row-key="name"
  >
    <!-- <template v-slot:top-right>
      <q-toggle
        v-model="popupEdit"
        label="Edit"
        color="blue"
        class="tw-mr-16"
      />
    </template> -->
    <template v-slot:top-left>
      <q-select
        filled
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
            payrollTableFormatterStore.noDaysWorkedFormatter(
              props.row.attendance
            )
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
          {{ props.row.sssCalamityLoan }}
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
          {{ props.row.sssLoan }}
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
          {{ props.row.pagIbigLoan }}
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
          {{
            (
              props.row.noDaysWorked * props.row.ratePerDay -
              props.row.sss -
              props.row.philHealth -
              props.row.pagIbig -
              props.row.sssCalamityLoan -
              props.row.sssLoan -
              props.row.pagIbigLoan -
              props.row.VALE -
              props.row.AR
            ).toFixed(2)
          }}
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
