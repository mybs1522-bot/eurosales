
export interface Lead {
  id: string;
  phone: string;
  planId: string;
  date: string;
}

const STORAGE_KEY = 'avada_leads';

export const submitPhoneNumber = async (phoneNumber: string, planId: string = 'unknown'): Promise<boolean> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const currentLeads: Lead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        const newLead: Lead = {
          id: Math.random().toString(36).substr(2, 9),
          phone: phoneNumber || 'Anonymous', // Handle empty phone
          planId: planId,
          date: new Date().toISOString()
        };

        currentLeads.push(newLead);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLeads));
        
        console.log(`[BACKEND] Stored lead locally:`, newLead);
        resolve(true);
      } catch (error) {
        console.error("Failed to save lead", error);
        resolve(false);
      }
    }, 1000);
  });
};

export const getLeads = (): Lead[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').reverse(); // Newest first
  } catch (e) {
    return [];
  }
};

export const clearLeads = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const RAZORPAY_URL = "https://razorpay.com/";
