<script setup lang="ts">
import { UiButton } from "@/shared/ui/button";
import { JsonViewer } from "vue3-json-viewer";
import { useOnboardingStore } from "@/widgets/onboarding/model/store";


const onboardingStore = useOnboardingStore();
</script>

<template>
  <div class="space-y-4 max-w-tg mx-auto w-full px-4">
    <div>Home Page</div>


    <nuxt-link to="/" class="block">
      <ui-button>App Info</ui-button>
    </nuxt-link>

    <ui-button @click="onboardingStore.reset">Reset onboarding</ui-button>

    <nuxt-link to="/onboarding" class="block">
      <ui-button>Onboarding</ui-button>
    </nuxt-link>
  </div>
</template>
