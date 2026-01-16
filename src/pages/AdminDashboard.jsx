import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SkillCheck <span className="text-blue-600">Admin</span></h1>
                        <p className="text-gray-500 mt-1">Examination Management Console</p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        Log Out
                    </button>
                </header>

                <AdminPanel />

            </div>
        </div>
    );
};

export default AdminDashboard;
