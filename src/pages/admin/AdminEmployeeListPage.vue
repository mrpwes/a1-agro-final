<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { useViewEmployeeStore } from "src/stores/admin/employeeListPage/viewEmployee";
import { usePageHeader } from "stores/pageHeader";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Employee List";

import addEmployeeButton from "components/admin/PageEmployeeList/AddEmployeeButton.vue";
import archivedEmployeeButton from "components/admin/PageEmployeeList/ArchivedEmployeeButton.vue";
import viewEmployeeButton from "components/admin/PageEmployeeList/ViewEmployeeButton.vue";

const storeEmployeeList = useViewEmployeeStore();
storeEmployeeList.fetchListOfEmployee();

const tableSearch = ref("");

const columns = [
  {
    name: "Employee_Id",
    required: true,
    label: "Employee Id",
    align: "left",
    field: (row) => row.company_employee_id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Name",
    align: "center",
    label: "Name",
    field: (row) => row.last_name + ", " + row.first_name,
    sortable: true,
  },
  {
    name: "Birthday",
    align: "center",
    label: "Birthday",
    field: (row) => row.date_of_birth,
    format: (val) => date.formatDate(val, "MMM D, YYYY"),
    sortable: true,
  },
  {
    name: "Contact Number",
    align: "center",
    label: "Contact Number",
    field: (row) => row.date_of_birth,
    sortable: true,
  },
  {
    name: "Department",
    align: "center",
    label: "Department",
    field: (row) => row.department,
    sortable: true,
  },
  {
    name: "Position",
    align: "center",
    label: "Position",
    field: (row) => row.position,
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "",
  },
];
</script>
<template>
  <page-header currentPage="Employee List" />
  <div class="tw-w-11/12 tw-mx-auto tw-flex tw-justify-end tw-mb-5 tw-gap-4">
    <archivedEmployeeButton></archivedEmployeeButton>
    <addEmployeeButton></addEmployeeButton>
  </div>
  <q-table
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
    flat
    bordered
    :sortBy="Employee_Id"
    :filter="tableSearch"
    :columns="columns"
    :rows="storeEmployeeList.getActive"
    :rows-per-page-options="[10, 20, 0]"
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td>
        <div>
          <viewEmployeeButton :rows="props.row"></viewEmployeeButton>
        </div>
      </q-td>
    </template>
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="tableSearch"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<style>
td {
  @apply tw-p-3 tw-border tw-border-gray-200;
}
</style>
