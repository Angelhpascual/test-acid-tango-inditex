export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly image: string,
  ) {
    this.validateProduct();
  }

  private validateProduct(): void {
    if (!this.id) throw new Error("ID is required");
    if (!this.name) throw new Error("Name is required");
    if (this.price <= 0) throw new Error("Price must be positive");
    if (!this.description) throw new Error("Description is required");
    if (!this.image) throw new Error("Image URL is required");
  }

  static create(props: Omit<Product, "id"> & { id?: string }): Product {
    return new Product(
      props.id || crypto.randomUUID(),
      props.name,
      props.price,
      props.description,
      props.image,
    );
  }

  update(updates: Partial<Omit<Product, "id">>): Product {
    return new Product(
      this.id,
      updates.name ?? this.name,
      updates.price ?? this.price,
      updates.description ?? this.description,
      updates.image ?? this.image,
    );
  }

  clone(): Product {
    return new Product(
      this.id,
      this.name,
      this.price,
      this.description,
      this.image,
    );
  }
}
