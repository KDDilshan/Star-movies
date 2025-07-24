const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


export const updateSearchCount = async (searchCount) => {

console.log("Appwrite Configuration:", {
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID })
}
