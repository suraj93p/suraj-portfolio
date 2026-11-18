import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import { getPortfolio } from './models/portfolio.repository';
import './styles/globals.scss';

const root = document.getElementById('root');
if (!root) throw new Error('Portfolio mount element is missing');
createRoot(root).render(<StrictMode><AppErrorBoundary config={getPortfolio()}><App /></AppErrorBoundary></StrictMode>);
