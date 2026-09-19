'use client';

import React, { useState } from 'react';
import { Card, Button } from './ui';
import { api } from '../lib/api';

export function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      await api.submitFeedback({
        message: feedback,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(true)} variant="primary" className="shadow-xl">
          💬 Give Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-2xl border border-amber-500/20 bg-slate-900/95 backdrop-blur-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-amber-400">Feedback</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-emerald-400 text-center py-4 font-medium">
            Thank you for your feedback! 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How can we improve this Preprod MVP?"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 resize-none h-24"
              required
            />
            <Button 
              disabled={loading || !feedback.trim()} 
              variant="primary" 
              className="w-full py-2 text-sm"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
