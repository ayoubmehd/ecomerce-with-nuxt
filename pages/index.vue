<script setup>
const productStore = useProductStore();
const { refresh } = useAsyncData("products", async () =>
  productStore.fetchProducts()
);
watch(
  () => productStore.activeFilters,
  () => {
    refresh();
  }
);
</script>
<template>
  <div>
    <HomeHero />

    <div class="flex justify-end mt-10 px-10">
      <ProductFilters />
    </div>

    <div
      v-if="productStore.products"
      class="gap-7 p-10 sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-wrap justify-items-stretch items-stretch"
    >
      <transition-group name="products">
        <ProductCard
          v-for="product in productStore.products"
          :product="product"
          :key="product.sys.id"
          class="mb-5"
        />
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.products {
  margin-bottom: 50px;
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.products-enter {
  opacity: 0;
}

.products-leave-to,
.products-leave-active {
  transform: scale(0.5) translatey(-30px);
  opacity: 0;
}

.product-animate {
  transition: all 0.35s ease-in-out;
}
</style>
