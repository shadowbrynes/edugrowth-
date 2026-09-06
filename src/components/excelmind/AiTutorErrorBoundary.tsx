import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Isolated AI Tutor Error Boundary
 * Prevents any runtime error inside the AI Tutor from affecting:
 * - Authentication & user session
 * - Sidebar navigation
 * - Main application header & dashboard
 * - Other ExcelMind modules
 */
export class AiTutorErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unknown error in AI Tutor component'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ExcelMind AI Tutor Isolated Error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[420px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-lg flex flex-col justify-center items-center text-center space-y-4 my-4 max-w-2xl mx-auto animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-4xl">smart_toy</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              AI Tutor is temporarily unavailable
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              AI Tutor is temporarily unavailable. Please try again.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your login session, notes, and academic dashboard are completely safe.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AiTutorErrorBoundary;
