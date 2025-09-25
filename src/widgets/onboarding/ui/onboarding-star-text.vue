<script setup lang="ts">
interface Props {
  text: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="space-y-2">
    <img src="/shared/assets/star.png" class="w-[27px] h-[27px]" alt="" />

    <p class="font-light text-sm font-light">
      {{ text }}
    </p>
  </div>
</template>
