import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';

const starterPrompts = [
  "What is my biggest weakness?",
  "Which section should I fix first?",
  "Rewrite my summary",
  "Am I ATS-ready?"
];

const ChatAssistant = ({ chatHistory, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handlePromptClick = (prompt) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[800px] max-h-[calc(100vh-8rem)] sticky top-24">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center bg-slate-50 rounded-t-xl">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-md font-bold text-slate-800">Resume Coach</h2>
          <p className="text-xs text-slate-500">Context-aware AI assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-4">
              <Bot className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm text-slate-600 max-w-[80%] mx-auto mb-6">
              Hi! I've analyzed your resume. Ask me anything about it — I'll give you specific, actionable advice.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {starterPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div key={i} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              )}
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}
              >
                {/* Simple markdown parsing for bold text and line breaks */}
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-2" : ""}>
                    {line.split(/(\*\*.*?\*\*)/g).map((part, k) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={k}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start">
             <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
              </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for rewrite, feedback, etc..."
            className="flex-grow bg-slate-50 border border-slate-200 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-r-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
