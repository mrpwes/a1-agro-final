<script setup>
import { useAddLoan } from "src/stores/admin/loanListPage/addLoan";

const storeAddLoan = useAddLoan();

// storeAddLoan.getDetails();
storeAddLoan.fetchEmployeeOptions();
storeAddLoan.fetchRequestTypeOptions();

function filterFn(val, update) {
  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    storeAddLoan.selectorEmployeeOptions = storeAddLoan.employeeOptions.filter(
      (v) => String(v.company_employee_id).toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-btn
    icon="mdi-plus"
    label="Add Loan"
    @click="storeAddLoan.addLoanDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="storeAddLoan.addLoanDialog" persistent>
    <q-card class="min-width: 500px">
      <q-form @submit.prevent="storeAddLoan.insertRequestForm" autofocus>
        <div class="tw-m-4">
          <q-card-section class="tw-pt-0 tw-pl-0">
            <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
              Add Loan Form
            </div>
          </q-card-section>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Employee Name:</div>
            <q-select
              rounded
              standout="bg-teal text-white"
              v-model="storeAddLoan.employeeOption"
              use-input
              required
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="storeAddLoan.selectorEmployeeOptions"
              :option-label="
                (opt) =>
                  'first_name' in opt
                    ? opt.company_employee_id + ' - ' + opt.last_name
                    : ''
              "
              @filter="filterFn"
              :option-value="id"
              class="!tw-pb-0; tw-capitalize"
              popup-content-class="tw-capitalize"
            >
              <!-- @filter="filterRecipient" -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Type:</div>
            <q-select
              rounded
              standout="bg-teal text-white"
              v-model="storeAddLoan.type"
              required
              use-input
              hide-selected
              fill-input
              hide-bottom-space
              input-debounce="0"
              :options="storeAddLoan.typeOptions"
              option-label="request_type_name"
              class="!tw-pb-0; tw-capitalize;"
              popup-content-class="tw-capitalize"
              emit-value
            >
              <!-- @filter="filterRecipient" -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Subject:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeAddLoan.subject"
                required
                autogrow
                hide-bottom-space
                class="tw-max-w-full"
              />
            </div>
          </div>
          <div>
            <div>Description:</div>
            <div class="tw-pb-3 tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeAddLoan.description"
                required
                type="textarea"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="tw-flex tw-mb-3">
            <div class="tw-content-center tw-mr-3">Amount:</div>
            <div class="tw-px-2">
              <q-input
                rounded
                standout="bg-teal text-white"
                type="number"
                v-model="storeAddLoan.amount"
                required
                class="tw-max-w-full"
              />
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="resetForm" v-close-popup />
          <q-btn
            flat
            class="tw-bg-green-400"
            label="Add Loan"
            type="submit"
            :disable="storeAddLoan.disableButtonExisting"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
