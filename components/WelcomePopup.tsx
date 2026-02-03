'use client';

import { useEffect, useState } from 'react';
import { X, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('tsh-welcome-popup-seen');
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds of user activity on page
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark popup as seen for this session
    sessionStorage.setItem('tsh-welcome-popup-seen', 'true');
  };

  const handleFAQClick = () => {
    // Close popup and mark as seen before navigating
    setIsVisible(false);
    sessionStorage.setItem('tsh-welcome-popup-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 rounded-t-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to TechSmartHire!</h2>
            </div>
            <p className="text-blue-100 text-sm">
              New to our platform? Let us help you get started.
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 mb-4 leading-relaxed">
              As this product is new, you may have many questions about how it works.
            </p>
            
            <p className="text-slate-700 mb-4 leading-relaxed">
              Before you explore further, take a moment to visit our FAQs and understand:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span>How skill assessments help you land your dream job</span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span>How recruiters discover truly skilled candidates without relying on resumes</span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span>How your score can open doors to freelancing and side-income opportunities</span>
              </li>
            </ul>

            <p className="text-slate-700 mb-6 font-semibold">
              Everything is explained clearly, step by step.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/faqs"
                onClick={handleFAQClick}
                className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold hover:shadow-lg transition-all hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Visit FAQ Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
