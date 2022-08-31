<script setup>
const deskree = useDeskree();
const route = useRoute();
const { id } = route.params;
const isReviewsVisible = ref(false);
const metaData = ref(null);

const {
  pending,
  data: reviews,
  refresh,
} = useAsyncData(
  "reivews:" + id,
  async () => {
    const { data, meta } = await deskree.reviews.get(id);

    metaData.value = meta;

    return data;
  },
  {
    default() {
      return [];
    },
  }
);

const totalScore = computed(() => {
  const { total } = metaData.value || {};

  if (!total) return 0;

  const sum = reviews.value?.reduce(
    (acc, item) => acc + +item.attributes.rating,
    0
  );

  return sum / total;
});

const reivewsByNumberOfStars = computed(() => {
  const reviewsMap = new Map();

  reviews.value.forEach((item) => {
    const { rating } = item.attributes;
    if (reviewsMap.has(rating)) {
      return reviewsMap.set(rating, reviewsMap.get(rating) + 1);
    }
    reviewsMap.set(rating, 1);
  });

  return reviewsMap;
});
</script>

<template>
  <ProductReviewsCardForm class="mt-4" />

  <div class="mb-6">
    <hr class="my-10" />
    <button
      @click="
        isReviewsVisible = !isReviewsVisible;
        isReviewsVisible && refresh();
      "
      class="underline flex items-center"
    >
      {{ !isReviewsVisible ? "View Product Reviews" : "Hide Product Reviews" }}
      <AppSpinner v-if="pending" class="ml-3" size="sm" />
    </button>
  </div>

  <div class="my-10" v-if="isReviewsVisible">
    <h4 class="text-lg mb-5">Customer Reviews and Ratings</h4>
    <div class="flex items-center">
      <div class="card border-2 border-primary p-5">
        <div class="card-content">
          <span class="text-4xl">{{ totalScore }}</span>
          out of
          <span class="text-4xl">5</span>
          <div class="text-2xs text-gray-700">
            ({{ metaData.total }} Reviews)
          </div>
        </div>
        <div v-if="!reviews.length" class="card-content text-center">
          <div class="text-lg bold text-primary">No Reviews Yet</div>
          <button class="text-sm underline">Be the first to write one!</button>
        </div>
      </div>
      <div class="pl-5">
        <div v-for="n in 5" class="text-xs flex items-center">
          {{ n }} Stars

          <input
            class="ml-2 mr-2"
            type="range"
            :value="
              reivewsByNumberOfStars.has(n)
                ? (reivewsByNumberOfStars.get(n) / reviews.length) * 100
                : 0
            "
            max="100"
            disabled
          />
          ({{
            reivewsByNumberOfStars.has(n) ? reivewsByNumberOfStars.get(n) : 0
          }}
          Reviews)
        </div>
      </div>
    </div>
    <button v-if="deskree.loggedInUser.value" class="underline my-5">
      Write a Review
    </button>
    <NuxtLink v-else to="/login">
      <button class="underline my-5">Log in To Write a Review</button>
    </NuxtLink>
    <span class="text-gray-400 mx-2">|</span>
    <button @click="isReviewsVisible = false" class="underline my-5">
      Hide All Reviews
    </button>

    <div>
      <ProductReviewsCard
        v-for="review in reviews"
        :rating="review.attributes.rating"
        :title="review.attributes.title"
        :text="review.attributes.text"
        :date="review.attributes.createdAt"
        class="mb-2"
      />
    </div>
  </div>
</template>
