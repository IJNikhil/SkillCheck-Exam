import React, { useEffect, useState } from 'react';
import screenfull from 'screenfull';
import { AlertOctagon, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * FullScreenGuard
 * Enforces full-screen mode and tab focus.
 * Wraps the exam content.
 */
const FullScreenGuard = ({ children, onViolation }) => {
    const navigate = useNavigate();
    const [isFullScreen, setIsFullScreen] = useState(true); // Optimistic initial state
    const [violationCount, setViolationCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    // Helper to trigger full screen (must be called from user interaction usually, 
    // but we try on mount if possible, or show a button if it fails)
    const requestFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request().catch(err => {
                console.warn("Could not enter full screen automatically", err);
                setIsFullScreen(false);
            });
        }
    };

    useEffect(() => {
        // 1. Enter Full Screen on Mount
        requestFullScreen();

        // 2. Listen for Full Screen Changes
        const handleScreenChange = () => {
            if (screenfull.isEnabled) {
                const isFull = screenfull.isFullscreen;
                setIsFullScreen(isFull);
                if (!isFull) {
                    handleViolation("Exited Full Screen");
                }
            }
        };

        // 3. Listen for Visibility Changes (Tab Switching)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab Switched / App Hidden");
            }
        };

        if (screenfull.isEnabled) {
            screenfull.on('change', handleScreenChange);
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Block Context Menu
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change', handleScreenChange);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [violationCount]);

    const handleViolation = (reason) => {
        const newCount = violationCount + 1;
        setViolationCount(newCount);

        console.warn(`Security Violation #${newCount}: ${reason}`);

        if (newCount >= 2) {
            // Auto Submit Logic
            if (onViolation) {
                onViolation(); // Parent handles submission
            } else {
                alert("Maximum violations reached. Auto-submitting test.");
                navigate('/'); // Fallback if no handler
            }
        } else {
            // Show Warning
            setShowWarning(true);
        }
    };

    const resumeTest = () => {
        setShowWarning(false);
        requestFullScreen();
    };

    // If Fullscreen failed initially or was exited, block the view until resumed
    if (!isFullScreen && !showWarning) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center text-white text-center p-8">
                <div className="max-w-md">
                    <Maximize className="w-16 h-16 mx-auto mb-6 text-blue-400" />
                    <h2 className="text-2xl font-bold mb-4">Full Screen Required</h2>
                    <p className="mb-8 text-gray-300">
                        This exam requires full-screen mode. Please click below to enter full screen and continue.
                    </p>
                    <button
                        onClick={resumeTest}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-all"
                    >
                        Enter Full Screen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Violation Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[60] bg-red-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-red-500">
                        <AlertOctagon className="w-20 h-20 text-red-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-extrabold text-red-600 mb-2">SECURITY ALERT</h2>
                        <p className="text-gray-900 font-bold text-xl mb-4">
                            Violation 1 of 2
                        </p>
                        <p className="text-gray-600 mb-8">
                            We detected that you attempted to leave the exam environment.
                            <br /><br />
                            <span className="font-bold">One more violation will result in immediate termination of your exam.</span>
                        </p>
                        <button
                            onClick={resumeTest}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                        >
                            I Understand, Resume Exam
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={showWarning ? 'blur-sm pointer-events-none select-none' : ''}>
                {children}
            </div>
        </>
    );
};

export default FullScreenGuard;
