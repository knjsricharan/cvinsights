import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UploadZone from '../components/upload/UploadZone';
import { Search, Zap, TrendingUp } from 'lucide-react';

const Landing = ({ resumeState }) => {
  const navigate = useNavigate();
  const { handleUpload, isUploading, isAnalyzing, analysis, handleReset } = resumeState;

  useEffect(() => {
    if (analysis) {
      navigate('/dashboard');
    }
  }, [analysis, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <Navbar onReset={handleReset} showReset={false} />
      
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Your Resume, <span className="text-indigo-400">Analyzed by AI</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get a detailed score, skill gaps, ATS compatibility check, and personalized suggestions in seconds.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8">
          <UploadZone 
            onUpload={handleUpload} 
            isUploading={isUploading} 
            isAnalyzing={isAnalyzing} 
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">1. Upload</h3>
              <p className="text-slate-500 text-sm">Securely extract text from your PDF or DOCX.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">2. Analyze</h3>
              <p className="text-slate-500 text-sm">Advanced LLM evaluates content, structure, and impact.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">3. Improve</h3>
              <p className="text-slate-500 text-sm">Get actionable suggestions and chat with our AI coach.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
