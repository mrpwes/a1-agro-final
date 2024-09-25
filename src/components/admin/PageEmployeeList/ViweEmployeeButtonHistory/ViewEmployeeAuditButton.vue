<script setup>
import { useEmployeeAuditLogs } from "src/stores/admin/employeeListPage/AuditLogs/employeeAuditLogs";
import { ref } from "vue";
defineProps(["rows"]);

const employeeAuditLogs = useEmployeeAuditLogs();
const viewPrompt = ref(false);

async function openmodel(row) {
  employeeAuditLogs.selectedRow = row;
  viewPrompt.value = true;
  await employeeAuditLogs.getEmployeeAuditLogs();
  createAuditLogs(employeeAuditLogs.formattedLogs);
}

function createAuditLogs(data) {
  console.log(data);
  const auditLogsContainer = document.getElementById("audit-logs");

  data.forEach((audit) => {
    const collapsibleButton = document.createElement("button");
    collapsibleButton.className = "collapsible";
    collapsibleButton.innerText = `Audit ID: ${audit.audit_id} - Operation: ${audit.operation_type} - Date: ${audit.timestamp} | Modified By: ${audit.modified_by}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const changesList = document.createElement("ul");
    for (const [key, value] of Object.entries(audit.changes)) {
      const listItem = document.createElement("li");
      listItem.innerText = `${key}: From: ${value.previous}, To: ${value.current}`;
      changesList.appendChild(listItem);
    }

    contentDiv.appendChild(changesList);
    auditLogsContainer.appendChild(collapsibleButton);
    auditLogsContainer.appendChild(contentDiv);

    collapsibleButton.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    });
  });
}
</script>

<template>
  <q-btn icon="mdi-history" label="History" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div id="audit-logs"></div>

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

<style>
.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 10px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  margin: 5px 0;
}

.active,
.collapsible:hover {
  background-color: #ccc;
}

.content {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: white;
  border: 1px solid #ccc;
  margin-bottom: 5px;
}
</style>
