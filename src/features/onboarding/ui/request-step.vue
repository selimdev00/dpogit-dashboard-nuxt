<script setup lang="ts">
import { OnboardingHeader } from "@/widgets/onboarding";
import { UiTextarea } from "@/shared/ui/textarea";
import FormField from "@/shared/ui/form-field.vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "@/shared/constants/validation-messages";

const props = defineProps<{ initialValues: Record<string, string> }>();

const { validate } = useForm({
  initialValues: props.initialValues,
  validationSchema: toTypedSchema(
    object({
      "what-do-you-want": string().required(VALIDATION_MESSAGES.required),
    }),
  ),
});

defineExpose({ validate });
</script>

<template>
  <div>
    <OnboardingHeader title="Какой запрос сейчас есть?" />

    <img src="/assets/request-step-1.png" class="mt-[25px]" alt="" />

    <div class="px-4 space-y-9 mt-[70px]">
      <form-field name="what-do-you-want">
        <ui-textarea
          id="what-do-you-want"
          label="Что вы хотите получить от сообщества"
          placeholder="Введите текст"
        />
      </form-field>
    </div>
  </div>
</template>
