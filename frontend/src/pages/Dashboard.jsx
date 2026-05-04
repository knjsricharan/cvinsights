import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScoreCard from '../components/dashboard/ScoreCard';
import SectionScores from '../components/dashboard/SectionScores';
import SkillsChart from '../components/dashboard/SkillsChart';
import StrengthsWeaknesses from '../components/dashboard/StrengthsWeaknesses';
import Suggestions from '../components/dashboard/Suggestions';
import ATSFlags from '../components/dashboard/ATSFlags';
import ChatAssistant from '../components/chat/ChatAssistant';

const Dashboard = ({ resumeState }) => {
  const { analysis, chatHistory, handleSendMessage, isChatLoading, handleReset } = resumeState;

  if (!analysis) return null; // Should be handled by router, but just in case

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar onReset={handleReset} showReset={true} />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-800">Your Resume Analysis</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown and actionable advice</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Metrics (60%) */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Top Row: Score & Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScoreCard analysis={analysis} />
              <SectionScores scores={analysis.section_scores} />
            </div>

            {/* Strengths & Weaknesses */}
            <StrengthsWeaknesses 
              strengths={analysis.strengths} 
              weaknesses={analysis.weaknesses} 
            />

            {/* Skills */}
            <SkillsChart 
              found={analysis.skills_found} 
              missing={analysis.skills_missing} 
            />

            {/* Suggestions */}
            <Suggestions suggestions={analysis.suggestions} />

            {/* ATS Flags */}
            <ATSFlags flags={analysis.ats_flags} />
            
          </div>

          {/* Right Column - Chat Assistant (40%) */}
          <div className="w-full lg:w-2/5">
            <ChatAssistant 
              chatHistory={chatHistory} 
              onSendMessage={handleSendMessage} 
              isLoading={isChatLoading} 
            />
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
