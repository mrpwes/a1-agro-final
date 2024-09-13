<script setup>
import { ref } from "vue";
import { useAddVoucherStore } from "src/stores/admin/voucherListPage/addVoucher";

const storeAddVoucher = useAddVoucherStore();
const addVoucherDialog = ref(false);

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
    @click="addVoucherDialog = true"
    class="tw-bg-white"
  />
  <q-dialog v-model="addVoucherDialog" persistent>
    <q-card class="!tw-h-min !tw-w-5/12 !tw-max-w-full tw-bg-white tw-p-6">
      <q-form autofocus>
        <!-- @submit.prevent="storeAddVoucher.addVoucher()" -->
        <div>
          <div class="tw-grid tw-grid-cols-3 tw-gap-3 tw-mb-5">
            <div class="tw-col-span-3 tw-text-3xl tw-font-extrabold tw-pb-3">
              Add Voucher
            </div>
            <div class="tw-col-span-1">
              Recipient
              <q-select
                filled
                v-model="storeAddVoucher.recipient"
                use-input
                hide-selected
                fill-input
                hide-bottom-space
                input-debounce="0"
                :options="storeAddVoucher.selectorRecipientOptions"
                :option-label="
                  (opt) =>
                    'first_name' in opt
                      ? opt.company_employee_id + ' - ' + opt.last_name
                      : ''
                "
                :option-value="id"
                @filter="filterFn"
                class="!tw-pb-0; tw-capitalize"
                popup-content-class="tw-capitalize"
                :disable="storeAddVoucher.loading"
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
            <div class="tw-col-span-1"></div>
            <div class="tw-col-span-1">
              Issuer
              <q-select
                filled
                v-model="storeAddVoucher.issuer"
                use-input
                hide-selected
                fill-input
                hide-bottom-space
                input-debounce="0"
                :options="storeAddVoucher.selectorIssuerOptions"
                :option-label="
                  (opt) =>
                    'first_name' in opt
                      ? opt.company_employee_id + ' - ' + opt.last_name
                      : ''
                "
                :option-value="id"
                @filter="filterIssuer"
                class="!tw-pb-0; tw-capitalize"
                popup-content-class="tw-capitalize"
                :disable="storeAddVoucher.loading"
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
            <div class="tw-col-span-3">Description</div>
            <div class="tw-col-span-3">
              <q-input
                v-model="storeAddVoucher.description"
                type="textarea"
                filled
                hide-bottom-space
                :rules="[(val) => val.length >= 1]"
                :disable="storeAddVoucher.loading"
              />
            </div>
            <!-- <div class="tw-col-span-1">
              Purpose:
              <q-input
                v-model="storeAddVoucher.des"
                type="textarea"
                filled
                autogrow
              />
            </div> -->
            <div class="tw-col-span-1">
              Date:
              <q-input
                filled
                v-model="storeAddVoucher.date_issued"
                label="YYYY-MM-DD"
                :rules="[(val) => date.isValid(val)]"
                hide-bottom-space
                :disable="storeAddVoucher.loading"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="storeAddVoucher.date_issued"
                        mask="YYYY-MM-DD"
                      >
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
            </div>
            <div class="tw-col-span-1"></div>
            <div class="tw-col-span-1">
              Amount
              <q-input
                filled
                v-model="storeAddVoucher.amount"
                :dense="dense"
                :rules="[(val) => val.length >= 1]"
                hide-bottom-space
                :disable="storeAddVoucher.loading"
              >
                <template v-slot:prepend>
                  <q-icon style="font-size: x-large" name="mdi-currency-php" />
                </template>
              </q-input>
            </div>
          </div>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              flat
              class="tw-bg-green-400"
              label="Add Invoice"
              type="submit"
              :onclick="storeAddVoucher.addVoucher"
              :disable="storeAddVoucher.loading"
              v-close-popup
            />
          </q-card-actions>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
