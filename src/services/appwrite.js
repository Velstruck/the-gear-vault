import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Collection IDs - using environment variables
export const PRODUCTS_COLLECTION_ID = 'products';
export const SUGGESTIONS_COLLECTION_ID = 'suggestions';
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// Products Collection Schema:
// - name (string)
// - category (string)
// - image (string, URL or file ID)
// - amazonUrl (string, optional)
// - flipkartUrl (string, optional)
// - otherUrl (string, optional)

export const createProduct = async (productData) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            'unique()',
            productData
        );
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createSuggestion = async (suggestionData) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            SUGGESTIONS_COLLECTION_ID,
            'unique()',
            suggestionData
        );
    } catch (error) {
        console.error('Error creating suggestion:', error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    try {
        return await storage.createFile(
            BUCKET_ID,
            'unique()',
            file
        );
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}; 