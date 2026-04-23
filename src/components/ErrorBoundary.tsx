import React, { Component, type ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[100dvh] bg-black flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-heading">
              Something Went Wrong
            </h1>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              The sacred realm encountered a disturbance. Do not worry — your wisdom journey continues.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-left">
                <p className="text-[11px] text-red-400/80 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-black text-sm font-medium hover:bg-gold-light hover:scale-[1.03] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Return to the Path
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
