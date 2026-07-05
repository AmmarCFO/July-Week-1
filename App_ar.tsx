import React, { useState, useMemo } from 'react';
import { BOOKINGS, OCCUPANCY_DATA, METRICS, ROI_DATA, Booking } from './constants';
import Header_ar from './components/Header_ar';
import FormulaModal from './components/FormulaModal';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Arabic currency formatter
const formatSAR_Ar = (value: number) => {
  return `${value.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: value % 1 === 0 ? 0 : 2 })} ريال`;
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
          <span className={`text-2xl sm:text-3xl font-black font-sans tracking-tight ${textColorClass}`}>
            {percentage}٪
          </span>
          {sublabel && (
            <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${sublabelColorClass}`}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className={`text-xs font-extrabold tracking-wider mt-3 block text-center ${labelColorClass}`}>
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
          {/* Fill circle */}
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
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5 font-sans">
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

const App_ar: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
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
        b.name_ar.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.branch.toLowerCase().includes(query) ||
        b.location_ar.toLowerCase().includes(query) ||
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
    <div className="min-h-screen pb-20 selection:bg-[#4A2C5A] selection:text-white bg-white font-cairo antialiased text-gray-900" dir="rtl">
      <Header_ar onToggleLanguage={onToggleLanguage} onShowFormulas={() => setIsFormulaOpen(true)} />

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
                تحليلات التسويق ولوحة الأداء التنفيذية
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight mt-3">
                مثوى - التقرير <span className="text-[#4A2C5A]">التسويقي التنفيذي</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium mt-2">
                تاريخ التقرير: <strong className="text-gray-900">٥ يوليو ٢٠٢٦</strong> · الإيرادات على أساس نقدي محصل (حصة عمولة إدارة مثوى لمدة شهر واحد)؛ وتظهر قيمة العقود المستقبلية الملتزم بها بشكل مستقل كقيمة عمر افتراضي (LTV).
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm self-start md:self-auto">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                مدقق ومصادق عليه
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
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-6 border-b border-[#4A2C5A]/25 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
                نافذة الـ ٣٠ يوماً الأخيرة
              </h3>
              <span className="text-xs font-bold text-purple-200 bg-[#4A2C5A]/40 px-2.5 py-0.5 rounded-md font-sans border border-[#4A2C5A]/30">٥ يونيو – ٥ يوليو</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">إجمالي النقد المحصل</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last30d.totalCash)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">النقد المستلم من عقود الإيجار النشطة</span>
              </div>

              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">نقد التسويق بالأداء</span>
                <span className="text-2xl sm:text-3xl font-black text-[#D8B4FE] font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last30d.perfCash)}
                </span>
                <span className="text-[10px] text-purple-200 font-bold block mt-1">
                  الحصة: {METRICS.last30d.perfCashPct}٪ من الإجمالي
                </span>
              </div>

              <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-255">
                <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">القيمة العمرية للتسويق (LTV)</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last30d.perfLtv)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">القيمة الملتزم بها مستقبلاً (من الإعلانات)</span>
              </div>

              <div 
                onClick={() => setIsFormulaOpen(true)}
                className="p-4 bg-[#4A2C5A]/20 rounded-2xl border border-[#4A2C5A]/40 hover:bg-[#4A2C5A]/30 transition-all duration-255 cursor-pointer relative group/roi"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-[#E9D5FF] font-extrabold uppercase tracking-wider block">عائد النقد (الإعلانات فقط)</span>
                  <span className="text-[9px] text-[#A855F7] bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold group-hover/roi:bg-[#A855F7]/30 transition-colors">المعادلة</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans mt-1 block">
                  {ROI_DATA.last30d.roiCashAdsOnly} ضعف
                </span>
                <span className="text-[10px] text-purple-200 font-semibold block mt-1 leading-normal">
                  مقابل كل <strong className="text-white">ريال واحد منفق</strong> على الإعلانات، تم تحصيل <strong className="text-emerald-300">{ROI_DATA.last30d.roiCashAdsOnly} ريال</strong> نقداً (حصة الأرباح).
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
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between mb-6 border-b border-amber-500/20 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                نافذة الـ ٧ أيام الأخيرة
              </h3>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-md font-sans border border-amber-500/30">٢٨ يونيو – ٥ يوليو</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-200 font-extrabold uppercase tracking-wider block">إجمالي النقد المحصل</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last7d.totalCash)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">نقد محصل من الدخول السريع للوحدات</span>
              </div>

              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">نقد التسويق بالأداء</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last7d.perfCash)}
                </span>
                <span className="text-[10px] text-amber-200 font-bold block mt-1">
                  الحصة: {METRICS.last7d.perfCashPct}٪ من الإجمالي
                </span>
              </div>

              <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-255">
                <span className="text-[10px] text-amber-200 font-extrabold uppercase tracking-wider block">القيمة العمرية للتسويق (LTV)</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-sans mt-1 block">
                  {formatSAR_Ar(METRICS.last7d.perfLtv)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">القيمة الملتزم بها مستقبلاً من الإعلانات</span>
              </div>

              <div 
                onClick={() => setIsFormulaOpen(true)}
                className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 hover:bg-amber-950/60 transition-all duration-255 cursor-pointer relative group/roi"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">عائد النقد (الإعلانات فقط)</span>
                  <span className="text-[9px] text-amber-400 bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold group-hover/roi:bg-amber-500/30 transition-colors">المعادلة</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-sans mt-1 block">
                  {ROI_DATA.last7d.roiCashAdsOnly} ضعف
                </span>
                <span className="text-[10px] text-amber-200 font-semibold block mt-1 leading-normal">
                  مقابل كل <strong className="text-white">ريال واحد منفق</strong> على الإعلانات، تم تحصيل <strong className="text-amber-300">{ROI_DATA.last7d.roiCashAdsOnly} ريال</strong> نقداً.
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
          className="bg-[#0E0B16] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden group text-right"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">تحليل العائد الاستثماري لمراحل دورة الحياة</h2>
              <p className="text-xs sm:text-sm text-purple-200 font-medium mt-1">مقارنة عوائد النقد المحصل الفعلي مقابل القيمة العمرية المستقبلية الإجمالية للعقود بالنسبة للتكاليف التسويقية</p>
            </div>
            {/* Window toggle */}
            <div className="flex bg-[#190C24] p-1 rounded-full border border-purple-500/20 self-start shrink-0 font-sans">
              <button 
                onClick={() => setRoiWindow('30d')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${roiWindow === '30d' ? 'bg-[#4A2C5A] text-white shadow-md' : 'text-purple-300 hover:text-white'}`}
              >
                ٣٠ يوماً
              </button>
              <button 
                onClick={() => setRoiWindow('7d')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${roiWindow === '7d' ? 'bg-[#4A2C5A] text-white shadow-md' : 'text-purple-300 hover:text-white'}`}
              >
                ٧ أيام
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Card 1: Cash Collected ROI */}
            <div className="bg-[#190C24] border border-[#4A2C5A]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between hover:border-[#4A2C5A]/60 transition-colors">
              <div className="space-y-3 flex-1 text-center sm:text-right">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-extrabold uppercase bg-purple-950/80 border border-purple-500/30 text-[#D8B4FE] px-2 py-0.5 rounded-full font-sans">
                    العائد النقدي (CASH RETURN)
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans">
                    الإنفاق الأساسي: {roiWindow === '30d' ? formatSAR_Ar(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation) : formatSAR_Ar(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {roiWindow === '30d' ? 'العائد على النقد المحصل لشهر يونيو' : 'العائد على النقد المحصل لـ ٧ أيام'}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
                  مقابل كل <strong className="text-white">ريال واحد</strong> منفق على إجمالي التسويق (الإعلانات + مصاريف المحتوى)، تم تحصيل <strong className="text-emerald-400 font-mono font-bold">{roiWindow === '30d' ? `${ROI_DATA.last30d.roiCashAdsAndContent.toFixed(2)} ريال` : `${ROI_DATA.last7d.roiCashAdsAndContent.toFixed(2)} ريال`}</strong> نقداً فعلياً (حصة عمولة مثوى).
                </p>
                <div className="bg-[#0F0716] rounded-xl px-3.5 py-1.5 border border-purple-950 text-[11px] font-sans text-[#D8B4FE] inline-block" dir="ltr">
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
              <div className="space-y-3 flex-1 text-center sm:text-right">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-sans">
                    العائد العمرية للعقد (LIFECYCLE LTV)
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans">
                    الإنفاق الأساسي: {roiWindow === '30d' ? formatSAR_Ar(ROI_DATA.last30d.adSpend + ROI_DATA.last30d.contentCreation) : formatSAR_Ar(ROI_DATA.last7d.adSpend + ROI_DATA.last7d.contentCreation)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {roiWindow === '30d' ? 'العائد على القيمة العمرية الإجمالية للعقد' : 'العائد على القيمة العمرية لـ ٧ أيام'}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
                  مقابل كل <strong className="text-white">ريال واحد</strong> منفق على التسويق، تم تأمين وحجز <strong className="text-emerald-400 font-mono font-bold">{roiWindow === '30d' ? `${ROI_DATA.last30d.roiLtvAdsAndContent.toFixed(2)} ريال` : `${ROI_DATA.last7d.roiLtvAdsAndContent.toFixed(2)} ريال`}</strong> كقيمة تعاقدية مستقبلية مضمونة (LTV).
                </p>
                <div className="bg-[#0F0716] rounded-xl px-3.5 py-1.5 border border-purple-950 text-[11px] font-sans text-emerald-400 inline-block" dir="ltr">
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
          <span className="text-xs font-bold text-amber-700 bg-amber-150 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5 font-sans">تحليل</span>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-semibold">
            <strong>رؤية تنفيذية:</strong> &ldquo;حقق الإنفاق في الـ ٧ أيام الأخيرة معدل تحويل أكثر كفاءة بكثير (<strong>{ROI_DATA.last7d.roiCashAdsOnly} ضعفاً</strong> مقابل <strong>{ROI_DATA.last30d.roiCashAdsOnly} ضعفاً</strong> على النقد المحصل) - مما يوضح أن الاستهداف والتحسينات التقنية الأخيرة تؤدي بشكل أفضل بكثير.&rdquo;
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
            <h2 className="text-2xl font-extrabold text-gray-950">توزيع قنوات الاستقطاب: التسويق بالأداء مقابل المصادر الأخرى</h2>
            <p className="text-xs sm:text-sm text-gray-650 font-semibold mt-1">مقارنة نسب الإسناد من قنوات التواصل المدفوعة والمصادر الأخرى عبر النافذتين</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* High-contrast Ring Circles breakdown */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <ProgressRing 
                percentage={57} 
                label="التسويق بالأداء (٣٠ يوماً)" 
                sublabel="من إجمالي النقد" 
                colorClass="stroke-[#4A2C5A]"
                trailColorClass="stroke-gray-150"
              />
              <ProgressRing 
                percentage={51} 
                label="التسويق بالأداء (٧ أيام)" 
                sublabel="من إجمالي النقد" 
                colorClass="stroke-amber-600"
                trailColorClass="stroke-gray-150"
              />
            </div>

            {/* Structured Table */}
            <div className="lg:col-span-7 overflow-x-auto rounded-2xl border border-gray-300 shadow-sm">
              <table className="min-w-full divide-y divide-gray-300 text-right text-xs sm:text-sm">
                <thead className="bg-[#4A2C5A]/5 text-gray-900">
                  <tr>
                    <th className="py-3.5 px-4 font-extrabold text-gray-950 text-right">المقياس</th>
                    <th className="py-3.5 px-4 text-left font-extrabold text-[#4A2C5A]">الـ ٣٠ يوماً الأخيرة</th>
                    <th className="py-3.5 px-4 text-left font-extrabold text-amber-800">الـ ٧ أيام الأخيرة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-semibold text-gray-900">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-right text-gray-800">نقد التسويق بالأداء</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last30d.perfCash)}</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last7d.perfCash)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-right text-gray-800">نقد المصادر الأخرى</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last30d.otherCash)}</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last7d.otherCash)}</td>
                  </tr>
                  <tr className="bg-[#4A2C5A]/5 font-bold text-gray-950">
                    <td className="py-3.5 px-4 font-extrabold text-right">إجمالي النقد المحصل</td>
                    <td className="py-3.5 px-4 text-left font-sans text-[#4A2C5A] font-black">{formatSAR_Ar(METRICS.last30d.totalCash)}</td>
                    <td className="py-3.5 px-4 text-left font-sans text-amber-800 font-black">{formatSAR_Ar(METRICS.last7d.totalCash)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-right text-gray-800">نسبة التسويق بالأداء من النقد</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{METRICS.last30d.perfCashPct}٪</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{METRICS.last7d.perfCashPct}٪</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-right text-gray-800">القيمة العمرية للتسويق بالأداء (LTV)</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last30d.perfLtv)}</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last7d.perfLtv)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-normal text-right text-gray-800">القيمة العمرية للمصادر الأخرى (LTV)</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last30d.otherLtv)}</td>
                    <td className="py-3 px-4 text-left font-sans font-bold text-gray-950">{formatSAR_Ar(METRICS.last7d.otherLtv)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DEFINITIONS NOTE */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-300 text-[11px] sm:text-xs text-gray-750 leading-relaxed text-right">
            <strong className="text-gray-900 uppercase tracking-wider block mb-1">تنبيه تعريف القنوات والتصنيف:</strong>
            <p>
              <strong>المصادر الأخرى:</strong> تشمل جميع القنوات المجانية والعضوية، كالإحالات من الأصدقاء والمعارف، المستأجرين الحاليين والسابقين، منصات العقارات (بيوت أو عقار)، ومحركات البحث العضوية (جوجل أو البحث العام عبر الإنترنت).
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
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="mb-6 relative z-10">
            <h2 className="text-2xl font-bold text-white">المصاريف التسويقية وعائد الاستثمار</h2>
            <p className="text-xs sm:text-sm text-purple-300 font-medium mt-1">مصاريف الحملات المدققة مقارنة بالنقد المحصل الفعلي وقيمة العقود الإجمالية</p>
          </div>

          {/* Spend detail boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">الإنفاق الإعلاني لـ ٣٠ يوماً</span>
              <span className="text-xl font-bold text-white block font-sans mt-1">
                {formatSAR_Ar(ROI_DATA.last30d.adSpend)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1 font-sans" dir="ltr">
                TikTok: {formatSAR_Ar(ROI_DATA.last30d.tiktokSpend)} | Meta: {formatSAR_Ar(ROI_DATA.last30d.metaSpend)}
              </span>
            </div>

            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">صناعة محتوى ٣٠ يوماً</span>
              <span className="text-xl font-bold text-white block font-sans mt-1">
                {formatSAR_Ar(ROI_DATA.last30d.contentCreation)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1">تكاليف المحتوى الإبداعي (١٦ يونيو)</span>
            </div>

            <div className="p-4 bg-[#190C24] rounded-2xl border border-[#4A2C5A]/30 hover:border-[#4A2C5A]/50 transition-all duration-200">
              <span className="text-[10px] text-purple-300 font-extrabold uppercase block">الإنفاق الإعلاني لـ ٧ أيام</span>
              <span className="text-xl font-bold text-white block font-sans mt-1">
                {formatSAR_Ar(ROI_DATA.last7d.adSpend)}
              </span>
              <span className="text-[9px] text-gray-400 block mt-1 font-sans" dir="ltr">
                TikTok: {formatSAR_Ar(ROI_DATA.last7d.tiktokSpend)} | Meta: {formatSAR_Ar(ROI_DATA.last7d.metaSpend)}
              </span>
            </div>

            <div className="p-4 bg-[#241320] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-200">
              <span className="text-[10px] text-amber-300 font-extrabold uppercase block">صناعة محتوى ٧ أيام</span>
              <span className="text-xl font-bold text-amber-400 block mt-1 font-sans">
                ٠ ريال
              </span>
              <span className="text-[9px] text-amber-500 block mt-1">لا توجد تكاليف محتوى هذا الأسبوع</span>
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-2xl border border-[#4A2C5A]/30 relative z-10 bg-[#0F0716]">
            <table className="min-w-full divide-y divide-[#4A2C5A]/30 text-right text-xs sm:text-sm">
              <thead className="bg-[#190C24] text-purple-300">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-purple-200 text-right">نموذج النسب والتحليلات المالية</th>
                  <th className="py-3.5 px-4 text-left font-bold text-[#D8B4FE]">الـ ٣٠ يوماً الأخيرة</th>
                  <th className="py-3.5 px-4 text-left font-bold text-amber-400">الـ ٧ أيام الأخيرة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A2C5A]/20 font-semibold text-purple-100">
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4 text-right">الإنفاق الإعلاني (تيك توك + ميتا)</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{formatSAR_Ar(ROI_DATA.last30d.adSpend)}</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{formatSAR_Ar(ROI_DATA.last7d.adSpend)}</td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4 text-right">صناعة وإنتاج المحتوى</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{formatSAR_Ar(ROI_DATA.last30d.contentCreation)}</td>
                  <td className="py-3.5 px-4 text-left font-sans text-gray-400">{formatSAR_Ar(ROI_DATA.last7d.contentCreation)}</td>
                </tr>
                <tr className="hover:bg-[#4A2C5A]/30 bg-[#4A2C5A]/10">
                  <td className="py-3.5 px-4 text-right font-bold text-[#E9D5FF]">العائد على النقد المحصل (الإعلانات فقط)</td>
                  <td className="py-3.5 px-4 text-left font-sans text-emerald-400 font-extrabold">{ROI_DATA.last30d.roiCashAdsOnly} ضعف <span className="text-xs font-normal text-purple-300">(+٤١٪)</span></td>
                  <td className="py-3.5 px-4 text-left font-sans text-amber-400 font-extrabold">{ROI_DATA.last7d.roiCashAdsOnly} ضعف <span className="text-xs font-normal text-amber-300">(+١٥٥٪)</span></td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4 text-right">العائد على النقد المحصل (الإعلانات + المحتوى)</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{ROI_DATA.last30d.roiCashAdsAndContent} ضعف <span className="text-xs font-normal text-purple-300">(+٣٧٪)</span></td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{ROI_DATA.last7d.roiCashAdsAndContent} ضعف <span className="text-xs font-normal text-amber-300">(+١٥٥٪)</span></td>
                </tr>
                <tr className="hover:bg-[#10B981]/20 bg-[#10B981]/5">
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-300">العائد على القيمة العمرية (LTV) (الإعلانات فقط)</td>
                  <td className="py-3.5 px-4 text-left font-sans text-emerald-400 font-extrabold">{ROI_DATA.last30d.roiLtvAdsOnly} ضعف</td>
                  <td className="py-3.5 px-4 text-left font-sans text-emerald-400 font-extrabold">{ROI_DATA.last7d.roiLtvAdsOnly} ضعف</td>
                </tr>
                <tr className="hover:bg-[#190C24]/40">
                  <td className="py-3.5 px-4 text-right">العائد على القيمة العمرية (LTV) (الإعلانات + المحتوى)</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{ROI_DATA.last30d.roiLtvAdsAndContent} ضعف</td>
                  <td className="py-3.5 px-4 text-left font-sans text-white">{ROI_DATA.last7d.roiLtvAdsAndContent} ضعف</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-[#190C24]/60 rounded-xl border border-[#4A2C5A]/20 text-xs text-purple-300 leading-relaxed italic text-right relative z-10">
            &ldquo;<strong>ملاحظة على آلية الحساب المعتمدة:</strong> تحسب العوائد المالية بدقة بناءً على <strong>صافي حصة عمولة إدارة مثوى الصافية</strong> وليس الإيجار الإجمالي للمبنى. العائد النقدي يقيم رأس المال السائل المحصل فعلياً، بينما العائد على القيمة العمرية (LTV) يأخذ بالاعتبار الالتزامات التعاقدية الموثقة طوال مدة عقد الإيجار.&rdquo;
          </div>
        </motion.div>

        {/* SECTION 3 — OCCUPANCY CONTRIBUTION FROM PERFORMANCE MARKETING */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0F0716] border border-[#4A2C5A]/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden group text-right"
          id="occupancy-contribution"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A2C5A]/15 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="mb-6 relative z-10 text-right">
            <h2 className="text-2xl font-bold text-white">المساهمة في السعة الإشغالية للوحدات</h2>
            <p className="text-xs sm:text-sm text-purple-300 font-medium mt-1">حجوزات التسويق بالأداء كنسبة مئوية من السعة الإجمالية للمبنى (آخر ٣٠ يوماً)</p>
          </div>

          {/* Ring Graph Grid representation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10 text-center">
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
                    <span className="text-xs font-bold text-white block mt-1 truncate max-w-[110px]">{item.location_ar}</span>
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
                        {item.pct.toFixed(0)}٪
                      </span>
                    </div>
                  </div>

                  <div className="text-[9px] text-purple-300 font-bold mt-2">
                    {item.perfBookings} / {item.units} وحدة
                  </div>
                </div>
              );
            })}
          </div>

          {/* Occupancy Bullet Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#4A2C5A]/20 relative z-10 text-right">
            <div className="p-4 bg-[#190C24] rounded-xl border border-[#4A2C5A]/30 shadow-md">
              <span className="text-[11px] font-extrabold text-[#D8B4FE] block uppercase tracking-wider">أعلى مساهمة نسبية %</span>
              <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                <strong>فرع M20 الزهراء:</strong> ملأ التسويق بالأداء <strong>٧٥.٠٪</strong> من السعة الكلية للمبنى - كأعلى مساهمة مئوية.
              </p>
            </div>
            <div className="p-4 bg-[#190C24] rounded-xl border border-[#4A2C5A]/30 shadow-md">
              <span className="text-[11px] font-extrabold text-[#D8B4FE] block uppercase tracking-wider">أكبر عدد حجوزات فعلية</span>
              <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                <strong>فرع M38 السليمانية:</strong> تم ملء <strong>٩ وحدات</strong> بالكامل بواسطة التسويق المدفوع (٢٤.٣٪ من مبنى يحتوي على ٣٧ وحدة) - كأكبر مساهمة مطلقة.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-purple-300 font-bold mt-4 text-center uppercase tracking-wider relative z-10">
            * المساهمة = حجوزات التسويق بالأداء كنسبة من السعة الإجمالية للمبنى (وليس التغيير الخام قبل وبعد في نسبة الإشغال).
          </p>
        </motion.div>

        {/* SECTION 5 — BOOKINGS TABLE */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-gray-200/80 shadow-md rounded-[2rem] p-6 sm:p-8 mb-10 sm:mb-12"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">سجل التدقيق الشامل للحجوزات</h2>
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">سجل تفصيلي قابل للبحث والفرز والتصفية لجميع المعاملات وحالة الدفع والمطابقة المالية</p>
            </div>
            
            {/* Table statistics badge */}
            <div className="bg-gray-100 text-gray-800 font-sans text-xs font-bold px-4 py-2 rounded-xl self-start xl:self-auto">
              عرض {filteredAndSortedBookings.length} من {BOOKINGS.length} معاملة مسجلة
            </div>
          </div>

          {/* Filters controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-150">
            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">البحث في الحجوزات</label>
              <input 
                type="text" 
                placeholder="ابحث بالاسم، الفرع، الموقع..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">تصفية حسب الحالة</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">جميع الحالات</option>
                <option value="Approved">مقبول</option>
                <option value="Cancelled">ملغى</option>
                <option value="Renewal">تجديد</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">تصفية قنوات الاستقطاب</label>
              <select 
                value={attributionFilter}
                onChange={(e) => setAttributionFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">جميع القنوات</option>
                <option value="Performance">التسويق بالأداء</option>
                <option value="Other">مصادر أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">تصفية النافذة الزمنية</label>
              <select 
                value={windowFilter}
                onChange={(e) => setWindowFilter(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4A2C5A]"
              >
                <option value="all">جميع النوافذ</option>
                <option value="30d">آخر ٣٠ يوماً (نقد محصل)</option>
                <option value="7d">آخر ٧ أيام (نقد محصل)</option>
                <option value="upcoming">قريباً (عقود الدخول بعد ٥ يوليو)</option>
              </select>
            </div>
          </div>

          {/* Sort instructions */}
          <div className="text-[10px] text-gray-400 font-semibold mb-2 flex items-center gap-1">
            <span>💡 انقر فوق عناوين الأعمدة لفرز وترتيب السجل</span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-gray-150">
            <table className="min-w-full divide-y divide-gray-200 text-right text-xs sm:text-sm">
              <thead className="bg-[#F8F6F9] text-gray-500 font-bold">
                <tr>
                  <th 
                    onClick={() => toggleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    اسم المستأجر {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('branch')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    الفرع {sortField === 'branch' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('location')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    الموقع {sortField === 'location' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('monthlyRent')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors text-left font-bold text-gray-700 text-left"
                  >
                    الإيجار الشهري {sortField === 'monthlyRent' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('attribution')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    قناة الاستقطاب {sortField === 'attribution' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('status')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    الحالة {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    onClick={() => toggleSort('paymentStatus')}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors font-bold text-gray-700 text-right"
                  >
                    حالة السداد {sortField === 'paymentStatus' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-right">تاريخ الدخول</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-left">حصة النقد المحصل</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-left">قيمة العقد (LTV)</th>
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1.5">
                            {b.name_ar}
                            {isKeyLoss && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded-full uppercase tracking-wider animate-pulse font-sans">
                                خسارة تسويقية كبرى
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal font-sans">{b.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono text-xs">{b.branch}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col text-xs font-normal">
                          <span className="font-semibold text-gray-800">{b.location_ar}</span>
                          <span className="text-gray-400 font-sans">{b.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-left font-sans font-bold">
                        {formatSAR_Ar(b.monthlyRent)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.attribution === 'Performance' 
                            ? 'bg-purple-100 text-[#4A2C5A]' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {b.attribution === 'Performance' ? 'التسويق بالأداء' : 'مصادر أخرى'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : b.status === 'Cancelled' 
                              ? 'bg-red-200 text-red-900 border border-red-300' 
                              : 'bg-gray-200 text-gray-700'
                        }`}>
                          {b.status === 'Approved' ? 'مقبول' : b.status === 'Cancelled' ? 'ملغى' : 'تجديد'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                          b.paymentStatus === 'Paid' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                            : b.paymentStatus === 'Awaiting Payment' 
                              ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {b.paymentStatus_ar}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs font-normal">
                        {b.checkIn}
                      </td>
                      <td className="py-3 px-4 text-left font-sans font-black">
                        {formatSAR_Ar(b.cash)}
                      </td>
                      <td className="py-3 px-4 text-left font-sans text-gray-950">
                        {formatSAR_Ar(b.ltv)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Highlight Note of key losses */}
          <div className="mt-4 p-4 bg-red-50 border border-red-150 rounded-2xl flex items-start gap-2 text-red-800 text-xs text-right">
            <span className="text-base">⚠️</span>
            <p className="leading-relaxed">
              <strong>تنبيه مخاطر الحجوزات الملغاة:</strong> هناك بالضبط <strong>٩ حجوزات ملغاة</strong> واضحة في الجدول أعلاه، بما في ذلك ثلاث خسائر تسويقية كبرى في قنوات الاستقطاب المدفوعة: <strong>فيصل العثيمين</strong> (مبنى M13 العقيق)، <strong>تحريم عطا</strong> (مبنى M1 الملك فيصل، قناة فيسبوك، حصة مثوى ١٠٠٪) و<strong>حور التركي</strong> (مبنى M38، قناة تيك توك). تعتبر معالجة وإيقاف هذه الإلغاءات أولويتنا القصوى حالياً.
            </p>
          </div>
        </motion.div>

      </main>

      {/* SECTION 7 — FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 mt-12 pt-8 text-center text-[10px] sm:text-xs text-gray-500 leading-relaxed font-semibold">
        <p>
          تقرير النمو التسويقي لمثوى · ٥ يوليو ٢٠٢٦ · النوافذ الزمنية: آخر ٣٠ يوماً (٥ يونيو - ٥ يوليو) وآخر ٧ أيام (٢٨ يونيو - ٥ يوليو) · الإيرادات = حصة عمولة إدارة مثوى الصافية، على أساس نقدي محصل فعلي؛ القيمة العمرية (LTV) = الالتزام لكامل مدة العقد · نسبة الإشغال = حجوزات التسويق بالأداء ÷ سعة الوحدات الإجمالية.
        </p>
        <p className="mt-1 text-gray-400 font-sans">
          Developed for Mathwaa Leadership & Board of Directors. All records audited and reconciled.
        </p>
      </footer>

      {/* Formulas & Calculations Popup Modal */}
      <FormulaModal 
        isOpen={isFormulaOpen} 
        onClose={() => setIsFormulaOpen(false)} 
        lang="ar" 
      />
    </div>
  );
};

export default App_ar;
