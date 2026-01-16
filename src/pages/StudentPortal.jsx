import React from 'react';
import { Outlet } from 'react-router-dom';

const StudentPortal = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Shared Layout Checkpoints can go here (e.g. Logo, Footer) */}
            <Outlet />
        </div>
    );
};

export default StudentPortal;
