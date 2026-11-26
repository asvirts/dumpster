<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{ adminEmail?: string | null; message: string; errors: string[] }>();
</script>

<template>
  <AdminShell title="CSV import" :admin-email="adminEmail">
    <div class="card max-w-2xl p-6">
      <p class="text-sm text-muted">
        Upload operators as <strong>pending</strong> (not published). Required column: <code>name</code>.
        Optional: phone, email, website, description, city, state, pricing_min, pricing_max, sizes
        (e.g. <code>10|15|20</code>), materials (e.g. <code>construction|mixed</code>).
      </p>

      <p v-if="message" class="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900" role="status">
        {{ message }}
      </p>
      <ul v-if="errors.length > 0" class="mt-3 list-disc pl-5 text-sm text-red-700">
        <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
      </ul>

      <form method="POST" enctype="multipart/form-data" class="mt-6 space-y-4">
        <div>
          <label class="label" for="csv">CSV file</label>
          <input class="input" id="csv" name="csv" type="file" accept=".csv,text/csv" required />
        </div>
        <button type="submit" class="btn-primary">Import</button>
      </form>

      <pre class="mt-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">name,phone,email,city,state,sizes,materials,pricing_min,pricing_max
Acme Dumpsters,5551234567,hi@acme.example,Houston,TX,10|15|20,construction|mixed,350,600</pre>
    </div>
  </AdminShell>
</template>
