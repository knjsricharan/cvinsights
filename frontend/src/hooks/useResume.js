import { useState, useEffect } from 'react';
import { uploadResume, analyzeResume, sendChatMessage } from '../services/api';
import { getSession, saveSession, clearSession, saveMessage, getChatHistory } from '../services/storage';
import { toast } from 'react-hot-toast';

export const useResume = () => {
  const [uploadData, setUploadData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.uploadData) setUploadData(session.uploadData);
      if (session.analysis) setAnalysis(session.analysis);
      if (session.chatHistory) setChatHistory(session.chatHistory);
    }
  }, []);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setUploadData(data);
      saveSession({ uploadData: data, analysis: null, chatHistory: [] });
      
      // Auto analyze
      handleAnalyze(data.extracted_text, data.sections_detected, data);
    } catch (err) {
      let msg = err.message || 'Upload failed';
      if (err.response?.data?.detail) {
        msg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Validation Error: Check your input data.';
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (text, sections, uData = uploadData) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisData = await analyzeResume(text, sections);
      setAnalysis(analysisData);
      saveSession({ uploadData: uData, analysis: analysisData, chatHistory: [] });
      toast.success('Analysis complete!');
    } catch (err) {
      let msg = err.message || 'Analysis failed';
      if (err.response?.data?.detail) {
        msg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Validation Error: Check your input data.';
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (userContent) => {
    if (!userContent.trim()) return;
    
    const newMessage = { role: 'user', content: userContent };
    const newHistory = [...chatHistory, newMessage];
    
    setChatHistory(newHistory);
    saveMessage(newMessage);
    setIsChatLoading(true);
    
    try {
      const response = await sendChatMessage(newHistory, uploadData?.extracted_text || '');
      const assistantMessage = { role: 'assistant', content: response.reply };
      setChatHistory(prev => [...prev, assistantMessage]);
      saveMessage(assistantMessage);
    } catch (err) {
      let msg = err.message || 'Chat failed';
      if (err.response?.data?.detail) {
        msg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Validation Error: Check your input data.';
      }
      toast.error(msg);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReset = () => {
    setUploadData(null);
    setAnalysis(null);
    setChatHistory([]);
    setError(null);
    clearSession();
  };

  return {
    uploadData,
    analysis,
    chatHistory,
    isUploading,
    isAnalyzing,
    isChatLoading,
    error,
    handleUpload,
    handleAnalyze,
    handleSendMessage,
    handleReset
  };
};
