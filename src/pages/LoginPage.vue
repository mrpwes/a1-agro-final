<script setup>
import { useAuthenticationStore } from "src/stores/authentication";
const storeAuthentication = useAuthenticationStore();
</script>

<template>
  <div class="tw-flex tw-mx-auto tw-h-screen tw-my-auto tw-w-max">
    <div class="tw-min-w-min tw-flex tw-my-auto tw-p-2 tw-bg-primary">
      <div class="tw-flex tw-mb-24 tw-mr-32">
        <img src="./../assets/logo.png" class="tw-size-32" />
        <div class="tw-my-auto tw-pl-3 tw-text-2xl">
          A1 Agro Fertilizer <br />and Chemical Supply
        </div>
      </div>
    </div>
    <div class="tw-w-auto tw-my-auto">
      <div class="tw-flex tw-p-3">
        <q-btn
          @click="storeAuthentication.loginOption = 'employee'"
          v-bind:class="{
            'bg-secondary': storeAuthentication.loginOption === 'employee',
            'tw-bg-grey': storeAuthentication.loginOption === 'admin',
          }"
          class="tw-normal-case tw-rounded-full"
          >Employee Login</q-btn
        >
        <q-btn
          @click="storeAuthentication.loginOption = 'admin'"
          v-bind:class="{
            'tw-bg-grey': storeAuthentication.loginOption === 'employee',
            'bg-secondary': storeAuthentication.loginOption === 'admin',
          }"
          class="tw-mx-4 tw-normal-case tw-rounded-full"
          >Admin Login</q-btn
        >
        <div class="tw-w-24"></div>
      </div>
      <div class="tw-m-3 tw-bg-gray-100 tw-shadow-lg tw-mx-auto tw-rounded-3xl">
        <div class="tw-text-center tw-text-3xl tw-p-4">Sign In</div>
        <div
          class="tw-p-3 tw-rounded-3xl tw-bg-neutral-300 tw-center tw-mx-5 tw-mb-3"
        >
          EMAIL
          <q-input
            borderless
            class="tw-w-full tw-px-2 tw-rounded-3xl tw-bg-white tw-mt-1"
            dense="dense"
            v-model="storeAuthentication.email"
          />
        </div>
        <div class="tw-rounded-3xl tw-bg-neutral-300 tw-center tw-p-3 tw-mx-5">
          <div>PASSWORD</div>
          <q-input
            borderless
            class="tw-w-full tw-px-2 tw-rounded-3xl tw-bg-white tw-mt-1"
            v-model="storeAuthentication.password"
            dense="dense"
            type="password"
          />
        </div>
        <div
          v-if="storeAuthentication.error"
          class="tw-mx-auto tw-w-max tw-text-center"
        >
          <p
            v-if="
              (storeAuthentication.errorMessage = 'Invalid login credentials')
            "
            class="tw-bg-red-200 tw-border tw-border-red-500 tw-px-2 tw-py-1 tw-mt-2"
          >
            <text class="tw-font-bold">Wrong Credentials</text><br />
            Email or password
          </p>
        </div>
        <div class="tw-text-lg tw-text-center tw-p-3">
          <q-btn
            class="tw-bottom-1 tw-rounded-3xl tw-px-7 bg-secondary tw-normal-case"
            @click="storeAuthentication.handleLogin"
            :disable="storeAuthentication.loading"
            >Login</q-btn
          >
        </div>
      </div>
      <div class="tw-h-24"></div>
    </div>
  </div>
</template>

<style scoped></style>
