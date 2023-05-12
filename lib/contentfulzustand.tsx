import { create } from "zustand";

export interface ContentfulFields {
	frontPage: string[];
	navbar: string[];
	productsPage: string[];
	productPage: string[];
	historyPage: string[];
	aboutPage: string[];
	privacyPage: string[];
	paymentPage: string[];
}

interface IContentfulStore {
	contentfulStore: ContentfulFields;
	setContentfulStore: (contentful: ContentfulFields) => void;
}

export const useContentfulStore = create<IContentfulStore>()((set) => ({
	contentfulStore: {
		frontPage: [],
		navbar: [],
		productsPage: [],
		productPage: [],
		historyPage: [],
		aboutPage: [],
		privacyPage: [],
		paymentPage: [],
	},
	setContentfulStore: (contentful: ContentfulFields) =>
		set({ contentfulStore: contentful }),
}));
