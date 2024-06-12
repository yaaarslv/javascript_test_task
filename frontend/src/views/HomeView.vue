<template>
  <div>
    <a-table :columns="columns" :data-source="leads" row-key="name">
      <template #name="{ text }">
        {{ text }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const leads = ref([]);
    const columns = [
      {title: 'Name', dataIndex: 'name', key: 'name'},
      {title: 'Price', dataIndex: 'price', key: 'price'},
      {title: 'Status', dataIndex: 'status', key: 'status'},
      {title: 'Responsible User', dataIndex: 'responsibleUser', key: 'responsibleUser'},
      {title: 'Create Date', dataIndex: 'createDate', key: 'createDate'},
      {title: 'Contacts', dataIndex: 'contacts', key: 'contacts'}
    ];

    onMounted(async () => {
      const response = await axios.get('https://javascript-test-task.onrender.com/api/leads');
      leads.value = response.data;
    });

    return {
      leads,
      columns
    };
  }
});
</script>

<style scoped>
</style>
