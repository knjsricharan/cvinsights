const SESSION_KEY = 'cvinsights_session';

export const saveSession = (data) => {
  try {
    const sessionData = {
      ...data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save session to localStorage', error);
  }
};

export const getSession = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to parse session from localStorage', error);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session', error);
  }
};

export const saveMessage = (message) => {
  try {
    const session = getSession() || {};
    const chatHistory = session.chatHistory || [];
    chatHistory.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    session.chatHistory = chatHistory;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save message to session', error);
  }
};

export const getChatHistory = () => {
  const session = getSession();
  return session?.chatHistory || [];
};
