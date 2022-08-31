import { watchDebounced } from "@vueuse/shared";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore("CartStore", () => {
  const items = ref([]);

  const desktree = useDeskree();
  const { refresh } = useAsyncData("cart", async () => {
    const res = await desktree.user.getCart();

    items.value = res;
  });

  const { refresh: updateCart } = useAsyncData("update-cart", async () => {
    desktree.user.updateCart(items.value);
  });

  desktree.auth.onAuthStateChange(() => {
    refresh();
  });

  watchDebounced(
    () => items.value,
    () => {
      updateCart();
    },
    { deep: true, debounce: 500, maxWait: 1000 }
  );

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
    const p = items.value.find((item) => item.sys.id === product.sys.id);

    if (p) {
      return p.quantity++;
    }

    items.value.push({
      ...product,
      quantity: 1,
    });
  }

  function removeProduct(id) {
    const index = items.value.findIndex((item) => item.sys.id == id);

    if (index === -1) return;

    items.value.splice(index, 1);
  }

  function removeProducts(...ids) {
    return ids.forEach((id) => removeProduct(id));
  }

  return {
    items,
    estimatedTaxes,
    subTotal,
    total,
    addProduct,
    removeProduct,
    removeProducts,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
