import axios from 'src/utils/axios';

import { supabase } from 'src/lib/supabase';

const STORAGE_URL = 'https://sqfdmsikxjdvssdlxcrc.supabase.co/storage/v1/object/documents';

type UploadDocumentParams = {
  file: File;
  providerId: string;
  documentType: string;
  index: number;
  entityType?: 'chauffeurs' | 'vehicles';
  entityId?: string;
};

// Helper function to construct the document URL
const constructDocumentUrl = (
  providerId: string,
  documentType: string,
  index: number,
  entityType?: 'chauffeurs' | 'vehicles',
  entityId?: string
) => {
  if (entityType && entityId) {
    return `${STORAGE_URL}/providers/${providerId}/${entityType}/${entityId}/${documentType}/${index}`;
  }
  return `${STORAGE_URL}/providers/${providerId}/${documentType}/${index}`;
};

// Helper function to check if file exists
async function checkFileExists(url: string, token: string) {
  try {
    await axios.head(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true; // File exists
  } catch (error) {
    return false; // File doesn't exist
  }
}

// Upload a document
export async function uploadDocument(params: UploadDocumentParams, token: string) {
  const { file, providerId, documentType, index, entityType, entityId } = params;
  const url = constructDocumentUrl(providerId, documentType, index, entityType, entityId);

  const headers = {
    'Content-Type': file.type || 'image/*',
    Authorization: `Bearer ${token}`,
  };

  try {
    // Check if file already exists
    const fileExists = await checkFileExists(url, token);

    // Use PUT if file exists, POST if it doesn't
    const method = fileExists ? 'put' : 'post';
    const response = await axios({
      method,
      url,
      data: file,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// Get a document URL
export async function getDocument(
  providerId: string,
  documentType: string,
  index: number,
  token: string,
  entityType?: 'chauffeurs' | 'vehicles',
  entityId?: string
) {
  const path =
    entityType && entityId
      ? `providers/${providerId}/${entityType}/${entityId}/${documentType}`
      : `providers/${providerId}/${documentType}`;

  try {
    // List all files in the directory
    const { data: files, error: listError } = await supabase.storage.from('documents').list(path);

    if (listError) throw listError;

    // Get signed URLs for all files
    const signedUrls = await Promise.all(
      files.map(async (file, idx) => {
        const {
          data: { signedUrl },
          error,
        } = await supabase.storage.from('documents').createSignedUrl(`${path}/${file.name}`, 3600);

        if (error) return null;
        return signedUrl;
      })
    );

    // Filter out any null values and return all valid URLs
    return signedUrls.filter(Boolean);
  } catch (error) {
    console.error('Error getting documents:', error);
    return null;
  }
}

// Batch upload multiple documents
export async function uploadDocuments(
  files: File[],
  providerId: string,
  documentType: string,
  token: string,
  entityType?: 'chauffeurs' | 'vehicles',
  entityId?: string
) {
  const uploadPromises = files.map((file, index) =>
    uploadDocument(
      {
        file,
        providerId,
        documentType,
        index,
        entityType,
        entityId,
      },
      token
    )
  );

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple documents:', error);
    throw error;
  }
}
