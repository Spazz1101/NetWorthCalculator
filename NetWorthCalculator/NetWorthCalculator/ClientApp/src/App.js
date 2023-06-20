import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/NetWorthCalculator';
import './custom.css';

export default function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}
