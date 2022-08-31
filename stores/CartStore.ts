import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore("CartStore", () => {
  const items = ref([]);

  const subTotalInCents = computed<number>(() => {
    return items.value.reduce(
      (acc, item) => acc + +item.fields.price * item.quantity,
      0
    );
  });

  const estimatedTaxesInCents = computed<number>(() => {
    // 10 -> 100
    // x -> 10
    // x * 100 = 10 * 10
    // x = 10 * 10 / 100
    return (subTotalInCents.value * 10) / 100;
  });

  const estimatedTaxes = computed<string>(() => {
    return (estimatedTaxesInCents.value / 100).toFixed(2);
  });

  const subTotal = computed<string>(() => {
    return (subTotalInCents.value / 100).toFixed(2);
  });

  const total = computed<string>(() => {
    return (
      (+subTotalInCents.value + +estimatedTaxesInCents.value) /
      100
    ).toFixed(2);
  });

  function addProduct(product) {
    const p = this.items.find((item) => item.sys.id === product.sys.id);

    if (p) {
      return p.quantity++;
    }

    return this.items.push({
      ...product,
      quantity: 1,
    });
  }
  function removeProduct(id) {
    const index = this.items.findIndex((item) => (item.sys.id = id));

    if (!index) return;

    this.items.splice(index, 1);
  }

  return {
    items,
    estimatedTaxes,
    subTotal,
    total,
    addProduct,
    removeProduct,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
