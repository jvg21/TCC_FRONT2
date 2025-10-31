import type { Document } from "./types";

/**
 * Calcula a similaridade de cosseno entre dois vetores de embeddings
 * Retorna um valor entre -1 e 1, onde 1 é similaridade perfeita
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    console.error('Invalid vectors for similarity calculation');
    return 0;
  }

  // Produto escalar
  let dotProduct = 0;
  // Magnitude do vetor A
  let magnitudeA = 0;
  // Magnitude do vetor B
  let magnitudeB = 0;

  // Calculando os valores
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  // Evitar divisão por zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // Calcular a similaridade do cosseno
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Interface para documentos com score de similaridade
 */
export interface DocumentWithSimilarity extends Document {
  similarityScore: number;
}

/**
 * Opções para a busca de documentos similares
 */
export interface SimilaritySearchOptions {
  maxResults?: number;  // Número máximo de resultados a serem retornados
  threshold?: number;   // Limiar mínimo de similaridade (0-1)
  forceResults?: boolean; // Forçar retorno de resultados mesmo abaixo do threshold
  minResults?: number;  // Número mínimo de resultados a retornar (se disponíveis)
}

/**
 * Função para encontrar documentos mais similares com base em embeddings
 * @param documents Array de documentos onde buscar
 * @param queryEmbedding Embedding da consulta
 * @param options Opções de busca
 * @returns Array de documentos ordenados por similaridade
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

  // Valores padrão otimizados
  const {
    maxResults = 5,
    threshold = 0.3, // Threshold reduzido para 0.3 (era 0.5)
    forceResults = false, // Forçar retorno de alguns resultados mesmo se abaixo do threshold
    minResults = 3 // Tentar retornar pelo menos 3 resultados se disponíveis
  } = options;

  // Filtrar documentos que possuem embeddings
  const documentsWithEmbeddings = documents.filter(
    doc => doc.Embedding && doc.Embedding.length > 0
  );

  if (documentsWithEmbeddings.length === 0) {
    console.warn('No documents with embeddings found');
    return [];
  }

  // Log para debug
  console.log(`Searching among ${documentsWithEmbeddings.length} documents with embeddings`);

  // Calcular a similaridade para cada documento
  const documentsWithSimilarity = documentsWithEmbeddings.map(doc => {
    const similarity = cosineSimilarity(queryEmbedding, doc.Embedding || []);
    return {
      ...doc,
      similarityScore: similarity
    } as DocumentWithSimilarity;
  });

  // Ordenar todos por similaridade (do maior para o menor)
  const sortedDocuments = documentsWithSimilarity.sort(
    (a, b) => b.similarityScore - a.similarityScore
  );

  // Log dos top scores para debug
  if (sortedDocuments.length > 0) {
    console.log("Top similarity scores:", 
      sortedDocuments.slice(0, 5).map(d => 
        `${d.similarityScore.toFixed(3)} - ${d.Title?.substring(0, 30)}`
      )
    );
  }

  // Se forceResults está ativado, retorne pelo menos minResults documentos se disponíveis
  if (forceResults && sortedDocuments.length > 0) {
    // Sempre retorne pelo menos minResults documentos (ou todos se houver menos)
    const numToReturn = Math.min(Math.max(minResults, maxResults), sortedDocuments.length);
    return sortedDocuments.slice(0, numToReturn);
  }
  
  // Caso contrário, aplique o threshold e depois retorne o máximo de resultados
  const filteredDocuments = sortedDocuments.filter(
    doc => doc.similarityScore >= threshold
  );

  return filteredDocuments.slice(0, maxResults);
}

/**
 * Função auxiliar para classificar documentos com base em uma consulta de texto
 * @param documents Array de documentos para buscar
 * @param query Texto da consulta
 * @param generateEmbedding Função para gerar embeddings
 * @param options Opções de busca
 * @returns Promise com os documentos similares
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