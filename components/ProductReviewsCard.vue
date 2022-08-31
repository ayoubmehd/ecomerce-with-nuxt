<script setup>
const props = defineProps(["rating", "title", "text", "date"]);

const formatedDate = computed(() => {
  return new Date(props.date.split("T")).toLocaleString("en");
});
</script>

<template>
  <div class="card border-2 border-gray-200 rounded-md">
    <div class="card-body">
      <div class="card-actions justify-between text-sm">
        <span>{{ "⭐️".repeat(rating) }}</span>
        <div>{{ formatedDate }}</div>
      </div>
      <h2 class="card-title">
        {{ title }}
      </h2>
      <p>
        {{ text }}
      </p>
    </div>
  </div>
</template>
