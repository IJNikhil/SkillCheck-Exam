import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const TestSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const startTest = () => {
        setLoading(true);
        // Simulate a brief loading state for UX
        setTimeout(() => {
            // We will trigger fullscreen in the next route or here if possible, 
            // but browsers require user interaction. The click here is the interaction.
            // We'll let the FullScreenGuard handle the enforcement, but we could request it here too.
            navigate('/exam');
        }, 800);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-slate-800 p-8 text-white">
                    <h1 className="text-3xl font-bold">Welcome, Candidate</h1>
                    <p className="opacity-80 mt-2">Please select your assigned examination below.</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="border-2 border-blue-100 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    SkillCheck General Assessment (Batch A)
                                </h2>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 60 Mins</span>
                                    <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Strict Mode</span>
                                    <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 40 MCQ + Typing</span>
                                </div>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    This exam consists of two sections: Multiple Choice Questions (40 mins) and a Typing Speed Test (20 mins).
                                    ensure you are in a quiet environment. <br />
                                    <span className="font-semibold text-red-500">Warning: Switching tabs or exiting full-screen will result in auto-submission.</span>
                                </p>
                            </div>

                            <button
                                onClick={startTest}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95 flex items-center gap-2"
                            >
                                {loading ? 'Loading...' : 'Start Test'} <Play className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center text-sm text-gray-400">
                    Session ID: {sessionStorage.getItem('skillcheck_student') ? JSON.parse(sessionStorage.getItem('skillcheck_student')).id : 'GUEST'}
                </div>

            </div>
        </div>
    );
};

export default TestSelection;
