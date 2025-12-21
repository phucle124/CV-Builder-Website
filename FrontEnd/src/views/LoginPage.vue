<template>
  <div class="login-page container">
    <!-- key giúp Vue coi như component mới mỗi lần vào /login -->
    <FormLogin :key="$route.fullPath" />
  </div>
</template>

<script setup>
import FormLogin from '@/components/FormLogin.vue'
</script>

<style scoped>
.login-page {
  padding-top: 60px;
}
</style>