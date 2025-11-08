import type { Document } from "./types";

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    console.error('Invalid vectors for similarity calculation');
    return 0;
  }

  let dotProduct = 0;
  
  let magnitudeA = 0;
  
  let magnitudeB = 0;

  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export interface DocumentWithSimilarity extends Document {
  similarityScore: number;
}

export interface SimilaritySearchOptions {
  maxResults?: number;  
  threshold?: number;   
  forceResults?: boolean; 
  minResults?: number;  
}

/**
 
  @param documents 
  @param queryEmbedding 
  @param options 
  @returns 
 */
export function findSimilarDocuments(
  documents: Document[],
  queryEmbedding: number[],
  options: SimilaritySearchOptions = {}
): DocumentWithSimilarity[] {
  if (!queryEmbedding || queryEmbedding.length === 0) {
    console.error('Query embedding is empty');
    return [];
  }

  if (!documents || documents.length === 0) {
    console.warn('No documents provided for similarity search');
    return [];
  }

  
  const {
    maxResults = 5,
    threshold = 0.3, 
    forceResults = false, 
    minResults = 3 
  } = options;

  
  const documentsWithEmbeddings = documents.filter(
    doc => doc.Embedding && doc.Embedding.length > 0
  );

  if (documentsWithEmbeddings.length === 0) {
    console.warn('No documents with embeddings found');
    return [];
  }

  
  console.log(`Searching among ${documentsWithEmbeddings.length} documents with embeddings`);

  
  const documentsWithSimilarity = documentsWithEmbeddings.map(doc => {
    const similarity = cosineSimilarity(queryEmbedding, doc.Embedding || []);
    return {
      ...doc,
      similarityScore: similarity
    } as DocumentWithSimilarity;
  });

  
  const sortedDocuments = documentsWithSimilarity.sort(
    (a, b) => b.similarityScore - a.similarityScore
  );

  
  if (sortedDocuments.length > 0) {
    console.log("Top similarity scores:", 
      sortedDocuments.slice(0, 5).map(d => 
        `${d.similarityScore.toFixed(3)} - ${d.Title?.substring(0, 30)}`
      )
    );
  }

  
  if (forceResults && sortedDocuments.length > 0) {
    
    const numToReturn = Math.min(Math.max(minResults, maxResults), sortedDocuments.length);
    return sortedDocuments.slice(0, numToReturn);
  }
  
  const filteredDocuments = sortedDocuments.filter(
    doc => doc.similarityScore >= threshold
  );

  return filteredDocuments.slice(0, maxResults);
}

/**
 
  @param documents 
  @param query 
  @param generateEmbedding 
  @param options 
  @returns 
 */
export async function searchSimilarDocuments(
  documents: Document[],
  query: string,
  generateEmbedding: (text: string) => Promise<number[] | null>,
  options: SimilaritySearchOptions = {}
): Promise<DocumentWithSimilarity[]> {
  try {
    console.log(`Generating embedding for query: "${query}"`);
    
    const queryEmbedding = await generateEmbedding(query);
    
    if (!queryEmbedding) {
      throw new Error("Failed to generate embedding for query");
    }
    
    console.log(`Embedding generated with length: ${queryEmbedding.length}`);
    
    return findSimilarDocuments(documents, queryEmbedding, options);
    
  } catch (error) {
    console.error("Error in semantic search:", error);
    return [];
  }
}