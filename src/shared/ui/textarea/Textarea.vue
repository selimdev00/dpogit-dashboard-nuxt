<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { inject } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/shared/lib/utils";
import type { TextareaVariants } from ".";
import { textareaVariants, textareaWrapperVariants } from ".";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
  label?: string;
  id?: string;
  variant?: TextareaVariants["variant"];
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue =
  inject("form-field-value") ||
  useVModel(props, "modelValue", emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });
</script>

<template>
  <div :class="cn(textareaWrapperVariants({ variant }))">
    <label
      v-if="label"
      :for="id"
      class="w-6 h-5 font-normal text-xs leading-5 text-white flex-none order-0 flex-grow-0 px-[12px]"
      >{{ label }}</label
    >

    <textarea
      :id="id"
      v-model="modelValue"
      data-slot="textarea"
      :class="cn(textareaVariants({ variant }), props.class)"
      :placeholder="placeholder"
    />
  </div>
</template>
