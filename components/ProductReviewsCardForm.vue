<script setup>
import { reset } from "@formkit/core";
const deskree = useDeskree();
const route = useRoute();

const { id } = route.params;

let form = reactive({
  rating: 1,
  title: "",
  text: "",
  product_id: id,
});

async function handleSubmit() {
  await deskree.reviews.submit(form);
  reset("postReview");
}
</script>

<template>
  <div>
    <FormKit
      id="postReview"
      type="form"
      :actions="false"
      v-model="form"
      @submit="handleSubmit"
    >
      <FormKit
        type="number"
        label="Rating"
        name="rating"
        validation="required"
      />
      <FormKit type="text" label="Title" name="title" validation="required" />

      <FormKit
        type="textarea"
        name="text"
        label="Review"
        validation="required"
      />
      <AppButton class="btn-primary">Submit Review</AppButton>
    </FormKit>
  </div>
</template>
