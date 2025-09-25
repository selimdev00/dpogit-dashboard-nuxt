<script setup lang="ts">
import { provide, ref } from "vue";
import type { SelectRootEmits, SelectRootProps } from "reka-ui";
import { SelectRoot, useForwardPropsEmits } from "reka-ui";
import { useVModel } from "@vueuse/core";

const props = defineProps<SelectRootProps & { label?: string; id?: string }>();
const emits = defineEmits<SelectRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const opened = ref<boolean>(false);
provide("opened", opened);

const modelValue =
  inject("form-field-value") ||
  useVModel(props, "modelValue", emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });
</script>

<template>
  <div class="bg-[rgba(0,0,0,0.1)] border-b border-[rgba(51,51,51,1)]">
    <SelectRoot
      @update:open="opened = $event"
      data-slot="select"
      v-bind="forwarded"
      v-model="modelValue"
    >
      <label
        v-if="label"
        :for="id"
        class="w-6 h-5 font-normal text-xs leading-5 text-white flex-none order-0 flex-grow-0 px-[12px]"
        >{{ label }}</label
      >

      <slot />
    </SelectRoot>
  </div>
</template>
