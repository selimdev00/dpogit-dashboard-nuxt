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
import { businessNiches } from "@/shared/constants/business-niches";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "@/shared/constants/validation-messages";
import FormField from "@/shared/ui/form-field.vue";

const props = defineProps<{ initialValues: Record<string, string> }>();

const { validate } = useForm({
  initialValues: props.initialValues,
  validationSchema: toTypedSchema(
    object({
      name: string().required(VALIDATION_MESSAGES.required),
      city: string().required(VALIDATION_MESSAGES.required),
      niche: string().required(VALIDATION_MESSAGES.required),
      instagramLink: string().required(VALIDATION_MESSAGES.required),
    }),
  ),
});
defineExpose({ validate });
</script>

<template>
  <div>
    <OnboardingHeader
      title="Актуализируйте данные"
      description="Заполните информацию о себе"
    />

    <div class="px-4 space-y-9 mt-[32px]">
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

      <form-field name="niche">
        <ui-select id="niche" label="Ниша">
          <ui-select-trigger>
            <ui-select-value placeholder="Выберите из списка" />
          </ui-select-trigger>

          <ui-select-content>
            <ui-select-item
              v-for="niche in businessNiches"
              :value="niche.value"
            >
              {{ niche.label }}
            </ui-select-item>
          </ui-select-content>
        </ui-select>
      </form-field>


      <form-field name="instagramLink">
        <ui-input
          id="instagram-link"
          label="Ссылка на инстаграм"
          placeholder="Введите ссылку"
        />
      </form-field>
    </div>
  </div>
</template>
