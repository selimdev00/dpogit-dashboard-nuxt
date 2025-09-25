<script setup>
import { useHead } from "nuxt/app";

const images = [
  "/shared/assets/star.png",
  "/shared/assets/star-blurred.png",
  "/shared/assets/star-group.png",
  "/assets/eighth-step-1.png",
  "/assets/eleventh-step-1.png",
  "/assets/fifth-step-1.png",
  "/assets/final-step-1.png",
  "/assets/fourth-step-1.png",
  "/assets/ninth-step-1.png",
  "/assets/request-sent-step-1.png",
  "/assets/request-step-1.png",
  "/assets/second-step-1.png",
  "/assets/seventh-step-1.png",
  "/assets/sixth-step-1.png",
  "/assets/tenth-step-1.png",
  "/assets/third-step-1.png",
  "/assets/twelfth-step-1.png",
  "/assets/welcome-step-1.png",
];

useHead({
  link: images.map((image) => ({
    rel: "preload",
    as: "image",
    href: image,
  })),
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
