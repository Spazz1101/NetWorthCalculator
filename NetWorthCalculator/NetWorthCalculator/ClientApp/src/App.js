import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NetWorthCalculator from './components/NetWorthCalculator';
import './custom.css';

export default function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<NetWorthCalculator />} />
                <Route path="*" element={<NetWorthCalculator />} />
            </Routes>
        </BrowserRouter>
    );
}
