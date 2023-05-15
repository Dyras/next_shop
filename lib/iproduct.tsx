export interface IProduct {
	id: string;
	slug: string;

	name: string;
	price: number;
	outOfStock: boolean;
	packaging: string;
	articleType: string;
	articleTypeSlug?: string;

	alcoholPercentage?: number;
	manufacturer?: string;
	description?: string;
	country?: string;
	rating?: number;
	imageUrl?: string;
	publishedAt?: Date;
	vintage?: number;
}

export interface IProductSaved extends IProduct {
	amount: number;
}
