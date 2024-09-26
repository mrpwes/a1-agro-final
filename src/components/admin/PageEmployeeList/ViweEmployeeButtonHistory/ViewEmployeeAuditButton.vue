<script setup>
import { useEmployeeAuditLogs } from "src/stores/admin/employeeListPage/AuditLogs/employeeAuditLogs";
import { ref } from "vue";
defineProps(["rows"]);

const employeeAuditLogs = useEmployeeAuditLogs();
const viewPrompt = ref(false);

async function openmodel(row) {
  employeeAuditLogs.selectedRow = row;
  viewPrompt.value = true;
  employeeAuditLogs.callLogs();
}

function convertToTitleCase(input) {
  return input
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}
</script>

<template>
  <q-btn icon="mdi-history" label="History" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-9/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-table
        class="tw-border tw-rounded-3xl tw-shadow-lg"
        flat
        bordered
        dense
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :filter="tableSearch"
        :columns="employeeAuditLogs.employeeAuditColumns['columns']"
        :rows="employeeAuditLogs.formattedLogs"
        :rows-per-page-options="[0]"
        separator="cell"
        row-key="audit_id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="audit_id" :props="props" auto-width
              >{{ props.row.audit_id }} - {{ props.row.table_name }}
            </q-td>
            <q-td key="operation_type" :props="props" auto-width
              >{{ props.row.operation_type }}
            </q-td>
            <q-td key="changes" :props="props" auto-width>
              <q-expansion-item
                :dense="true"
                expand-separator
                :default-opened="false"
                :header-class="['tw-py-2', 'tw-px-4']"
                :content-class="['tw-py-2', 'tw-px-4']"
                ><div v-for="(change, index) in props.row.changes" :key="index">
                  <p>
                    {{ convertToTitleCase(index) }} Previous: "{{
                      change.previous
                    }}" to "{{ change.current }}"
                  </p>
                </div>
              </q-expansion-item>
            </q-td>
            <q-td key="modified_by" :props="props" auto-width
              >{{
                props.row.modified_by
                  ? `${props.row.modified_by.last_name ?? ""} ${
                      props.row.modified_by.first_name ?? ""
                    } - ${props.row.modified_by.company_employee_id ?? ""}`
                  : "System Admin"
              }}
            </q-td>
            <q-td key="timestamp" :props="props" auto-width
              >{{ props.row.timestamp }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Close"
          color="primary"
          @click="employeeAuditLogs.reset()"
          v-close-popup
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<style scoped>
.tw-py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.tw-px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.tw-ml-4 {
  margin-left: 1rem;
}
.tw-flex {
  display: flex;
}
.tw-items-center {
  align-items: center;
}
</style>
