import axios from '../../../axios';

export interface Employee {
  id: string;
  name: string;
  role: string;
  email?: string;
  // Add other employee properties as needed
}

/**
 * Fetch employees with the salesupport role
 * @returns Promise with employee data
 */
export const getSalesSupportEmployees = async (): Promise<Employee[]> => {
  try {
    const url = `/employee/salesupport`;
    const response = await axios.get(url);
    
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching sales support employees:', error);
    return [];
  }
};

/**
 * Fetch all employees
 * @returns Promise with all employee data
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const url = `/employee`;
    const response = await axios.get(url);
    
    // Check if the response has the success property and data array
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching all employees:', error);
    return [];
  }
};
