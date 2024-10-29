<script setup>
// import { useGlobalStore } from "stores/global";
import { usePageHeader } from "stores/pageHeader";
import { computed, onMounted } from "vue";

// const store = useGlobalStore();
const storePageHeader = usePageHeader();

onMounted(() => {
  storePageHeader.getProfilePicture();

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

storePageHeader.getCurrentUserName();
</script>

<template>
  <q-header elevated class="tw-text-black">
    <div
      class="tw-flex tw-justify-between tw-items-center tw-p-2 tw-bg-primary tw-bg-gray-100"
    >
      <div class="tw-col-span-2 tw-inline-flex">
        <q-btn
          flat
          @click="storePageHeader.toggeDrawer"
          round
          dense
          icon="menu"
        />
        <h2 class="tw-text-3xl tw-font-extrabold tw-pl-3">
          {{ storePageHeader.currentPage }}
        </h2>
      </div>
      <router-link class="no-decoration" to="dashboard">
        <div
          class="tw-mr-5 designed raisedbox"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding-top: 3px;
            padding-bottom: 3px;
            padding-right: 3px;
            padding-left: 15px;
          "
        >
          <h6 class="col q-ma-none text-weight-regular">
            {{ storePageHeader.currentUserName }}&nbsp;&nbsp;
          </h6>
          <q-avatar size="2.5rem">
            <img v-if="checkLinkStatus" :src="storePageHeader.profilePicture" />
            <img
              v-else
              src="https://tkdqxpxpavnjhiitssss.supabase.co/storage/v1/object/sign/utils_image/no_image.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1dGlsc19pbWFnZS9ub19pbWFnZS5wbmciLCJpYXQiOjE3MzAwNzk4NjEsImV4cCI6MTc2MTYxNTg2MX0.2LR8y91sky7CUlfsX7jOxzs8pbqnrqsHW_tBkuJW0qE&t=2024-10-28T01%3A44%3A21.871Z"
              :alt="`Default profile picture`"
            />
          </q-avatar>
        </div>
      </router-link>
    </div>
  </q-header>
</template>

<style scoped>
.no-decoration {
  text-decoration: none;
  color: inherit;
}

.designed {
  padding-left: 10%;
  border-radius: 50px 50px 50px;
  background-color: white;
}

.raisedbox {
  padding: 10px;
  border: 1px solid #8dba2c;
  box-shadow: 4px 5px 0px 0px #8dba2c;
  -webkit-box-shadow: 4px 5px 0px 0px #8dba2c;
  -moz-box-shadow: 4px 5px 0px 0px #8dba2c;
}
</style>
