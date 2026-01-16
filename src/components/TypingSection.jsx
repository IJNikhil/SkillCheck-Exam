import React, { useState, useEffect, useRef } from 'react';
import { Clock, Keyboard, Activity } from 'lucide-react';

const TypingSection = ({ content, onComplete }) => {
    const TOTAL_TIME_MS = 20 * 60 * 1000; // 20 minutes fixed

    const [elapsedTime, setElapsedTime] = useState(0); // in ms
    const [inputText, setInputText] = useState('');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    // Difficulty Levels configuration (ms thresholds)
    const LEVEL_THRESHOLDS = {
        BEGINNER: 5 * 60 * 1000,      // 0-5 mins
        INTERMEDIATE: 12 * 60 * 1000, // 5-12 mins
        ADVANCED: 20 * 60 * 1000      // 12-20 mins
    };

    // Determine current text based on time
    const getCurrentText = () => {
        if (elapsedTime < LEVEL_THRESHOLDS.BEGINNER) return content.beginner.join(' '); // Simple words
        if (elapsedTime < LEVEL_THRESHOLDS.INTERMEDIATE) return content.intermediate.join(' '); // Sentences
        return content.advanced.join(' '); // Complex paragraphs
    };

    const targetText = getCurrentText();
    const startTimeRef = useRef(Date.now());

    // Timer & WPM Logic
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const sessionDuration = now - startTimeRef.current;
            setElapsedTime(sessionDuration);

            if (sessionDuration >= TOTAL_TIME_MS) {
                clearInterval(timer);
                handleSubmit();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Real-time WPM Calculation
    useEffect(() => {
        if (elapsedTime > 0) {
            const words = inputText.trim().split(/\s+/).length;
            const minutes = elapsedTime / 60000;
            const currentWpm = Math.round(words / minutes) || 0;
            setWpm(currentWpm);
        }
    }, [inputText, elapsedTime]);

    // Accuracy Calculation
    const handleInput = (e) => {
        const val = e.target.value;
        setInputText(val);

        // Simple char-by-char accuracy
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === targetText[i]) correctChars++;
        }
        const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
        setAccuracy(acc);
    };

    const handleSubmit = () => {
        onComplete({ wpm, accuracy });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 h-screen flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100 shrink-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Keyboard className="w-6 h-6 text-purple-600" /> Typing Section
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        (Level: {elapsedTime < LEVEL_THRESHOLDS.BEGINNER ? 'Beginner' : elapsedTime < LEVEL_THRESHOLDS.INTERMEDIATE ? 'Intermediate' : 'Advanced'})
                    </span>
                </h2>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Activity className="w-5 h-5 text-green-500" />
                        <span className="font-mono font-bold text-xl">{wpm} WPM</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">{accuracy}% Acc</span>
                    </div>
                    <div className="flex items-center gap-2 text-xl font-mono font-bold text-purple-600">
                        <Clock className="w-6 h-6" />
                        {Math.floor((TOTAL_TIME_MS - elapsedTime) / 60000)}:
                        {Math.floor(((TOTAL_TIME_MS - elapsedTime) % 60000) / 1000).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>

            {/* Content Area - Split View */}
            <div className="flex-1 grid grid-cols-1 gap-6 min-h-0">

                {/* Source Text - Non-selectable */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 overflow-y-auto select-none font-mono text-lg leading-relaxed text-gray-600 shadow-inner">
                    {targetText.split('').map((char, idx) => {
                        let colorClass = 'text-gray-600';
                        if (idx < inputText.length) {
                            colorClass = char === inputText[idx] ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50';
                        }
                        // Highlight current cursor position
                        const isCurrent = idx === inputText.length;

                        return (
                            <span key={idx} className={`${colorClass} ${isCurrent ? 'border-l-2 border-purple-500 animate-pulse' : ''}`}>
                                {char}
                            </span>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="relative">
                    <textarea
                        value={inputText}
                        onChange={handleInput}
                        placeholder="Start typing here..."
                        className="w-full h-full p-6 text-lg font-mono rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none resize-none shadow-sm transition-all"
                        spellCheck="false"
                        autoFocus
                    />

                    <button
                        onClick={handleSubmit}
                        className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all"
                    >
                        Submit & Finish
                    </button>
                </div>

            </div>

        </div>
    );
};

export default TypingSection;
