<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/shared/stores/auth";
import FormField from "@/shared/ui/form-field.vue";
import { Input } from "@/shared/ui/input";

const authStore = useAuthStore();
const loginError = ref("");

const schema = yup.object({
  email: yup
    .string()
    .email("Введите корректный email")
    .required("Email обязателен"),
  password: yup
    .string()
    .min(1, "Пароль обязателен")
    .required("Пароль обязателен"),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  loginError.value = "";

  const success = await authStore.login(values);

  if (success) {
    await navigateTo("/");
  } else {
    loginError.value = "Неверный email или пароль";
  }
});
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <FormField name="email">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input id="email" name="email" placeholder="user@dpogti.ru" />
      </FormField>

      <FormField name="password">
        <label for="password" class="text-sm font-medium">Пароль</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </FormField>

      <button
        type="submit"
        :disabled="authStore.isLoading"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        <span v-if="authStore.isLoading" class="mr-2">
          <svg
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
        {{ authStore.isLoading ? "Вход..." : "Войти" }}
      </button>

      <div v-if="loginError" class="text-sm text-red-500 text-center">
        {{ loginError }}
      </div>
    </form>
  </div>
</template>
