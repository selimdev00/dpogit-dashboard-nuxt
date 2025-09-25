<script setup lang="ts">
import { OnboardingHeader } from "@/widgets/onboarding";
import { UiInput } from "@/shared/ui/input";
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectTrigger,
  UiSelectValue,
} from "@/shared/ui/select";
import { russianCities } from "@/shared/constants/cities";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { object, string } from "yup";
import FormField from "@/shared/ui/form-field.vue";
import { VALIDATION_MESSAGES } from "@/shared/constants/validation-messages";

const props = defineProps<{ initialValues: Record<string, string> }>();

const { validate } = useForm({
  initialValues: props.initialValues,
  validationSchema: toTypedSchema(
    object({
      name: string().required(VALIDATION_MESSAGES.required),
      city: string().required(VALIDATION_MESSAGES.required),
    }),
  ),
});

defineExpose({ validate });
</script>

<template>
  <form>
    <OnboardingHeader
      title="Давайте знакомиться"
      description="Скоро мы уже наконец-то все встретимся,  а пока предлагаем познакомиться!"
    />

    <img
      src="/assets/final-step-1.png"
      alt=""
      class="mt-[33px] max-h-[304px] mx-auto"
    />

    <div class="px-4 space-y-9">
      <form-field name="name">
        <ui-input id="name" label="Имя" placeholder="Введите имя" />
      </form-field>

      <form-field name="city">
        <ui-select id="city" label="Город">
          <ui-select-trigger>
            <ui-select-value placeholder="Введите или выберите из списка" />
          </ui-select-trigger>

          <ui-select-content>
            <ui-select-item v-for="city in russianCities" :value="city.value">
              {{ city.label }}
            </ui-select-item>
          </ui-select-content>
        </ui-select>
      </form-field>
    </div>
  </form>
</template>
