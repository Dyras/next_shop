export interface IProductSaved {
    id: string;
    name: string;
    manufacturer?: string;
    description?: string;
    articleType: string;
    country?: string;
    price: number;
    rating?: number;
    imageUrl?: string;
    outOfStock: boolean;
    slug: string;
    publishedAt?: Date;
    packaging: string;
    vintage?: number;
    amount?: number;
  }