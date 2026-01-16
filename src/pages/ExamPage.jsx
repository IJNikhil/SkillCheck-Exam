import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullScreenGuard from '../components/FullScreenGuard';
import MCQSection from '../components/MCQSection';
import TypingSection from '../components/TypingSection';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const ExamPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('MCQ'); // MCQ, TYPING
    const [questions, setQuestions] = useState(null);
    const [studentData, setStudentData] = useState(null);

    // Result Holder
    const [results, setResults] = useState({
        mcqScore: 0,
        wpm: 0,
        accuracy: 0
    });

    useEffect(() => {
        // Load Session & Questions
        const loadExam = async () => {
            try {
                const session = sessionStorage.getItem('skillcheck_student');
                if (!session) {
                    navigate('/login');
                    return;
                }
                setStudentData(JSON.parse(session));

                const qData = await api.getQuestions();
                setQuestions(qData); // { mcq: [], typing: {} }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load exam", err);
                alert("Error loading exam questions. Please refresh.");
            }
        };
        loadExam();
    }, [navigate]);

    const handleMCQTimeUp = (data) => {
        setResults(prev => ({ ...prev, ...data }));
        setPhase('TYPING');
    };

    const handleTypingComplete = async (data) => {
        const finalResults = { ...results, ...data };
        setResults(finalResults);

        // Submit to GAS
        try {
            setLoading(true);
            await api.submitResult({
                name: studentData.name,
                phone: studentData.phone,
                mcq_score: finalResults.mcqScore,
                wpm: finalResults.wpm,
                accuracy: finalResults.accuracy
            });
            alert("Exam Submitted Successfully!");
            sessionStorage.clear();
            navigate('/');
        } catch (err) {
            console.error("Submission failed", err);
            alert("Submission failed! Do not close this window. Take a screenshot of your score.");
        } finally {
            setLoading(false);
        }
    };

    const handleSecurityViolation = () => {
        // Force submit with whatever we have
        handleTypingComplete({ wpm: 0, accuracy: 0 }); // Penalty? Or just partial?
        // Logic detail: if stuck in MCQ, we might need a way to get current score inside the component.
        // For now, this just ends the exam.
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <span className="ml-4 text-xl font-bold text-gray-700">Loading Exam Environment...</span>
            </div>
        );
    }

    return (
        <FullScreenGuard onViolation={handleSecurityViolation}>
            {phase === 'MCQ' ? (
                <MCQSection
                    questions={questions.mcq}
                    onComplete={handleMCQTimeUp}
                />
            ) : (
                <TypingSection
                    content={questions.typing}
                    onComplete={handleTypingComplete}
                />
            )}
        </FullScreenGuard>
    );
};

export default ExamPage;
