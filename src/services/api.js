import axios from 'axios';

// Get the URL from environment variables or fallback (useful for dev before .env is set)
// In production, this must be set in the build environment or .env file
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

if (!GOOGLE_SCRIPT_URL) {
    console.warn("VITE_GOOGLE_SCRIPT_URL is not defined in .env file. API calls will fail.");
}

const api = {
    /**
     * Generic fetch function for GET requests
     * @param {string} action - The action parameter for the doGet function
     */
    fetch: async (action) => {
        try {
            const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=${action}`);
            return response.data;
        } catch (error) {
            console.error(`API Error fetching ${action}:`, error);
            throw error;
        }
    },

    /**
     * Generic post function for POST requests
     * @param {string} action - The action identifier for the doPost function
     * @param {object} payload - The data to send
     */
    post: async (action, payload) => {
        try {
            // Google Apps Script requires text/plain to avoid CORS preflight issues in some cases, 
            // but Axios sends JSON by default.
            // We'll use the robust method of sending stringified JSON as body.
            const response = await axios.post(GOOGLE_SCRIPT_URL, JSON.stringify({ action, ...payload }), {
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`API Error posting ${action}:`, error);
            throw error;
        }
    },

    // Specific API methods
    getStudents: () => api.fetch('getStudents'),
    getQuestions: () => api.fetch('getQuestions'),
    addStudent: (student) => api.post('addStudent', student),
    submitResult: (result) => api.post('submitResult', result),
};

export default api;
