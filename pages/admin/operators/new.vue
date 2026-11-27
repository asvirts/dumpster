<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../../src/components/admin/AdminShell.vue';
import OperatorForm from '../../../src/components/admin/OperatorForm.vue';

defineProps<{ adminEmail?: string | null; cities: { id: string; name: string; state: string }[] }>();
</script>

<template>
  <AdminShell title="Add operator" :admin-email="adminEmail">
    <OperatorForm :cities="cities" action="/admin/operators/new" />
  </AdminShell>
</template>
