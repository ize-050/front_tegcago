import axios from '../../../axios';

export interface WorkSubmitResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

/**
 * Submit purchase data to the server
 * @param formData The form data to submit
 * @returns Promise with the response data
 */
export const submitPurchase = async (formData: any): Promise<WorkSubmitResponse> => {
  try {
    const url = `/finance/submitPurchase`;
    const response = await axios.post(url, formData);
    
    return response.data;
  } catch (error) {
    console.error('Error submitting purchase data:', error);
    return {
      status: 'error',
      message: 'Failed to submit purchase data. Please try again.'
    };
  }
};

/**
 * Get work by ID
 * @param workId The ID of the work to fetch
 * @returns Promise with the work data
 */
export const getWorkById = async (workId: string): Promise<any> => {
  try {
    const url = `/finance/work/${workId}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    
    console.warn('Unexpected API response format:', response.data);
    return null;
  } catch (error) {
    console.error('Error fetching work by ID:', error);
    return null;
  }
};
