import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ExcelMind ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[350px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center items-center text-center space-y-4 my-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {this.props.fallbackTitle || 'ExcelMind AI Tutor Notice'}
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-md mx-auto">
              {this.props.fallbackMessage || 'ExcelMind encountered a temporary error. Please refresh or try again.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your login session, notes, and academic data are safely preserved.
            </p>
          </div>

          {this.state.error?.message && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 font-mono max-w-md w-full overflow-x-auto text-left">
              <span>Notice: </span>
              <span className="text-slate-800 dark:text-slate-200">{this.state.error.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={this.handleRefresh}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold border border-slate-300 dark:border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
