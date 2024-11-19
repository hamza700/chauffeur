import axios from 'src/utils/axios';

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

// Upload a document
export async function uploadDocument(params: UploadDocumentParams, token: string) {
  const { file, providerId, documentType, index, entityType, entityId } = params;
  const url = constructDocumentUrl(providerId, documentType, index, entityType, entityId);

  const headers = {
    'Content-Type': 'application/octet-stream',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(url, file, { headers });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// Get a document URL
export async function getDocumentUrl(
  providerId: string,
  documentType: string,
  index: number,
  token: string,
  entityType?: 'chauffeurs' | 'vehicles',
  entityId?: string
) {
  const url = constructDocumentUrl(providerId, documentType, index, entityType, entityId);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return url; // Return the constructed URL if successful
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
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
