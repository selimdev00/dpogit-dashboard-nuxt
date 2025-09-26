<template>
  <PlansPage />
</template>

<script setup lang="ts">
import { PlansPage } from "@/pages/plans";

definePageMeta({
  layout: "default",
  middleware: "can-plan",
});
</script>