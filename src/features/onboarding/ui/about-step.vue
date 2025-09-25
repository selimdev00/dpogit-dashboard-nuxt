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
      "what-do-you-do": string().required(VALIDATION_MESSAGES.required),
      hobby: string().required(VALIDATION_MESSAGES.required),
    }),
  ),
});

defineExpose({ validate });
</script>

<template>
  <div>
    <OnboardingHeader title="Расскажите о себе" />

    <img
      src="/shared/assets/star-group.png"
      class="max-h-[130px] mt-[25px]"
      alt=""
    />

    <div class="px-4 space-y-9 mt-[70px]">
      <form-field name="what-do-you-do">
        <ui-textarea
          id="what-do-you-do"
          label="Чем занимаетесь"
          placeholder="Введите текст"
          variant="secondary"
        />
      </form-field>

      <form-field name="hobby">
        <ui-textarea
          id="hobby"
          label="Хобби и увлечения"
          placeholder="Введите текст"
          variant="secondary"
        />
      </form-field>
    </div>
  </div>
</template>
