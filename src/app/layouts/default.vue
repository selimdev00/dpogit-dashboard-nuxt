<script setup lang="ts">
import { UiButton } from "@/shared/ui/button";
import { useOnboardingStore } from "@/widgets/onboarding/model/store";
import { __DEV__ } from "@/shared/lib/utils";

const onboardingStore = useOnboardingStore();
</script>

<template>
  <div class="h-screen">
    <div class="relative h-full flex items-center justify-center">
      <slot />

      <div v-if="__DEV__" class="absolute top-5 right-5 w-fit flex gap-4">
        <nuxt-link to="/">
          <ui-button>App Info</ui-button>
        </nuxt-link>

        <nuxt-link to="/onboarding">
          <ui-button>Onboarding</ui-button>
        </nuxt-link>

        <ui-button @click="onboardingStore.reset">Reset onboarding</ui-button>
      </div>
    </div>
  </div>
</template>
