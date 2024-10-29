<script setup>
import { usePageHeader } from "stores/pageHeader";
import { useRequestToAdminPage } from "stores/employee/requestToAdminPage/requestToAdminPage";
const requestToAdminPage = useRequestToAdminPage();

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Request To Admin";

requestToAdminPage.getRequestTypeOptions();
requestToAdminPage.getRequestList();
</script>

<template>
  <div>
    <q-btn
      icon="mdi-plus"
      label="Request"
      @click="requestToAdminPage.viewPrompt = true"
      class="tw-bg-white"
    />
    <q-dialog v-model="requestToAdminPage.viewPrompt" persistent>
      <div
        class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-px-6 tw-pb-3 tw-pt-6"
      >
        <q-form
          @submit.prevent="requestToAdminPage.addRequestToAdminPage"
          autofocus
        >
          <div class="tw-grid tw-gap-4">
            <div class="tw-text-3xl tw-font-extrabold">Add Request</div>
            <q-select
              required
              rounded
              standout="bg-teal text-white"
              v-model="requestToAdminPage.requestTypeOption"
              label="Request Type"
              :options="requestToAdminPage.requestTypeOptions"
              :value="requestToAdminPage.requestTypeOption"
              :rules="[(v) => !!v || 'Request Type is required']"
              option-label="request_type_name"
              hide-bottom-space
              class="!tw-w-30"
            />
            <q-input
              rounded
              standout="bg-teal text-white"
              label="Subject"
              v-model="requestToAdminPage.request_subject"
              autogrow
              type="text"
              required
            />
            <q-input
              rounded
              standout="bg-teal text-white"
              label="Description"
              v-model="requestToAdminPage.request_description"
              type="textarea"
              required
            />
          </div>
          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              label="Cancel"
              @click="requestToAdminPage.resetForm"
              v-close-popup
            />
            <q-btn
              flat
              class="tw-bg-green-400"
              label="Add Request"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </div>
    </q-dialog>
  </div>

  <div class="tw-mt-6">
    <div
      class="tw-w-11/12 tw-mx-auto tw-flex tw-justify-end tw-mb-5 tw-gap-4"
    ></div>
    <div>
      <q-table
        class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
        flat
        bordered
        :title-class="['tw-text-xl', 'tw-font-bold']"
        :columns="requestToAdminPage.columns"
        :rows="requestToAdminPage.getUnarchiveRows"
        :rows-per-page-options="[10, 20, 0]"
        :filter="filter"
        row-key="Loan ID"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td key="actions" class="tw-w-2/12" :props="props"
            ><ViewLoanButton :rows="props.row"></ViewLoanButton
          ></q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style scoped></style>
