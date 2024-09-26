import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";
import { Notify } from "quasar";

const authenticationStore = useAuthenticationStore();

export const useAddEmployee = defineStore("addEmployee", {
  state: () => ({
    profileImage: null,
    profileImageFileExtension: null,
    profileImageUpload: null,
    email: null,
    password: null,

    date_of_birth: null,
    martial_status: null,

    region: null,
    province: null,
    city: null,
    barangay: null,
    postal_code: null,
    street: null,
    house_number: null,
    additional_information: null,

    company_employee_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    gender: null,

    phone_type: [], //GET PHONE TYPE
    phone_type_selected: null,
    phone_number: null,

    hired_date: null,

    employment_type: [], //GET EMPLOYMENT TYPE
    employment_type_id_selected: null,
    employment_type_id: null,

    position: null,
    department: null,
    rate_per_day: null,

    phil_health_number: null,
    pag_ibig_number: null,
    sss_number: null,
    bir_tin: null,
    is_archive: null,
    rows: [],

    philhealth_contrib_amount: null,
    philhealth_contrib_half_month_indicator: null,

    pagibig_contrib_amount: null,
    pagibig_contrib_half_month_indicator: null,

    sss_contrib_amount: null,
    sss_contrib_half_month_indicator: null,

    incometax_contrib_amount: null,
    incometax_contrib_half_month_indicator: null,

    registeredAuthID: null,
    loading: false,
  }),

  getters: {},
  actions: {
    addEmployee() {
      Promise.all([this.supabaseSignUpUserAuth()]).then(() => {
        this.addFormRecord(),
          this.addPhoneNumber(),
          this.addAddress(),
          this.uploadImage(),
          this.addPhilHealthContrib(),
          this.addPagibigContrib(),
          this.addSSSContrib(),
          this.addIncomeTaxContrib(),
          this.reset();
        this.loading = false;
      });
    },

    async addPhilHealthContrib() {
      try {
        const { error } = await supabase.from("emp_philhealth_contrib").insert({
          employee_id: this.registeredAuthID,
          amount: this.philhealth_contrib_amount,
          emp_id_modified_by: authenticationStore.getEmployeeId, //!TODO: Should be the current admin
          half_month_indicator:
            this.philhealth_contrib_half_month_indicator === "2nd Half"
              ? true
              : false,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addPagibigContrib() {
      try {
        const { error } = await supabase.from("emp_pagibig_contrib").insert({
          employee_id: this.registeredAuthID,
          amount: this.pagibig_contrib_amount,
          emp_id_modified_by: authenticationStore.getEmployeeId, //!TODO: Should be the current admin
          half_month_indicator:
            this.pagibig_contrib_half_month_indicator === "2nd Half"
              ? true
              : false,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addSSSContrib() {
      try {
        const { error } = await supabase.from("emp_sss_contrib").insert({
          employee_id: this.registeredAuthID,
          amount: this.sss_contrib_amount,
          emp_id_modified_by: authenticationStore.getEmployeeId, //!TODO: Should be the current admin
          half_month_indicator:
            this.sss_contrib_half_month_indicator === "2nd Half" ? true : false,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addIncomeTaxContrib() {
      try {
        const { error } = await supabase.from("emp_incometax_contrib").insert({
          employee_id: this.registeredAuthID,
          amount: this.incometax_contrib_amount,
          emp_id_modified_by: authenticationStore.getEmployeeId, //!TODO: Should be the current admin
          half_month_indicator:
            this.incometax_contrib_half_month_indicator === "2nd Half"
              ? true
              : false,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async supabaseSignUpUserAuth() {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });
        if (error) {
          throw error;
        } else {
          this.registeredAuthID = data.user.id;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addFormRecord() {
      try {
        const { error } = await supabase
          .from("employee")
          .update({
            employment_type_id: this.employment_type_id_selected["id"],
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.last_name,
            date_of_birth: this.date_of_birth,
            gender: this.gender == "Male" ? true : false,
            martial_status: this.martial_status,
            department: this.department,
            position: this.position,
            phil_health_number: this.phil_health_number,
            pag_ibig_number: this.pag_ibig_number,
            sss_number: this.sss_number,
            bir_tin: this.bir_tin,
            hired_date: this.hired_date,
            rate_per_day: this.rate_per_day,
            is_archive: false,
            emp_id_modified_by: authenticationStore.getEmployeeId,
          })
          .eq("id", this.registeredAuthID);

        if (error) {
          throw error;
        }
        // else {
        //   console.log("Record inserted successfully");
        // }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addPhoneNumber() {
      try {
        const { error } = await supabase.from("phone_number").insert({
          phone_type_id: this.phone_type_selected["id"],
          employee_id: this.registeredAuthID,
          phone_number: this.phone_number,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async addAddress() {
      try {
        const { error } = await supabase.from("address").insert({
          employee_id: this.registeredAuthID,
          region: this.region,
          province: this.province,
          city: this.city,
          barangay: this.barangay,
          postal_code: this.postal_code,
          street: this.street,
          house_number: this.house_number,
          additional_information: this.additional_information,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async uploadImage() {
      const uploadImage =
        this.registeredAuthID +
        "/profile-image." +
        this.profileImageFileExtension; //
      try {
        const { error } = await supabase.storage // { data,error }
          .from("users")
          .upload(uploadImage, this.profileImageUpload, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) {
          throw error;
        }
        // else {
        //   console.log("Image uploaded successfully");
        //   // console.log(data);
        // }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getReferencedData() {
      try {
        //GET EMPLOYMENT TYPE
        const { data, error } = await supabase.from("employment_type").select(`
          id,
          employment_type_name
        `);
        if (error) {
          throw error;
        } else {
          // console.log("employment type", data);
          this.employment_type = data;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
      try {
        //GET PHONE TYPE
        const { data, error } = await supabase.from("phone_type").select(`
          id,
          phone_type_name
        `);
        if (error) {
          throw error;
        } else {
          // console.log("phone type", data);
          this.phone_type = data;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    success() {
      Notify.create({
        icon: "done",
        color: "positive",
        message: "Added Voucher Successfully!",
      });
    },
    reset() {
      this.profileImage = null;
      this.profileImageFileExtension = null;
      this.profileImageUpload = null;
      this.email = null;
      this.password = null;
      this.date_of_birth = null;
      this.martial_status = null;
      this.region = null;
      this.province = null;
      this.city = null;
      this.barangay = null;
      this.postal_code = null;
      this.street = null;
      this.house_number = null;
      this.additional_information = null;
      this.company_employee_id = null;
      this.first_name = null;
      this.middle_name = null;
      this.last_name = null;
      this.gender = null;
      // this.phone_type = [];
      this.phone_type_selected = null;
      this.phone_number = null;
      this.hired_date = null;
      this.employment_type = null;
      this.employment_type_id_selected = [];
      this.employment_type_id = null;
      this.position = null;
      this.department = null;
      this.rate_per_day = null;
      this.phil_health_number = null;
      this.pag_ibig_number = null;
      this.sss_number = null;
      this.bir_tin = null;
      this.is_archive = null;
      this.rows = [];
      this.philhealth_contrib_amount = null;
      this.philhealth_contrib_half_month_indicator = null;
      this.pagibig_contrib_amount = null;
      this.pagibig_contrib_half_month_indicator = null;
      this.sss_contrib_amount = null;
      this.sss_contrib_half_month_indicator = null;
      this.incometax_contrib_amount = null;
      this.incometax_contrib_half_month_indicator = null;
      this.registeredAuthID = null;
      this.loading = false;
    },
  },
});
