<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="space-y-[10px] px-4 z-10">
    <h2
      v-if="title"
      class="text-[32px] leading-[40px] font-semibold uppercase font-advent-pro"
    >
      {{ title }}
    </h2>

    <p v-if="description" class="mt-1 text-sm leading-[20px] font-medium">
      {{ description }}
    </p>
  </div>
</template>
