<script setup>
import { ref } from "vue";
import { usePagibigTableStore } from "stores/admin/reportsPage/pagibigTable";

//FIXME: PROFILE IMAGE ATTENDANCE REPORT

//FIXME: https://stackoverflow.com/questions/70720370/display-value-derived-from-field-instead-of-field-itself-in-q-table-column
// BETTER CODE FOR DISPLAYING VALUE DERIVED FROM FIELD IN Q-TABLE COLUMN

const pagibigTableStore = usePagibigTableStore();

const tableSearch = ref("");

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
    const cells = Array.from(row.querySelectorAll("td")).map(
      (td) => td.innerText
    );
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
  link.setAttribute("download", `Pag-IBIG-Report-${formattedDate}.csv`);

  // Append the link to the body (not visible)
  document.body.appendChild(link);

  // Automatically click the link to trigger the download
  link.click();

  // Clean up: remove the link and revoke the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

pagibigTableStore.fetchEmployeeReports();
</script>

<!-- 
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse" -->

<template>
  <q-table
    id="pagibig-table"
    class="tw-border tw-rounded-3xl tw-shadow-lg"
    flat
    bordered
    dense
    title="Attendance Report"
    :title-class="['tw-text-xl', 'tw-font-bold']"
    :filter="tableSearch"
    :columns="pagibigTableStore.columns"
    :rows="pagibigTableStore.pagibigAudit"
    :rows-per-page-options="[0]"
    separator="cell"
    row-key="name"
  >
    <template v-slot:top-right>
      <q-btn
        color="blue"
        icon-right="archive"
        label="Export to CSV"
        no-caps
        @click="exportTableToCSV('pagibig-table')"
        class="tw-mr-16"
    /></template>
    <template v-slot:top-left>
      <div class="tw-text-xl, tw-font-bold">Pag-IBIG Report</div>
      <div class="tw-w-3"></div>
      <q-select
        rounded
        standout
        v-model="pagibigTableStore.selectedDate"
        @update:model-value="pagibigTableStore.fetchEmployeeReports()"
        use-input
        hide-selected
        fill-input
        hide-bottom-space
        input-debounce="0"
        :options="pagibigTableStore.selectedDateOptions"
        :option-label="(opt) => opt.date_start + ' ' + opt.date_end"
        class="!tw-pb-0"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select></template
    >

    <template v-slot:bottom-row>
      <q-tr>
        <q-td colspan="3"></q-td>
        <q-td class="tw-text-center">
          Total Employee Share:<br />
          {{ pagibigTableStore.getTotalEmployeeShare }}
        </q-td>
        <q-td class="tw-text-center">
          Total Employer Share:<br />
          {{ pagibigTableStore.getTotalEmployerShare }}
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom>
      <!-- <div class="tw-flex tw-items-center tw-ml-5">
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#4ade80]"></div>
          <div class="tw-ml-2">Present</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#f87171]"></div>
          <div class="tw-ml-2">Absent</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#fb923c]"></div>
          <div class="tw-ml-2">Late</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#ec4899]"></div>
          <div class="tw-ml-2">Undertime</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#3b82f6]"></div>
          <div class="tw-ml-2">Leave</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#fef08a]"></div>
          <div class="tw-ml-2">Holiday</div>
        </div>
      </div> -->
    </template>
  </q-table>
</template>
