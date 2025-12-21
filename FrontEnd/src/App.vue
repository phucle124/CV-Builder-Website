
<template>
  <div id="app">
    <!-- Navbar luôn hiển thị -->
    <Navbar />

    <!-- Nội dung trang sẽ thay đổi theo route -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

