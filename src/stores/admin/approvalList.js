import { defineStore } from "pinia";

// useLoanListStore                 loanList
export const useApprovalListStore = defineStore("approvalList", {
  state: () => ({
    rows: [
      {
        referenceId: "1",
        employeeName: "Lorem Ipsum Dolor Sit Amet 1",
        description:
          "Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1",
        requestDate: 12345,
        isApproved: null,
        isArchive: false,
      },
      {
        referenceId: "2",
        employeeName: "Lorem Ipsum Dolor Sit Amet 1",
        description:
          "Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1",
        requestDate: 12345,
        isApproved: null,
        isArchive: true,
      },
      {
        referenceId: "3",
        employeeName: "Lorem Ipsum Dolor Sit Amet 1",
        description:
          "Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1Lorem Ipsum Dolor Sit Amet 1",
        requestDate: 12345,
        isApproved: null,
        isArchive: true,
      },
      {
        referenceId: "4",
        employeeName: "Lorem Ipsum Dolor Sit Amet 2",
        description:
          "Lorem Ipsum Dolor Sit Amet 2Lorem Ipsum Dolor Sit Amet 2Lorem Ipsum Dolor Sit Amet 2Lorem Ipsum Dolor Sit Amet 2",
        requestDate: 23456,
        isApproved: null,
        isArchive: false,
      },
      {
        referenceId: "5",
        employeeName: "Lorem Ipsum Dolor Sit Amet 3",
        description:
          "Lorem Ipsum Dolor Sit Amet 3Lorem Ipsum Dolor Sit Amet 3Lorem Ipsum Dolor Sit Amet 3Lorem Ipsum Dolor Sit Amet 3",
        requestDate: 34567,
        isApproved: null,
        isArchive: true,
      },
      {
        referenceId: "6",
        employeeName: "Lorem Ipsum Dolor Sit Amet 4",
        description:
          "Lorem Ipsum Dolor Sit Amet 4Lorem Ipsum Dolor Sit Amet 4Lorem Ipsum Dolor Sit Amet 4Lorem Ipsum Dolor Sit Amet 4",
        requestDate: 45678,
        isApproved: null,
        isArchive: true,
      },
    ],
  }),

  getters: {
    getApprovedIsNull(state) {
      return state.rows.filter((row) => row.isApproved === null);
    },
    getNotArchive(state) {
      return state.rows.filter((row) => row.isArchive === false);
    },
    getArchive(state) {
      return state.rows.filter((row) => row.isArchive === true);
    },
  },

  actions: {
    // increment() {
    //   this.counter++;
    // },
  },
});
