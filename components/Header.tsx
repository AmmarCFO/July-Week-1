
import React from 'react';
import { motion } from 'framer-motion';
import { CalculatorIcon } from './Icons';

const Header: React.FC<{ onToggleLanguage: () => void; onShowFormulas?: () => void }> = ({ onToggleLanguage, onShowFormulas }) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-6 z-50 px-6 mb-8"
    >
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#1D1D1F] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
             <div>
                <span className="block text-lg font-bold text-[#1D1D1F] tracking-tight leading-none">Mathwaa</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Growth Report</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
              {onShowFormulas && (
                <button 
                  onClick={onShowFormulas}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#4A2C5A] bg-[#4A2C5A]/5 hover:bg-[#4A2C5A]/10 rounded-full transition-all active:scale-95 border border-[#4A2C5A]/10 hover:border-[#4A2C5A]/20 flex items-center gap-1.5"
                >
                  <CalculatorIcon className="w-4 h-4 shrink-0 text-[#4A2C5A]" />
                  <span className="hidden sm:inline">Calculations & Formulas</span>
                  <span className="sm:hidden">Formulas</span>
                </button>
              )}
              <button 
                onClick={onToggleLanguage}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#1D1D1F] bg-gray-100/50 hover:bg-gray-100 rounded-full transition-all active:scale-95 border border-transparent hover:border-gray-200"
              >
                العربية
              </button>
          </div>
      </div>
    </motion.header>
  );
};

export default Header;
