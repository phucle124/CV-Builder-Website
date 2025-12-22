<template>
  <section class="auth-page">
    <!-- key giúp Vue coi như component mới mỗi lần vào /login -->
    <FormLogin :key="$route.fullPath" />
  </section>
  
</template>

<script setup>
import FormLogin from '@/components/FormLogin.vue'
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: start center;
  padding-top: 48px;
}
</style>