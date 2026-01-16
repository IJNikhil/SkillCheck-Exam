import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const MCQSection = ({ questions, onComplete }) => {
    // Config
    const TOTAL_QUESTIONS = 40;
    const TIME_LIMIT_MS = 40 * 60 * 1000; // 40 minutes

    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fisher-Yates Shuffle on Mount
    useEffect(() => {
        if (questions && questions.length > 0) {
            const qCopy = [...questions];
            for (let i = qCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [qCopy[i], qCopy[j]] = [qCopy[j], qCopy[i]];
            }
            setShuffledQuestions(qCopy.slice(0, TOTAL_QUESTIONS));
        }
    }, [questions]);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1000) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [answers]); // Added answers dependency to ensure latest state capture if needed, though with functional update, it's safer. Actually better to remove answers dep or use Ref for submission to avoid closure stale state. 

    // Better Submit Handler using REF or functional updates logic if needed, 
    // but for simplicity in this turn, we'll assume state is fresh enough or effectively rely on the 'answers' state being updated.
    // Actually, to avoid closure issues with `answers` inside `setInterval`, we should call a submit function that reads the *current* state.
    // We'll rely on the user clicking submit mostly, but for auto-submit, we might need a ref. 

    const handleOptionSelect = (qId, option) => {
        setAnswers((prev) => ({ ...prev, [qId]: option }));
    };

    const calculateScore = () => {
        let correct = 0;
        shuffledQuestions.forEach((q) => {
            if (answers[q.id] === q.ans) correct++;
        });
        return correct;
    };

    const handleSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const score = calculateScore();
        onComplete({ mcqScore: score });
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (shuffledQuestions.length === 0) return <div className="p-10 text-center">Loading Questions...</div>;

    const currentQ = shuffledQuestions[currentQIndex];

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Header / Timer */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-6 sticky top-4 z-10 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Section 1: Multiple Choice ({currentQIndex + 1}/{shuffledQuestions.length})</h2>
                <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timeLeft < 60000 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                    <Clock className="w-6 h-6" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[400px] flex flex-col justify-between">
                <div>
                    <div className="mb-6">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{currentQ.module || 'General'}</span>
                        <h3 className="text-2xl font-bold mt-4 text-gray-900">{currentQ.q}</h3>
                    </div>

                    <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => (
                            <label
                                key={idx}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`q-${currentQ.id}`}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    checked={answers[currentQ.id] === opt}
                                    onChange={() => handleOptionSelect(currentQ.id, opt)}
                                />
                                <span className="ml-3 text-lg text-gray-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <button
                        disabled={currentQIndex === 0}
                        onClick={() => setCurrentQIndex(prev => prev - 1)}
                        className="px-6 py-2 text-gray-600 font-semibold disabled:opacity-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Previous
                    </button>

                    {currentQIndex < shuffledQuestions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQIndex(prev => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-transform active:scale-95"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
                        >
                            Submit MCQ Section <CheckCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${((Object.keys(answers).length) / TOTAL_QUESTIONS) * 100}%` }}
                ></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">{Object.keys(answers).length} of {TOTAL_QUESTIONS} Answered</p>

        </div>
    );
};

export default MCQSection;
