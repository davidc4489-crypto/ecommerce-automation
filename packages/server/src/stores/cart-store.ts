interface CartProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageURL?: string;
  runId: string;
}

class CartStore {
  private items: CartProduct[] = [];

  addItem(product: CartProduct): void {
    // Avoid duplicates by id
    const existing = this.items.findIndex((p) => p.id === product.id);
    if (existing >= 0) {
      this.items[existing] = product;
    } else {
      this.items.push(product);
    }
  }

  getItems(): CartProduct[] {
    return [...this.items];
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((p) => p.id !== productId);
  }

  clear(): void {
    this.items = [];
  }
}

export const cartStore = new CartStore();
