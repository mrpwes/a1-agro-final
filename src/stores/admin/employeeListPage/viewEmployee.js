import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const useViewEmployeeStore = defineStore("viewEmployee", {
  state: () => ({
    rows: [],
    profileImage: null,
    profileImageFileExtension: null,
    profileImageUpload: null,
    publicUrl: null,
  }),

  getters: {
    getHighestEmployeeIDNumber(state) {
      return Math.max.apply(
        Math,
        state.rows.map(function (o) {
          return (parseInt(o.employeeId) + 1).toString();
        })
      );
    },
    getActive(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
    getInactive(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
  },

  actions: {
    getCurrentTimestampUTCPlus8() {
      // Create a new Date object for the current time
      const now = new Date();

      // Convert to Asia/Manila timezone
      const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      };

      // Format the date
      const formatter = new Intl.DateTimeFormat("en-GB", options);
      const parts = formatter.formatToParts(now);

      // Extract the formatted parts
      const year = parts.find((part) => part.type === "year").value;
      const month = parts.find((part) => part.type === "month").value;
      const day = parts.find((part) => part.type === "day").value;
      const hour = parts.find((part) => part.type === "hour").value;
      const minute = parts.find((part) => part.type === "minute").value;
      const second = parts.find((part) => part.type === "second").value;

      // Construct the PostgreSQL timestamp format
      const timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      return timestamp;
    },

    async updateEmployeeData(selectedRow) {
      try {
        this.updateEmployeePhoneNumber(selectedRow);
        this.updateEmployeeAddress(selectedRow);
        this.updatePhilHealthContrib(selectedRow);
        this.updatePagibigContrib(selectedRow);
        this.updateSSSContrib(selectedRow);
        this.updateIncomeTaxContrib(selectedRow);
        this.uploadImage(selectedRow);
        const { data, error } = await supabase
          .from("employee")
          .update({
            first_name: selectedRow.first_name,
            middle_name: selectedRow.middle_name,
            last_name: selectedRow.last_name,
            date_of_birth: selectedRow.date_of_birth,
            gender: selectedRow.gender == "Male" ? true : false,
            martial_status: selectedRow.martial_status,
            department: selectedRow.department,
            position: selectedRow.position,
            phil_health_number: selectedRow.phil_health_number,
            pag_ibig_number: selectedRow.pag_ibig_number,
            sss_number: selectedRow.sss_number,
            bir_tin: selectedRow.bir_tin,
            hired_date: selectedRow.hired_date,
            rate_per_day: selectedRow.rate_per_day,
            emp_id_modified_by: authenticationStore.getEmployeeId,
            change_date: this.getCurrentTimestampUTCPlus8(),
          })
          .eq("id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
        this.fetchListOfEmployee();
        // console.log("Successfully updated");
        console.table(data);
      } catch (error) {
        console.error("Error updating:", error.message);
      }
    },

    async updateEmployeeAddress(selectedRow) {
      try {
        const { data, error } = await supabase
          .from("address")
          .update({
            region: selectedRow.address[0].region,
            province: selectedRow.address[0].province,
            city: selectedRow.address[0].city,
            barangay: selectedRow.address[0].barangay,
            postal_code: selectedRow.address[0].postal_code,
            street: selectedRow.address[0].street,
            house_number: selectedRow.address[0].house_number,
            additional_information:
              selectedRow.address[0].additional_information,
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
        this.fetchListOfEmployee();
        // console.log("Successfully Address");
        console.table(data);
      } catch (error) {
        console.error("Error updating:", error.message);
      }
    },

    async updatePhilHealthContrib(selectedRow) {
      try {
        const { error } = await supabase
          .from("emp_philhealth_contrib")
          .update({
            // employee_id: this.registeredAuthID,
            amount: selectedRow.emp_philhealth_contrib[0].amount,
            emp_id_modified_by: authenticationStore.getEmployeeId,
            half_month_indicator:
              selectedRow.emp_philhealth_contrib[0].half_month_indicator ===
              "2nd Half"
                ? true
                : false,
            change_date: this.getCurrentTimestampUTCPlus8(),
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async updatePagibigContrib(selectedRow) {
      try {
        const { error } = await supabase
          .from("emp_pagibig_contrib")
          .update({
            amount: selectedRow.emp_pagibig_contrib[0].amount,
            emp_id_modified_by: authenticationStore.getEmployeeId,
            half_month_indicator:
              selectedRow.emp_pagibig_contrib[0].half_month_indicator ===
              "2nd Half"
                ? true
                : false,
            change_date: this.getCurrentTimestampUTCPlus8(),
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async updateSSSContrib(selectedRow) {
      try {
        const { data, error } = await supabase
          .from("emp_sss_contrib")
          .update({
            amount: selectedRow.emp_sss_contrib[0].amount,
            emp_id_modified_by: authenticationStore.getEmployeeId,
            half_month_indicator:
              selectedRow.emp_sss_contrib[0].half_month_indicator == "2nd Half"
                ? true
                : false,
            change_date: this.getCurrentTimestampUTCPlus8(),
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
        console.log("Successfully SSS");
        console.table(data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async updateIncomeTaxContrib(selectedRow) {
      try {
        const { error } = await supabase
          .from("emp_incometax_contrib")
          .update({
            // employee_id: this.registeredAuthID,
            amount: selectedRow.emp_incometax_contrib[0].amount,
            emp_id_modified_by: authenticationStore.getEmployeeId,
            half_month_indicator:
              selectedRow.emp_incometax_contrib[0].half_month_indicator ===
              "2nd Half"
                ? true
                : false,
            change_date: this.getCurrentTimestampUTCPlus8(),
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async updateEmployeePhoneNumber(selectedRow) {
      try {
        const { data, error } = await supabase
          .from("phone_number")
          .update({
            phone_number: selectedRow.phone_number[0].phone_number,
          })
          .eq("employee_id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
        this.fetchListOfEmployee();
        // console.log("Successfully Phone Number");
        console.table(data);
      } catch (error) {
        console.error("Error updating:", error.message);
      }
    },

    async fetchListOfEmployee() {
      try {
        const { data, error } = await supabase.from("employee").select(`
          id,
          date_of_birth,
          martial_status,
          address (
            region,
            province,
            city,
            barangay,
            postal_code,
            street,
            house_number,
            additional_information
          ),

          company_employee_id,
          first_name,
          middle_name,
          last_name,
          gender,
          phone_number (
            phone_number
          ),

          hired_date,
          employment_type_id,
          position,
          department,
          rate_per_day,

          phil_health_number,
          pag_ibig_number,
          sss_number,
          bir_tin,
          is_archive,

          emp_philhealth_contrib!emp_philhealth_contrib_employee_id_fkey (
            id,
            employee_id,
            amount,
            emp_id_modified_by,
            half_month_indicator
          ),

          emp_sss_contrib!emp_sss_contrib_employee_id_fkey (
            id,
            employee_id,
            amount,
            emp_id_modified_by,
            half_month_indicator
          ),

          emp_pagibig_contrib!emp_pagibig_contrib_employee_id_fkey (
            id,
            employee_id,
            amount,
            emp_id_modified_by,
            half_month_indicator
          ),
          
          emp_incometax_contrib!emp_incometax_contrib_employee_id_fkey (
            id,
            employee_id,
            amount,
            emp_id_modified_by,
            half_month_indicator
          )
        `);
        if (error) {
          throw error;
        } else {
          this.rows = data;
          // console.table(data);
          // console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getProfilePicture(id) {
      try {
        const { data, error } = await supabase.storage
          .from("employee_avatar")
          .getPublicUrl(id + ".jpg");
        if (error) {
          throw error;
        } else {
          // console.log(data);
          console.log(data.publicUrl);
          this.publicUrl = data.publicUrl;
        }
      } catch (error) {
        // console.log("Error getting profile picture:", error.message);
        // this.getDefaultProfile();
      }
    },
    // getDefaultProfile() {
    //   this.profilePicture =
    //     "https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/public/public-bucket/default-profile-image/avatar.png";
    // },

    onFileInput(event) {
      this.profileImage = URL.createObjectURL(event.target.files[0]);
      this.profileImageUpload = event.target.files[0];

      const name = event.target.files[0].name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);

      this.profileImageFileExtension = ext;
    },

    async uploadImage(selectedRow) {
      try {
        const { data, error } = await supabase.storage
          .from("employee_avatar")
          .upload(selectedRow.id + ".jpg", this.profileImageUpload, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) {
          throw error;
        } else {
          console.log(data);
          console.log("Image uploaded successfully");
        }
      } catch (error) {
        this.updateImage(selectedRow);
        console.log(JSON.stringify(error, null, 2));
      }
    },

    async updateImage(selectedRow) {
      try {
        const { data, error } = await supabase.storage // { data,error }
          .from("employee_avatar")
          .update(selectedRow.id + ".jpg", this.profileImageUpload, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) {
          throw error;
        } else {
          console.log(data);
          console.log("Image updated successfully");
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async inactiveEmployee(employeeId, is_archive) {
      try {
        // console.log(employeeId);
        const { data, error } = await supabase
          .from("employee")
          .update({ is_archive: !is_archive })
          .eq("id", employeeId)
          .select();
        if (error) {
          throw error;
        }
        // console.log("Successfully updated country:", data);
        this.fetchListOfEmployee();
      } catch (error) {
        console.error("Error updating country:", error.message);
      }
    },

    reset() {
      // this.rows = [];
      this.profileImage = null;
      this.profileImageFileExtension = null;
      this.profileImageUpload = null;
      this.publicUrl = null;
    },
  },
});
