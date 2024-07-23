<script setup>
import { usePageHeader } from "stores/pageHeader";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Support";
</script>

<template>
  <div
    class="tw-w-10/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse"
  >
    <h4 class="tw-text-center tw-font-bold tw-text-2xl tw-py-3">Contact Us</h4>
    <div
      class="tw-flex tw-gap-4 tw-flex-wrap tw-flex-row tw-justify-evenly tw-text-center"
    >
      <div class="md:tw-flex-1 tw-flex-wrap">
        <q-avatar class="tw-rounded-xl tw-size-40 tw-flex-initial"
          ><img src="../assets/boy-avatar.png" /></q-avatar
        ><br />Beley, Edwin Carl C.<br />beley.edwincarl@ue.edu.ph
      </div>
      <div class="tw-flex-1">
        <q-avatar class="tw-rounded-xl tw-size-40"
          ><img src="../assets/boy-avatar.png" /></q-avatar
        ><br />Dolar, James Jose S.<br />dolar.jamesjose@ue.edu.ph
      </div>
      <div class="tw-flex-1">
        <q-avatar class="tw-rounded-xl tw-size-40"
          ><img src="../assets/boy-avatar.png" /></q-avatar
        ><br />Hernandez, Emmanuel Clifford R.<br />hernandez.emmanuelclifford@ue.edu.ph
      </div>
    </div>
    <div
      class="tw-flex tw-gap-4 tw-flex-row tw-justify-evenly tw-text-center tw-mt-3 tw-mb-3"
    >
      <div class="">
        <q-avatar class="tw-rounded-xl tw-size-40"
          ><img src="../assets/boy-avatar.png" /></q-avatar
        ><br />Maraan, Arnieno P.<br />maraan.arnieno@ue.edu.ph
      </div>
      <div class="">
        <q-avatar class="tw-rounded-xl tw-size-40"
          ><img src="../assets/boy-avatar.png" /></q-avatar
        ><br />Sanchez, Mark Jester S.<br />sanchez.markjester@ue.edu.ph
      </div>
    </div>
  </div>
</template>

<style scoped>
h4 {
  margin: 0px;
  padding-bottom: 20px;
}

.rounded {
  border-radius: 25px;
}

.solidBorder {
  border: 1px solid;
}

.raisedbox {
  padding: 20px;
  /* border: 1px solid #669900; */
  box-shadow: 0px 0px 20px -9px rgb(108, 109, 106);
  -webkit-box-shadow: 0px 0px 20px -9px rgb(108, 109, 106);
  -moz-box-shadow: 0px 0px 20px -9px rgb(108, 109, 106);
}
</style>
