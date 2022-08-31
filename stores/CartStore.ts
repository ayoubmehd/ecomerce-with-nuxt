import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    };
  },
  getters: {
    subTotalInCents() {
      return this.items.reduce(
        (acc, item) => acc + +item.fields.price * item.quantity,
        0
      );
    },
    subTotal() {
      return (this.subTotalInCents / 100).toFixed(2);
    },
    estimatedTaxesInCents() {
      return (this.subTotalInCents * 10) / 100;
    },
    estimatedTaxes() {
      // 10 -> 100
      // x -> 10
      // x * 100 = 10 * 10
      // x = 10 * 10 / 100
      return (this.estimatedTaxesInCents / 100).toFixed(2);
    },
    total() {
      return (
        (+this.subTotalInCents + +this.estimatedTaxesInCents) /
        100
      ).toFixed(2);
    },
  },
  actions: {
    addProduct(product) {
      const p = this.items.find((item) => item.sys.id === product.sys.id);

      if (p) {
        return p.quantity++;
      }

      this.items.push({
        ...product,
        quantity: 1,
      });
    },
    removeProduct(id) {
      const index = this.items.findIndex((item) => (item.sys.id = id));

      if (!index) return;

      this.items.splice(index, 1);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
