// layouts/ProfileLayout.jsx
import React from 'react';
import Navbar from '../navbar/Navbar'; // Adjust path if needed
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default ProfileLayout;
