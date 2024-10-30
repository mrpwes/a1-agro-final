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
          <div class="form-group tw-grid tw-gap-1">
            <label class="text-gray-600 font-semibold text-lg"
              >Leave Date:</label
            >
            <div
              v-for="(input, index) in requestToAdminPage.dateList"
              :key="`phoneInput-${index}`"
              class="input wrapper flex items-center"
            >
              <q-input
                filled
                v-model="input.date"
                mask="date"
                :rules="['date']"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="input.date">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <!-- Add Svg Icon -->
              <div class="tw-my-auto">
                <svg
                  @click="requestToAdminPage.addField(input, dateList)"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="ml-2 cursor-pointer"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="green"
                    d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
                  />
                </svg>

                <!-- Remove Svg Icon -->
                <svg
                  v-show="requestToAdminPage.dateList.length > 1"
                  @click="requestToAdminPage.removeField(index, dateList)"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="ml-2 cursor-pointer"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="#EC4899"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9.414l2.828-2.829 1.415 1.415L13.414 12l2.829 2.828-1.415 1.415L12 13.414l-2.828 2.829-1.415-1.415L10.586 12 7.757 9.172l1.415-1.415L12 10.586z"
                  />
                </svg>
              </div>
            </div>
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
