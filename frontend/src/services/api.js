import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeResume = async (resumeText, sections) => {
  const response = await api.post('/api/analyze', {
    resume_text: resumeText,
    sections: sections,
  });
  return response.data;
};

export const sendChatMessage = async (messages, resumeContext) => {
  const response = await api.post('/api/chat', {
    messages: messages,
    resume_context: resumeContext,
  });
  return response.data;
};
