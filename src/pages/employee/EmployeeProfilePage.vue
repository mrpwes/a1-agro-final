<script setup>
import { onMounted } from "vue";
import { usePageHeader } from "stores/pageHeader";
import { useProfileStore } from "stores/employee/profilePage/fetchProfileDetails";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Profile";

const storeProfile = useProfileStore();

onMounted(() => {
  storeProfile.getProfileDetails();
  async function checkLinkStatus(url = storePageHeader.profilePicture) {
    try {
      const response = await fetch(url);

      if (response.status === 400) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(`Error fetching the link ${url}:`, error);
    }
  }
});
</script>

<template>
  <div v-if="storeProfile.profileDetails == null">
    Loading TODO: Loading Literally
  </div>
  <div v-else>
    <table
      class="tw-w-7/12 tw-mx-auto tw-mb-3 tw-bg-white tw-shadow-lg tw-table-auto tw-rounded-3xl"
    >
      <tr>
        <td colspan="4" class="tw-text-center tw-border-none">
          <img
            v-if="checkLinkStatus"
            :src="storeProfile.profilePicture"
            class="tw-mx-auto tw-my-3 tw-rounded-full tw-size-48"
          />
          <img
            v-else
            src="https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/sign/utils_image/no_image.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1dGlsc19pbWFnZS9ub19pbWFnZS5wbmciLCJpYXQiOjE3MzAwNzk4NjEsImV4cCI6MTc2MTYxNTg2MX0.2LR8y91sky7CUlfsX7jOxzs8pbqnrqsHW_tBkuJW0qE&t=2024-10-28T01%3A44%3A21.871Z"
            :alt="`Default profile picture`"
            class="tw-mx-auto tw-my-3 tw-rounded-full tw-size-48"
          />

          {{ storeProfile.profileDetails.first_name }},
          {{ storeProfile.profileDetails.last_name }}
          {{ storeProfile.profileDetails.middle_name }}
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <span class="tw-font-semibold">Employee ID:</span>
            {{ storeProfile.profileDetails.company_employee_id }}
          </div>
        </td>
        <td>
          <div>
            <span class="tw-font-semibold">Hired Date:</span>
            {{ storeProfile.profileDetails.hired_date }}
          </div>
        </td>
        <td>
          <div>
            <span class="tw-font-semibold">Position:</span>
            {{ storeProfile.profileDetails.position }}
          </div>
        </td>
        <td>
          <div>
            <span class="tw-font-semibold">Birthday:</span>
            {{ storeProfile.profileDetails.date_of_birth }}
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <span class="tw-font-semibold">Gender:</span>
            {{ storeProfile.profileDetails.gender ? "Male" : "Female" }}
          </div>
        </td>
        <td>
          <span class="tw-font-semibold">Martial Status:</span>
          {{ storeProfile.profileDetails.martial_status }}
        </td>
        <td colspan="2">
          <span class="tw-font-semibold">Contact Number:</span> 09275227444
          TODO:
        </td>
      </tr>
      <tr class="">
        <td colspan="4" class="tw-border-none">
          <span class="tw-font-semibold">Address:</span>
          <span v-if="storeProfile.profileDetails.address[0].region">
            Region {{ storeProfile.profileDetails.address[0].region }}</span
          >
          {{ storeProfile.profileDetails.address[0].province }}
          {{ storeProfile.profileDetails.address[0].city }}
          {{ storeProfile.profileDetails.address[0].barangay }}
          {{ storeProfile.profileDetails.address[0].postal_code }}
          {{ storeProfile.profileDetails.address[0].street }}
          {{ storeProfile.profileDetails.address[0].house_number }}
          <span
            v-if="storeProfile.profileDetails.address[0].additional_information"
          >
            -
            <span class="tw-text-gray-700">{{
              storeProfile.profileDetails.address[0].additional_information
            }}</span></span
          >
        </td>
      </tr>
    </table>

    <table
      class="tw-w-7/12 tw-mx-auto tw-bg-white tw-shadow-lg tw-table-auto tw-rounded-3xl"
    >
      <tr>
        <td colspan="4" class="tw-font-extrabold tw-text-center tw-border-none">
          Payroll Information
        </td>
      </tr>
      <tr>
        <td>
          <span class="tw-font-semibold">PhilHealth Number:</span>
          {{ storeProfile.profileDetails.phil_health_number }}
        </td>
        <td>
          <span class="tw-font-semibold">Pag-IBIG Number:</span>
          {{ storeProfile.profileDetails.pag_ibig_number }}
        </td>
        <td>
          <span class="tw-font-semibold">SSS Number:</span>
          {{ storeProfile.profileDetails.sss_number }}
        </td>
      </tr>
      <tr>
        <td class="tw-border-none">
          <span class="tw-font-semibold">BIR Tin:</span>
          {{ storeProfile.profileDetails.bir_tin }}
        </td>
        <td colspan="2" class="tw-border-none">
          <span class="tw-font-semibold">Rate per day:</span>₱{{
            storeProfile.profileDetails.rate_per_day
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
td {
  @apply tw-p-3 tw-border tw-border-gray-200;
}
</style>
