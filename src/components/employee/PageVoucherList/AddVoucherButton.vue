<script setup>
import { useAddVoucherStore } from "src/stores/admin/voucherListPage/addVoucher";

const storeAddVoucher = useAddVoucherStore();

storeAddVoucher.fetchReferenceData();
function filterFn(val, update) {
  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    storeAddVoucher.selectorRecipientOptions =
      storeAddVoucher.recipientOptions.filter(
        (v) => String(v.company_employee_id).toLowerCase().indexOf(needle) > -1
      );
  });
}
function filterIssuer(val, update) {
  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    storeAddVoucher.selectorIssuerOptions =
      storeAddVoucher.issuerOptions.filter(
        (v) => String(v.company_employee_id).toLowerCase().indexOf(needle) > -1
      );
  });
}
</script>

<template>
  <q-btn
    icon="mdi-plus"
    label="Add Voucher"
    @click="storeAddVoucher.addVoucherDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="storeAddVoucher.addVoucherDialog" persistent>
    <div class="!tw-h-min !tw-w-4/12 !tw-max-w-full tw-bg-white tw-p-6 tw-pb-3">
      <q-form @submit.prevent="storeAddVoucher.addVoucherData" autofocus>
        <div class="tw-grid tw-gap-3">
          <div class="tw-text-3xl tw-font-extrabold">Add Voucher</div>
          <div class="tw-flex tw-justify-between">
            <div>
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="storeAddVoucher.recipient"
                use-input
                hide-selected
                fill-input
                hide-bottom-space
                input-debounce="0"
                label="Recipient"
                :options="storeAddVoucher.selectorRecipientOptions"
                :option-label="
                  (opt) =>
                    'first_name' in opt
                      ? opt.company_employee_id + ' - ' + opt.last_name
                      : ''
                "
                :option-value="id"
                @filter="filterFn"
                :disable="storeAddVoucher.loading"
                required
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div>
              <q-select
                rounded
                standout="bg-teal text-white"
                v-model="storeAddVoucher.issuer"
                use-input
                hide-selected
                fill-input
                hide-bottom-space
                input-debounce="0"
                label="Issuer"
                :options="storeAddVoucher.selectorIssuerOptions"
                :option-label="
                  (opt) =>
                    'first_name' in opt
                      ? opt.company_employee_id + ' - ' + opt.last_name
                      : ''
                "
                :option-value="id"
                @filter="filterIssuer"
                required
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="tw-flex">
            <div class="tw-my-auto">Subject:</div>
            <div class="tw-w-2"></div>
            <div class="tw-w-36">
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeAddVoucher.subject"
                autogrow
                type="text"
                required
              />
            </div>
          </div>
          <div>
            Description:
            <span class="tw-text-gray-500">(Optional)</span>
            <q-input
              rounded
              standout="bg-teal text-white"
              v-model="storeAddVoucher.description"
              autogrow
              type="text"
            />
          </div>

          <div class="tw-flex tw-justify-between">
            <div class="tw-flex">
              <div class="tw-my-auto">Date Issued:</div>
              <div class="tw-w-2"></div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeAddVoucher.date_issued"
                aria-required=""
                type="date"
                hide-bottom-space
              />
            </div>
            <div class="tw-flex">
              <div class="tw-my-auto">Amount:</div>
              <div class="tw-w-2"></div>
              <q-input
                rounded
                standout="bg-teal text-white"
                v-model="storeAddVoucher.amount"
                :dense="dense"
                hide-bottom-space
                type="number"
                required
              />
            </div>
          </div>
        </div>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            @click="storeAddVoucher.resetForm"
            v-close-popup
          />
          <q-btn
            flat
            class="tw-bg-green-400"
            label="Add Invoice"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-dialog>
</template>

<style scoped></style>
