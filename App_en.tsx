import React, { useState, useMemo } from 'react';
import { BOOKINGS, OCCUPANCY_DATA, METRICS, ROI_DATA, Booking } from './constants';
import Header from './components/Header';
import FormulaModal from './components/FormulaModal';
import { motion, AnimatePresence } from 'framer-motion';

// Custom formatters
const formatSAR = (value: number) => {
  return `SAR ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: value % 1 === 0 ? 0 : 2 })}`;
};

const ProgressRing: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trailColorClass?: string;
  label?: string;
  sublabel?: string;
  textColorClass?: string;
  sublabelColorClass?: string;
  labelColorClass?: string;
  bgClass?: string;
}> = ({
  percentage,
  size = 140,
  strokeWidth = 12,
  colorClass = "stroke-[#4A2C5A]",
  trailColorClass = "stroke-gray-200",
  label,
  sublabel,
  textColorClass = "text-gray-950",
  sublabelColorClass = "text-gray-600",
  labelColorClass = "text-gray-900",
  bgClass = "bg-white border border-gray-300 shadow-md hover:shadow-lg hover:border-gray-400"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  return (
    <div className={`flex flex-col items-center justify-center p-5 rounded-[2rem] transition-all duration-200 ${bgClass}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            className={`fill-none ${trailColorClass}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Animated foreground circle */}
          <motion.circle
            className={`fill-none ${colorClass}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${textColorClass}`}>
            {percentage}%
          </span>
          {sublabel && (
            <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${sublabelColorClass}`}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className={`text-xs font-extrabold uppercase tracking-wider mt-3 block text-center font-sans ${labelColorClass}`}>
          {label}
        </span>
      )}
    </div>
  );
};

const ROIGauge: React.FC<{
  value: number;
  max: number;
  label: string;
  colorClass?: string;
  trailColorClass?: string;
  glowColorClass?: string;
}> = ({
  value,
  max,
  label,
  colorClass = "stroke-purple-500",
  trailColorClass = "stroke-gray-800",
  glowColorClass = "#A855F7"
}) => {
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Map value to percentage of max
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="relative flex flex-col items-center justify-center shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            className={`fill-none ${trailColorClass}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Filling circle with animation */}
          <motion.circle
            className={`fill-none ${colorClass}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${glowColorClass})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
            {value.toFixed(2)}x
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

const App_en: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  // Filters & State for Bookings Table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [attributionFilter, setAttributionFilter] = useState<string>('all');
  const [windowFilter, setWindowFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Booking>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Custom states for formula modal and ROI lifecycle tab
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [roiWindow, setRoiWindow] = useState<'30d' | '7d'>('7d');

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...BOOKINGS];

    // Search filter
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.branch.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Attribution filter
    if (attributionFilter !== 'all') {
      result = result.filter(b => b.attribution === attributionFilter);
    }

    // Window filter
    if (windowFilter !== 'all') {
      if (windowFilter === '7d') {
        result = result.filter(b => b.window === '30d+7d');
      } else if (windowFilter === '30d') {
        result = result.filter(b => b.window === '30d' || b.window === '30d+7d');
      } else if (windowFilter === 'upcoming') {
        result = result.filter(b => b.window === 'upcoming');
      }
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, statusFilter, attributionFilter, windowFilter, sortField, sortDirection]);

  const toggleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#4A2C5A] selection:text-white bg-white font-sans antialiased text-gray-900">
      <Header onToggleLanguage={onToggleLanguage} onShowFormulas={() => setIsFormulaOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title / Badges block */}
        <div className="mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#4A2C5A] uppercase bg-[#4A2C5A]/10 px-3.5 py-1 rounded-full">
                Marketing Analytics & Growth Dashboard
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight mt-3 font-serif">
                Mathwaa Executive <span className="text-[#4A2C5A]">Marketing Report</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium mt-2">
                Report Date: <strong className="text-gray-900">5 July 2026</strong> · Revenue is on a cash-collected basis (one month of Mathwaa's fee share); future contracted value shown separately as LTV.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-700 font-mono uppercase tracking-wider">
                Audited & Approved
              </span>
            </div>
          </motion.div>
        </div>

        {/* SECTION 1: HERO (dual-window KPI cards, two columns: 30-day | 7-day) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 sm:mb-12">
          
          {/* Last 30 Days (5 Jun–5 Jul) Column */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#0F0716] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-6 border-b border-[#4A2C5A]/25 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
                Last 30 Days Window
              </h3>
              <span className="text-xs font-bold text-purple-200 bg-[#4A2C5A]/40 px-2.5 py-0.5 rounded-md font-mono border border-[#4A2C5A]/30">5 Jun – 5 Jul</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">Total Cash Collected</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">
                  {formatSAR(METRICS.last30d.totalCash)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">Cash received from active leases</span>
              </div>

              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">Performance Cash</span>
                <span className="text-2xl sm:text-3xl font-black text-[#D8B4FE] font-mono mt-1 block">
                  {formatSAR(METRICS.last30d.perfCash)}
                </span>
                <span className="text-[10px] text-purple-200 font-bold block mt-1">
                  Share: {METRICS.last30d.perfCashPct}% of total
                </span>
              </div>

              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">Performance LTV</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">
                  {formatSAR(METRICS.last30d.perfLtv)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">Committed future value (paid social)</span>
              </div>

              <div 
                onClick={() => setIsFormulaOpen(true)}
                className="p-4 bg-[#4A2C5A]/20 rounded-2xl border border-[#4A2C5A]/40 hover:bg-[#4A2C5A]/30 transition-all duration-255 cursor-pointer relative group/roi"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-[#E9D5FF] font-extrabold uppercase tracking-wider block">Cash ROI (Ads Only)</span>
                  <span className="text-[9px] text-[#A855F7] bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold group-hover/roi:bg-[#A855F7]/30 transition-colors">Formula</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1 block">
                  {ROI_DATA.last30d.roiCashAdsOnly}×
                </span>
                <span className="text-[10px] text-purple-200 font-semibold block mt-1 leading-normal">
                  For every <strong className="text-white">1 SAR spent</strong> on digital ads, <strong className="text-emerald-300">{ROI_DATA.last30d.roiCashAdsOnly} SAR</strong> in cash was collected.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Last 7 Days (28 Jun–5 Jul) Column */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-[#0E0B16] border border-amber-500/40 shadow-2xl rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-6 border-b border-amber-500/20 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Last 7 Days Window
              </h3>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-md font-mono border border-amber-500/30">28 Jun – 5 Jul</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-200 font-extrabold uppercase tracking-wider block">Total Cash Collected</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">
                  {formatSAR(METRICS.last7d.totalCash)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">Rapid check-in cash collection</span>
              </div>

              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Performance Cash</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1 block">
                  {formatSAR(METRICS.last7d.perfCash)}
                </span>
                <span className="text-[10px] text-amber-200 font-bold block mt-1">
                  Share: {METRICS.last7d.perfCashPct}% of total
                </span>
              </div>

              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-200 font-extrabold uppercase tracking-wider block">Performance LTV</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">
                  {formatSAR(METRICS.last7d.perfLtv)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">Future contracted value generated</span>
              </div>

              <div 
                onClick={() => setIsFormulaOpen(true)}
                className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 hover:bg-amber-950/60 transition-all duration-255 cursor-pointer relative group/roi"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">Cash ROI (Ads Only)</span>
                  <span className="text-[9px] text-amber-400 bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold group-hover/roi:bg-amber-500/30 transition-colors">Formula</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1 block">
                  {ROI_DATA.last7d.roiCashAdsOnly}×
                </span>
                <span className="text-[10px] text-amber-200 font-semibold block mt-1 leading-normal">
                  For every <strong className="text-white">1 SAR spent</strong> on digital ads, <strong className="text-amber-300">{ROI_DATA.last7d.roiCashAdsOnly} SAR</strong> in cash was collected.
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 4B — LIFECYCLE ROI */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0E0B16] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white font-serif">Lifecycle ROI Analysis</h2>
              <p className="text-xs sm:text-sm text-purple-200 font-medium mt-1">Comparing cash collected vs total contracted lifecycle value relative to marketing investments</p>
            </div>
            {/* Window toggle */}
            <div className="flex bg-[#190C24] p-1 rounded-full border border-purple-500/20 self-start shrink-0 font-sans">
              <button 
                onClick={() => setRoiWindow('30d')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${roiWindow === '30d' ? 'bg-[#4A2C5A] text-white shadow-md' : 'text-purple-300 hover:text-white'}`}
              >
                30 Days
              </button>
              <button 
                onClick={() => setRoiWindow('7d')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${roiWindow === '7d' ? 'bg-[#4A2C5A] text-white shadow-md' : 'text-purple-300 hover:text-white'}`}
              >
                7 Days
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Card 1: Cash Collected ROI */}
            <div className="bg-[#190C24] border border-[#4A2C5A]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between hover:border-[#4A2C5A]/60 transition-colors">
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/30 text-[#D8B4FE] px-2 py-0.5 rounded-full">
                    CASH RETURN
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">
                    Spend Base: {roiWindow === '30d' ? formatSAR(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation) : formatSAR(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {roiWindow === '30d' ? 'June Cash Collected ROI' : '7-Day Cash Collected ROI'}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
                  For every <strong className="text-white">1 SAR</strong> spent on total marketing (media + content overhead), <strong className="text-emerald-400 font-mono font-bold">{roiWindow === '30d' ? `${ROI_DATA.last30d.roiCashAdsAndContent.toFixed(2)} SAR` : `${ROI_DATA.last7d.roiCashAdsAndContent.toFixed(2)} SAR`}</strong> in cash was collected (management fee share).
                </p>
                <div className="bg-[#0F0716] rounded-xl px-3.5 py-1.5 border border-purple-950 text-[11px] font-mono text-[#D8B4FE] inline-block">
                  {roiWindow === '30d' 
                    ? `Calculation: SAR ${METRICS.last30d.perfCash.toLocaleString()} Cash ÷ SAR ${(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation).toLocaleString()} Spend` 
                    : `Calculation: SAR ${METRICS.last7d.perfCash.toLocaleString()} Cash ÷ SAR ${(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation).toLocaleString()} Spend`}
                </div>
              </div>
              <ROIGauge 
                value={roiWindow === '30d' ? ROI_DATA.last30d.roiCashAdsAndContent : ROI_DATA.last7d.roiCashAdsAndContent} 
                max={3} 
                label="CASH ROI" 
                colorClass="stroke-purple-500" 
                glowColorClass="#A855F7" 
              />
            </div>

            {/* Card 2: Contract LTV ROI */}
            <div className="bg-[#190C24] border border-[#4A2C5A]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between hover:border-[#4A2C5A]/60 transition-colors">
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                    LIFECYCLE LTV
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">
                    Spend Base: {roiWindow === '30d' ? formatSAR(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation) : formatSAR(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {roiWindow === '30d' ? 'Contract LTV ROI' : '7-Day Contract LTV ROI'}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
                  For every <strong className="text-white">1 SAR</strong> spent on total marketing, <strong className="text-emerald-400 font-mono font-bold">{roiWindow === '30d' ? `${ROI_DATA.last30d.roiLtvAdsAndContent.toFixed(2)} SAR` : `${ROI_DATA.last7d.roiLtvAdsAndContent.toFixed(2)} SAR`}</strong> in future contracted Lifetime Value (LTV) was secured.
                </p>
                <div className="bg-[#0F0716] rounded-xl px-3.5 py-1.5 border border-purple-950 text-[11px] font-mono text-emerald-400 inline-block">
                  {roiWindow === '30d' 
                    ? `Calculation: SAR ${METRICS.last30d.perfLtv.toLocaleString()} LTV ÷ SAR ${(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation).toLocaleString()} Spend` 
                    : `Calculation: SAR ${METRICS.last7d.perfLtv.toLocaleString()} LTV ÷ SAR ${(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation).toLocaleString()} Spend`}
                </div>
              </div>
              <ROIGauge 
                value={roiWindow === '30d' ? ROI_DATA.last30d.roiLtvAdsAndContent : ROI_DATA.last7d.roiLtvAdsAndContent} 
                max={10} 
                label="LTV ROI" 
                colorClass="stroke-emerald-400" 
                glowColorClass="#34D399" 
              />
            </div>
          </div>
        </motion.div>

        {/* HERO CAPTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 sm:mb-12 bg-amber-50 border border-amber-400 rounded-2xl p-4 flex items-start gap-3 shadow-md"
        >
          <span className="text-xs font-bold text-amber-700 bg-amber-150 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5 font-mono">Insight</span>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-semibold">
            <strong>Executive Insight:</strong> &ldquo;The last 7 days converted spend far more efficiently (<strong>{ROI_DATA.last7d.roiCashAdsOnly}×</strong> vs <strong>{ROI_DATA.last30d.roiCashAdsOnly}×</strong> on cash); recent targeting and technical optimizations are performing better.&rdquo;
          </p>
        </motion.div>

        {/* SECTION 2 — REVENUE: PERFORMANCE vs OTHER */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-gray-300 shadow-xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-950 font-serif">Acquisition Breakdown: Performance Marketing vs Other</h2>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">Comparison of paid social attribution and other channels across both windows</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* High-contrast Ring Circles breakdown */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <ProgressRing 
                percentage={57} 
                label="30-Day Performance Marketing" 
                sublabel="Of Total Cash" 
                colorClass="stroke-[#4A2C5A]"
                trailColorClass="stroke-gray-150"
              />
              <ProgressRing 
                percentage={51} 
                label="7-Day Performance Marketing" 
                sublabel="Of Total Cash" 
                colorClass="stroke-amber-600"
                trailColorClass="stroke-gray-150"
              />
            </div>

            {/* Structured Table */}
            <div className="lg:col-span-7 overflow-x-auto rounded-2xl border border-gray-300 shadow-sm">
              <table className="min-w-full divide-y divide-gray-300 text-left text-xs sm:text-sm">
                <thead className="bg-[#4A2C5A]/5 text-gray-900">
                  <tr>
                    <th className="py-3.5 px-4 font-extrabold text-gray-950">Metric</th>
                    <th className="py-3.5 px-4 text-right font-extrabold text-[#4A2C5A]">Last 30 days</th>
                    <th className="py-3.5 px-4 text-right font-extrabold text-amber-800">Last 7 days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-semibold text-gray-900">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-gray-800">Performance Marketing Cash</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last30d.perfCash)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last7d.perfCash)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-gray-800">Other-source Cash</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last30d.otherCash)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last7d.otherCash)}</td>
                  </tr>
                  <tr className="bg-[#4A2C5A]/5 font-bold text-gray-950">
                    <td className="py-3.5 px-4 font-extrabold">Total Cash</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#4A2C5A] font-black">{formatSAR(METRICS.last30d.totalCash)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-800 font-black">{formatSAR(METRICS.last7d.totalCash)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-gray-800">Performance Marketing % of cash</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{METRICS.last30d.perfCashPct}%</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{METRICS.last7d.perfCashPct}%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-gray-800">Performance Marketing LTV</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last30d.perfLtv)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last7d.perfLtv)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-gray-800">Other-source LTV</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last30d.otherLtv)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(METRICS.last7d.otherLtv)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DEFINITIONS NOTE */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-300 text-[11px] sm:text-xs text-gray-700 leading-relaxed">
            <strong className="text-gray-900 uppercase tracking-wider block mb-1">Channel Definitions Note:</strong>
            <p>
              <strong>Other Channels:</strong> All organic channels, including word-of-mouth from friends without social platforms, existing or former tenants, direct referrals, property portals (Bayut or Aqar), and organic search engines (Google, general internet search).
            </p>
          </div>
        </motion.div>

        {/* SECTION 4 — MARKETING ROI */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0F0716] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="mb-6 relative z-10">
            <h2 className="text-2xl font-bold text-white font-serif">Marketing Campaign Spend & ROI</h2>
            <p className="text-xs sm:text-sm text-purple-300 font-medium mt-1">Audited campaign media costs mapped to collected cash and contract values</p>
          </div>

          {/* Spend detail boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">30-day Media Spend</span>
              <span className="text-xl font-bold text-white block font-mono mt-1">
                {formatSAR(ROI_DATA.last30d.adSpend)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1 font-mono">
                TikTok: {formatSAR(ROI_DATA.last30d.tiktokSpend)} | Meta: {formatSAR(ROI_DATA.last30d.metaSpend)}
              </span>
            </div>

            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">30-day Content Creation</span>
              <span className="text-xl font-bold text-white block font-mono mt-1">
                {formatSAR(ROI_DATA.last30d.contentCreation)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1 font-sans">Creative production overhead (16 Jun)</span>
            </div>

            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">7-day Media Spend</span>
              <span className="text-xl font-bold text-white block font-mono mt-1">
                {formatSAR(ROI_DATA.last7d.adSpend)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1 font-mono">
                TikTok: {formatSAR(ROI_DATA.last7d.tiktokSpend)} | Meta: {formatSAR(ROI_DATA.last7d.metaSpend)}
              </span>
            </div>

            <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-200">
              <span className="text-[10px] text-amber-300 font-extrabold uppercase block">7-day Content Creation</span>
              <span className="text-xl font-bold text-amber-400 block mt-1 font-mono">
                SAR 0
              </span>
              <span className="text-[9px] text-amber-500 block mt-1 font-sans">No content creation costs this week</span>
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-2xl border border-[#4A2C5A]/30 relative z-10 bg-[#0F0716]">
            <table className="min-w-full divide-y divide-[#4A2C5A]/30 text-left text-xs sm:text-sm">
              <thead className="bg-[#190C24] text-purple-300">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-purple-200">Financial Ratio Model</th>
                  <th className="py-3.5 px-4 text-right font-bold text-[#D8B4FE]">Last 30 days</th>
                  <th className="py-3.5 px-4 text-right font-bold text-amber-400">Last 7 days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A2C5A]/20 font-semibold text-purple-100">
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4">Ad Spend (TikTok + Meta)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{formatSAR(ROI_DATA.last30d.adSpend)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{formatSAR(ROI_DATA.last7d.adSpend)}</td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4">Content Creation</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{formatSAR(ROI_DATA.last30d.contentCreation)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-gray-400">{formatSAR(ROI_DATA.last7d.contentCreation)}</td>
                </tr>
                <tr className="hover:bg-[#4A2C5A]/30 bg-[#4A2C5A]/10">
                  <td className="py-3.5 px-4 font-bold text-[#E9D5FF]">ROI on cash (ads only)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-extrabold">{ROI_DATA.last30d.roiCashAdsOnly}× <span className="text-xs font-normal text-purple-300">(+41%)</span></td>
                  <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-extrabold">{ROI_DATA.last7d.roiCashAdsOnly}× <span className="text-xs font-normal text-amber-300">(+155%)</span></td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4">ROI on cash (ads + content)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{ROI_DATA.last30d.roiCashAdsAndContent}× <span className="text-xs font-normal text-purple-300">(+37%)</span></td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{ROI_DATA.last7d.roiCashAdsAndContent}× <span className="text-xs font-normal text-amber-300">(+155%)</span></td>
                </tr>
                <tr className="hover:bg-[#10B981]/20 bg-[#10B981]/5">
                  <td className="py-3.5 px-4 font-bold text-emerald-300">ROI on LTV (ads only)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-extrabold">{ROI_DATA.last30d.roiLtvAdsOnly}×</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-extrabold">{ROI_DATA.last7d.roiLtvAdsOnly}×</td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4">ROI on LTV (ads + content)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{ROI_DATA.last30d.roiLtvAdsAndContent}×</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">{ROI_DATA.last7d.roiLtvAdsAndContent}×</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-[#190C24]/60 rounded-xl border border-[#4A2C5A]/20 text-xs text-purple-300 leading-relaxed italic relative z-10">
            &ldquo;<strong>ROI methodology constraint:</strong> ROI calculations are strictly formulated against <strong>Mathwaa's net management fee share</strong>, not the gross building rent. Cash ROI evaluates collected liquid capital, whereas LTV ROI factors future verified contractual obligations across the full duration of leases.&rdquo;
          </div>
        </motion.div>

        {/* SECTION 3 — OCCUPANCY CONTRIBUTION FROM PERFORMANCE MARKETING */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0F0716] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden group text-left"
          id="occupancy-contribution"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="mb-6 relative z-10">
            <h2 className="text-2xl font-bold text-white font-serif">Occupancy Capacity Contribution</h2>
            <p className="text-xs sm:text-sm text-purple-300 font-medium mt-1">Performance-marketing bookings as a share of total building units (Last 30 Days)</p>
          </div>

          {/* Ring Graph Grid representation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
            {OCCUPANCY_DATA.map((item, index) => {
              const size = 84;
              const strokeWidth = 7;
              const radius = (size - strokeWidth) / 2;
              const circumference = radius * 2 * Math.PI;
              const percentage = Math.min(item.pct, 100);

              return (
                <div key={index} className="bg-[#190C24] border border-[#4A2C5A]/30 rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300 shadow-md group/ring h-full">
                  <div className="mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#4A2C5A]/30 text-purple-200 border border-purple-500/20 rounded-md inline-block">
                      {item.branch}
                    </span>
                    <span className="text-xs font-bold text-white block mt-1 truncate max-w-[110px]">{item.location}</span>
                  </div>
                  
                  {/* Ring SVG */}
                  <div className="relative my-2 shrink-0" style={{ width: size, height: size }}>
                    <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                      <circle
                        className="fill-none stroke-purple-950/80"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                      />
                      <motion.circle
                        className="fill-none stroke-purple-400"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.9))" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                      <span className="text-xs font-black text-white font-mono style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))' }}">
                        {item.pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[9px] text-purple-300 font-bold mt-2">
                    {item.perfBookings} / {item.units} Units
                  </div>
                </div>
              );
            })}
          </div>

          {/* Occupancy Bullet Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#4A2C5A]/20 relative z-10">
            <div className="p-4 bg-[#190C24] rounded-xl border border-[#4A2C5A]/30 shadow-md">
              <span className="text-[11px] font-extrabold text-[#D8B4FE] block uppercase tracking-wider">Highest Contribution %</span>
              <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                <strong>M20 Al Zahraa:</strong> Performance marketing filled <strong>75.0%</strong> of its total capacity - the highest percentage contribution.
              </p>
            </div>
            <div className="p-4 bg-[#190C24] rounded-xl border border-[#4A2C5A]/30 shadow-md">
              <span className="text-[11px] font-extrabold text-[#D8B4FE] block uppercase tracking-wider">Largest Absolute Fill</span>
              <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                <strong>M38 Al Sulaimaniyah:</strong> <strong>9 units</strong> filled by paid social (24.3% of a 37-unit building) - the largest absolute contribution.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-purple-300 font-bold mt-4 text-center uppercase tracking-wider relative z-10">
            * Contribution = performance bookings as a share of building capacity (not a raw before/after occupancy delta).
          </p>
        </motion.div>

        {/* SECTION 5 — BOOKINGS TABLE */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-gray-200/80 shadow-md rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12"
          id="bookings-table-section"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-950 font-serif">Comprehensive Bookings Registry</h2>
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Sortable, filterable audit log of all bookings with acquisition channels & statuses</p>
            </div>
            
            {/* Table statistics badge */}
            <div className="bg-gray-100 text-gray-800 font-mono text-xs font-bold px-4 py-2 rounded-xl self-start xl:self-auto">
              Displaying {filteredAndSortedBookings.length} of {BOOKINGS.length} records
            </div>
          </div>

          {/* Filters controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-150">
            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Search bookings</label>
              <input 
                type="text" 
                placeholder="Search tenant, branch, location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Status Filter</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Renewal">Renewal</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Attribution Filter</label>
              <select 
                value={attributionFilter}
                onChange={(e) => setAttributionFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">All Attributions</option>
                <option value="Performance">Performance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">Time Window Filter</label>
              <select 
                value={windowFilter}
                onChange={(e) => setWindowFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">All Windows</option>
                <option value="30d">Last 30 Days (Cash)</option>
                <option value="7d">Last 7 Days (Cash)</option>
                <option value="upcoming">Upcoming (July Pipeline)</option>
              </select>
            </div>
          </div>

          {/* Sort instructions */}
          <div className="text-[10px] text-gray-400 font-semibold mb-2 flex items-center gap-1">
            <span>💡 Click columns headers to sort table records</span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-gray-150">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
              <thead className="bg-[#F8F6F9] text-gray-500 font-bold">
                <tr>
                  <th 
                    onClick={() => toggleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors shrink-0 font-bold text-gray-700"
                  >
                    Tenant Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('branch')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    Branch {sortField === 'branch' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('location')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    Location {sortField === 'location' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('monthlyRent')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors text-right font-bold text-gray-700"
                  >
                    Monthly SAR {sortField === 'monthlyRent' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('attribution')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    Attribution {sortField === 'attribution' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('status')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('paymentStatus')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    Payment {sortField === 'paymentStatus' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-4 font-bold text-gray-700">Check-In</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-right">Cash Share</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-right">Contract LTV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 font-semibold">
                {filteredAndSortedBookings.map((b) => {
                  // Custom row colors based on status
                  let rowBg = "hover:bg-gray-50/60";
                  let textClass = "text-gray-900";
                  
                  if (b.status === 'Cancelled') {
                    rowBg = "bg-red-50/50 hover:bg-red-50";
                    textClass = "text-red-700";
                  } else if (b.status === 'Renewal') {
                    rowBg = "bg-gray-100/50 hover:bg-gray-150";
                    textClass = "text-gray-500";
                  }

                  // Check if this row is a key loss highlighted by CEO
                  const isKeyLoss = b.status === 'Cancelled' && (
                    b.name === "Tahreem Atta" || b.name === "Hoor Alturki"
                  );

                  return (
                    <tr key={b.id} className={`${rowBg} ${textClass} transition-colors duration-150`}>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1.5">
                            {b.name}
                            {isKeyLoss && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded-full uppercase tracking-wider animate-pulse">
                                Key Loss
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal">{b.name_ar}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs">{b.branch}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-xs font-normal">
                          <span className="font-semibold text-gray-800">{b.location}</span>
                          <span className="text-gray-400">{b.location_ar}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatSAR(b.monthlyRent)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.attribution === 'Performance' 
                            ? 'bg-purple-100 text-[#4A2C5A]' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {b.attribution}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : b.status === 'Cancelled' 
                              ? 'bg-red-200 text-red-900 border border-red-300' 
                              : 'bg-gray-200 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                          b.paymentStatus === 'Paid' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                            : b.paymentStatus === 'Awaiting Payment' 
                              ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-normal">
                        {b.checkIn}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black">
                        {formatSAR(b.cash)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-950">
                        {formatSAR(b.ltv)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Highlight Note of key losses */}
          <div className="mt-4 p-4 bg-red-50 border border-red-150 rounded-2xl flex items-start gap-2 text-red-800 text-xs">
            <span className="text-base">⚠️</span>
            <p className="leading-relaxed">
              <strong>Critical Risk Notice (Cancellations):</strong> There are exactly <strong>9 cancelled bookings</strong> clearly visible above, including three significant performance acquisition losses: <strong>Faisal Alotaimeen</strong> (M13 Al Aqiq), <strong>Tahreem Atta</strong> (M1 King Faisal, Facebook channel, 100% Mathwaa share) and <strong>Hoor Alturki</strong> (M38, TikTok channel). Mitigating these cancellation drop-offs is our key priority.
            </p>
          </div>
        </motion.div>

      </main>

      {/* SECTION 7: FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 mt-12 pt-8 text-center text-[10px] sm:text-xs text-gray-500 leading-relaxed font-semibold">
        <p>
          Mathwaa - Marketing Report · 5 July 2026 · Windows: last 30 days (5 Jun - 5 Jul) & last 7 days (28 Jun - 5 Jul) · Revenue = Mathwaa net management fee share, cash-collected basis; LTV = committed term · Occupancy = performance bookings ÷ building capacity units.
        </p>
        <p className="mt-1 text-gray-400">
          Developed for Mathwaa Leadership & Board of Directors. All records audited and reconciled.
        </p>
      </footer>

      {/* Formulas & Calculations Popup Modal */}
      <FormulaModal 
        isOpen={isFormulaOpen} 
        onClose={() => setIsFormulaOpen(false)} 
        lang="en" 
      />
    </div>
  );
};

export default App_en;
