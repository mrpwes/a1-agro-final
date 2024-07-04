import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useViewEmployeeStore = defineStore("viewEmployee", {
  state: () => ({
    rows: [],
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
    async updateEmployeeData(selectedRow) {
      try {
        this.updateEmployeePhoneNumber(selectedRow);
        this.updateEmployeeAddress(selectedRow);
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
          })
          .eq("id", selectedRow.id)
          .select();
        if (error) {
          throw error;
        }
        this.fetchListOfEmployee();
        console.log("Successfully updated");
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
        console.log("Successfully Address");
        console.table(data);
      } catch (error) {
        console.error("Error updating:", error.message);
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
        console.log("Successfully Phone Number");
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
          is_archive
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

    async getProfilePicture() {
      try {
        const { data, error } = await supabase.storage
          .from("users")
          .createSignedUrl(
            "c9e5eeaf-913c-48d2-9f0b-109ae109ac83/profile_image.png", //TODO: .createSignedUrl(id + "/profile-image.png", 60);
            60
          );
        if (error) {
          throw error;
        } else {
          console.log(data.signedUrl);
          this.profilePicture = data.signedUrl;
        }
      } catch (error) {
        // console.log("Error getting profile picture:", error.message);
        this.getDefaultProfile();
      }
    },
    getDefaultProfile() {
      this.profilePicture =
        "https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/public/public-bucket/default-profile-image/avatar.png";
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
        console.log("Successfully updated country:", data);
        this.fetchListOfEmployee();
      } catch (error) {
        console.error("Error updating country:", error.message);
      }
    },
  },
});
