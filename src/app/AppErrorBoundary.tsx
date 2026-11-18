import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { PortfolioConfig } from '../models/portfolio.types';
import { Button } from '../views/components/Button';

type Props = { children: ReactNode; config: PortfolioConfig };
export class AppErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Portfolio render error', error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    const { ui, profile } = this.props.config;
    return <main className="errorFallback"><h1>{ui.appErrorHeading}</h1><p>{ui.appErrorBody}</p><p><a href={`mailto:${profile.email}`}>{profile.email}</a></p><Button onClick={() => window.location.reload()}>{ui.reload}</Button></main>;
  }
}
