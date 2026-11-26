<script setup lang="ts">
import '../src/styles/global.css';
import { useShared } from '@void/vue';
import SiteHeader from '../src/components/SiteHeader.vue';
import SiteFooter from '../src/components/SiteFooter.vue';

const shared = useShared();
</script>

<template>
  <SiteHeader :path="shared?.path ?? '/'" :search="shared?.search" :user-email="shared?.userEmail" />
  <main class="flex-1"><slot /></main>
  <SiteFooter />
</template>
