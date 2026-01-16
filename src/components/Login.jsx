import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, LogIn } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Fetch students from Google Sheets
            const students = await api.getStudents();

            const student = students.find(s =>
                s.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
                s.phone === formData.phone.trim()
            );

            if (student) {
                // Save session (basic for now)
                sessionStorage.setItem('skillcheck_student', JSON.stringify(student));
                navigate('/select-test');
                // alert("Login Successful! (Next step: Test Selection)");
            } else {
                setError('Access Denied: Student not found or credentials mismatch.');
            }
        } catch (err) {
            console.error(err);
            setError('System Error: Could not connect to the database. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">SkillCheck</h1>
                    <p className="text-blue-100 mt-2 font-medium">Student Examination Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {error && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your registered name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-transform transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <LogIn className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Verifying...' : 'Login to Exam'}
                    </button>
                </form>

                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Protected by FullScreenGuard™ Security
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
