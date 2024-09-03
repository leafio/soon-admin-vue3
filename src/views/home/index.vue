<template>
  <div>
    <div>Home</div>
    <RouterLink to="/system/user">User</RouterLink>
    <div v-scroll class="h-[200px] w-[100px] bg-blue-100">
      <div v-for="(item, index) in Array(100).fill(1)" :key="index" class="w-[120px]">胜多负少发射点发发顺丰的s{{ index }}</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
