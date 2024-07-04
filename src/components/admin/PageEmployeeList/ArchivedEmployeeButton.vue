<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { useViewEmployeeStore } from "src/stores/admin/employeeListPage/viewEmployee";
import viewEmployeeButton from "components/admin/PageEmployeeList/ViewEmployeeButton.vue";

const storeViewEmployee = useViewEmployeeStore();

const archivedEmployee = ref(false);

const tableSearch = ref("");

const columns = [
  {
    name: "Employee Id",
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
    field: (row) => row.phone_number[0].phone_number,
    sortable: true,
  },
  {
    name: "Department",
    align: "center",
    label: "Department",
    field: "department",
    sortable: true,
  },
  {
    name: "Position",
    align: "center",
    label: "Position",
    field: "position",
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
  <q-btn
    icon="mdi-archive"
    label="Inactive Employee"
    @click="archivedEmployee = true"
    class="tw-bg-white"
  />

  <q-dialog v-model="archivedEmployee" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div class="tw-col-span-4 tw-text-3xl tw-font-extrabold tw-pb-3">
        Inactive Employee
      </div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        :filter="tableSearch"
        :columns="columns"
        :rows="storeViewEmployee.getInactive"
        :rows-per-page-options="[10, 20, 0]"
        row-key="name"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
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
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </div>
  </q-dialog>
</template>
