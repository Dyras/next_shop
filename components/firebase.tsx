import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBC1NJAt-cD7SoXhFKL3YzLMrxuI0C-lBA",
	authDomain: "angularshop-3d1ea.firebaseapp.com",
	databaseURL: "https://angularshop-3d1ea.firebaseio.com",
	projectId: "angularshop-3d1ea",
	storageBucket: "angularshop-3d1ea.appspot.com",
	messagingSenderId: "701167913609",
	appId: "1:701167913609:web:240ec3668f65c2ac559458",
};

// Initialize a Firebase app
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

export { db };
