import { create } from "zustand";

export interface ContentfulFields {
	frontPage: string[];
	navbar: string[];
	productsPage: string[];
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
	},
	setContentfulStore: (contentful: ContentfulFields) =>
		set({ contentfulStore: contentful }),
}));
