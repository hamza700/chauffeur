import axios from 'src/utils/axios';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function signUpChauffeur(data: any, token: string) {
  const url = `${SUPABASE_URL}/functions/v1/chauffeur-signup`;

  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error signing up chauffeur:', error);
    throw error;
  }
}
