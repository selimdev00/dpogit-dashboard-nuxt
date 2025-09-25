<script setup lang="ts">
import { useField } from "vee-validate";
import { provide } from "vue";

const props = defineProps({
  name: String,
});

const { value, errorMessage } = useField(() => props.name);

provide("form-field-value", value);
</script>

<template>
  <div class="space-y-1">
    <slot />

    <div class="flex justify-end">
      <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
    </div>
  </div>
</template>
