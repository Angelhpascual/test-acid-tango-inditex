export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly image: string,
  ) {}

  static create(props: Omit<Product, "id"> & { id?: string }): Product {
    return new Product(
      props.id || crypto.randomUUID(),
      props.name,
      props.price,
      props.description,
      props.image,
    );
  }

  update(props: Partial<Omit<Product, "id">>): Product {
    return new Product(
      this.id,
      props.name || this.name,
      props.price || this.price,
      props.description || this.description,
      props.image || this.image,
    );
  }
}
