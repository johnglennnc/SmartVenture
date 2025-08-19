import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Opportunities from "./Opportunities";

import Portfolio from "./Portfolio";

import Settings from "./Settings";

import Funding from "./Funding";

import SalesSyncAI from "./SalesSyncAI";

import AccuSyncAI from "./AccuSyncAI";

import RegSyncAI from "./RegSyncAI";

import OpsSyncAI from "./OpsSyncAI";

import TechSyncAI from "./TechSyncAI";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Opportunities: Opportunities,
    
    Portfolio: Portfolio,
    
    Settings: Settings,
    
    Funding: Funding,
    
    SalesSyncAI: SalesSyncAI,
    
    AccuSyncAI: AccuSyncAI,
    
    RegSyncAI: RegSyncAI,
    
    OpsSyncAI: OpsSyncAI,
    
    TechSyncAI: TechSyncAI,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Opportunities" element={<Opportunities />} />
                
                <Route path="/Portfolio" element={<Portfolio />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Funding" element={<Funding />} />
                
                <Route path="/SalesSyncAI" element={<SalesSyncAI />} />
                
                <Route path="/AccuSyncAI" element={<AccuSyncAI />} />
                
                <Route path="/RegSyncAI" element={<RegSyncAI />} />
                
                <Route path="/OpsSyncAI" element={<OpsSyncAI />} />
                
                <Route path="/TechSyncAI" element={<TechSyncAI />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}