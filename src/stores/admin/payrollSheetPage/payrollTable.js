import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePayrollTableStore = defineStore("payrollTable", {
  state: () => ({
    payrollColumns: {
      columns: [
        {
          name: "employeeId",
          required: true,
          label: "Emp. Id",
          align: "left",
          sortable: true,
        },
        {
          name: "employeeName",
          align: "center",
          label: "Name",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "noDaysWorked",
          align: "center",
          label: "Days Worked",
          sortable: true,
        },
        {
          name: "ratePerDay",
          align: "center",
          label: "Rate/Day",
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "total",
          align: "center",
          label: "Total",
          sortable: true,
        },
        {
          name: "sss",
          align: "center",
          label: "SSS",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "philHealth",
          align: "center",
          label: "PhilHealth",
          sortable: true,
        },
        {
          name: "pagIbig",
          align: "center",
          label: "PagIBIG",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "sssCalamityLoan",
          align: "center",
          label: "SSS Calamity Loan",
          sortable: true,
        },
        {
          name: "sssLoan",
          align: "center",
          label: "SSS  Loan",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "pagIbigLoan",
          align: "center",
          label: "Pag-IBIG Loan",
          sortable: true,
          headerStyle: "width: 0px",
        },
        {
          name: "VALE",
          align: "center",
          label: "VALE",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "AR",
          align: "center",
          label: "AR",
          sortable: true,
        },
        {
          name: "NetPay",
          align: "center",
          label: "NetPay",
          sortable: true,

          classes: "!tw-bg-neutral-300",
        },
        {
          name: "overVale",
          align: "center",
          label: "Over VALE",
          sortable: true,
        },
        {
          name: "actions",
          align: "center",
          label: "",
        },
      ],
    },
    rows: [
      {
        employeeId: "001",
        employeeName: "John Doe",
        noDaysWorked: 15.0,
        ratePerDay: 383.33,

        sss: 517.5,
        philHealth: 230.0,
        pagIbig: 0,
        sssCalamityLoan: 507.59,
        sssLoan: 969.04,
        pagIbigLoan: 0,
        VALE: 0,
        AR: 1500,
        productLoan: 0,

        overVale: 900,
        isPrinted: false,
      },
    ],
  }),

  getters: {},

  actions: {
    fetchAttendance() {
      const { data, error } = supabase.from("attendance").select("*");
      if (error) {
        console.error("error", error);
      } else {
        console.log("data", data);
      }
    },
  },
});
