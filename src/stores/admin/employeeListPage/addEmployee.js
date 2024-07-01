import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

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

    registeredAuthID: null,
    loading: false,
  }),

  getters: {},

  // TODO: Images Temp Local Storage to Database SignedUP User Bucket Storage to be implemented
  // insert contents to database

  actions: {
    async addEmployee() {
      try {
        this.loading = true;
        this.supabaseSignUpUserAuth();
      } catch (error) {
        alert(error);
        this.loading = false;
      } finally {
        this.reset();
        this.loading = false;
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
          // console.log(this.registeredAuthID);
          this.addFormRecord();
          this.addPhoneNumber();
          this.addAddress();
          this.uploadImage();
        }
      } catch (error) {
        alert(error);
      }
    },

    async addFormRecord() {
      try {
        const { error } = await supabase
          .from("employee")
          .update({
            employment_type_id: this.employment_type_id_selected["id"], //TODO: UPDATE
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.last_name,
            date_of_birth: this.date_of_birth,
            gender: this.gender == "Male" ? true : false, //TODO: UPDATE BOOLEAN
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
      }
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
      this.registeredAuthID = null;
    },
  },
});
