<script setup>
import { ref } from "vue";
// import { date } from "quasar";
import { Notify } from "quasar";

defineProps(["rows"]);
const counterSMS = ref(0);

const viewPrompt = ref(false);
const selectedRow = ref(null);
function openmodel(row) {
  selectedRow.value = row;
  viewPrompt.value = true;
}

function sendSMS() {
  counterSMS.value += 1;
  Notify.create({
    icon: "done",
    color: "positive",
    message: "SMS Sent!",
  });
}

//FIXME: CONTACT NUMBER ADD MORE
</script>

<template>
  <q-btn unelevated padding="none" icon="visibility" @click="openmodel(rows)" />
  <q-dialog v-model="viewPrompt" persistent>
    <div class="!tw-h-min !tw-w-8/12 !tw-max-w-full tw-bg-white tw-p-6">
      <div id="section-to-print">
        <div class="tw-text-3xl tw-font-extrabold tw-pb-3">
          {{ selectedRow.employeeName }}
        </div>
        <table class="tw-w-full tw-table-auto tw-border-collapse">
          <thead>
            <tr>
              <th class="tw-text-center tw-font-bold tw-border" colspan="3">
                Gross
              </th>
              <th class="tw-text-center tw-font-bold tw-border" colspan="2">
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tw-border">Rate Per Day:</td>
              <td class="tw-border">{{ selectedRow.ratePerDay }}</td>
              <td class="tw-border"></td>
              <td class="tw-border">VALE</td>
              <td class="tw-border">{{ selectedRow.VALE }}</td>
            </tr>
            <tr>
              <td class="tw-border">Day Worked:</td>
              <td class="tw-border">x{{ selectedRow.noDaysWorked }}</td>
              <td class="tw-border">
                {{ selectedRow.noDaysWorked * selectedRow.ratePerDay }}
              </td>
              <td class="tw-border">A/R</td>
              <td class="tw-border">{{ selectedRow.AR }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">SSS Contribution:</td>
              <td class="tw-border">{{ selectedRow.sss }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">PhilHealth Contribution:</td>
              <td class="tw-border">{{ selectedRow.philHealth }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">Pag-IBIG Contribution:</td>
              <td class="tw-border">{{ selectedRow.pagIbig }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">SSS Calamity Loan:</td>
              <td class="tw-border">{{ selectedRow.sssCalamityLoan }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">SSS Loan:</td>
              <td class="tw-border">{{ selectedRow.sssLoan }}</td>
            </tr>
            <tr>
              <td colspan="3" class="tw-border"></td>
              <td class="tw-border">Pag-IBIG Loan:</td>
              <td class="tw-border">{{ selectedRow.pagIbigLoan }}</td>
            </tr>
            <tr>
              <td colspan="2" class="tw-border">Total Gross Income:</td>
              <td class="tw-border">
                {{ selectedRow.ratePerDay * selectedRow.noDaysWorked }}
              </td>
              <td class="tw-border">Total Deductions:</td>
              <td class="tw-border">
                {{
                  selectedRow.VALE +
                  selectedRow.AR +
                  selectedRow.sss +
                  selectedRow.philHealth +
                  selectedRow.pagIbig +
                  selectedRow.sssCalamityLoan +
                  selectedRow.sssLoan +
                  selectedRow.pagIbigLoan
                }}
              </td>
            </tr>
            <tr>
              <td class="tw-border" colspan="3"></td>
              <td class="tw-border">Total Net Pay:</td>
              <td class="tw-border">
                {{
                  (
                    selectedRow.ratePerDay * selectedRow.noDaysWorked -
                    (selectedRow.VALE +
                      selectedRow.AR +
                      selectedRow.sss +
                      selectedRow.philHealth +
                      selectedRow.pagIbig +
                      selectedRow.sssCalamityLoan +
                      selectedRow.sssLoan +
                      selectedRow.pagIbigLoan)
                  ).toFixed(2)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <q-card-actions align="right" class="text-primary noPrint">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          class="tw-bg-green-400"
          icon="mdi-message"
          :label="counterSMS === 0 ? 'SEND SMS' : 'SEND SMS ' + counterSMS"
          :onclick="sendSMS"
        />
        <q-btn
          flat
          class="tw-bg-green-400"
          icon="print"
          label="print payslip"
          onclick="window.print()"
        />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<style>
td {
  padding: 5px;
}
/* https://stackoverflow.com/questions/468881/print-div-id-printarea-div-only */
.noScreen {
  display: none;
}

@media print {
  body {
    visibility: hidden;
  }
  .noScreen {
    display: block;
  }

  #section-to-print {
    transform: scale(0.6);
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    top: 0;
    transform-origin: top left;
    /* transform-origin: top left; //IMPORTANT  */
  }
}
</style>
