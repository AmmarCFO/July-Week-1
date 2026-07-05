import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icons';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

const definitions = {
  en: [
    {
      label: "June Cash Collected ROI (Total Marketing)",
      formula: "Performance Cash Collected (SAR 26,622) ÷ Total Marketing Spend (SAR 18,324) = 1.45x",
      description: "Measures immediate liquid cash generated per 1 SAR spent on total marketing (media ad spend + creative content production overhead). For every 1 SAR spent, 1.45 SAR in management fee cash was collected."
    },
    {
      label: "June Contract LTV ROI (Total Marketing)",
      formula: "Performance Contract LTV (SAR 80,804) ÷ Total Marketing Spend (SAR 18,324) = 4.41x",
      description: "Measures long-term future contracted Lifetime Value (LTV) secured per 1 SAR spent on total marketing. For every 1 SAR spent, 4.41 SAR in future contract value was committed."
    },
    {
      label: "June Cash ROI (Ads Only / ROAS)",
      formula: "Performance Cash Collected (SAR 26,622) ÷ Media Ad Spend (SAR 17,824) = 1.49x",
      description: "Evaluates conversion efficiency of media campaigns alone, excluding content creation overhead. For every 1 SAR spent on digital ads (Meta + TikTok), 1.49 SAR in immediate cash was generated."
    },
    {
      label: "June Contract LTV ROI (Ads Only)",
      formula: "Performance Contract LTV (SAR 80,804) ÷ Media Ad Spend (SAR 17,824) = 4.53x",
      description: "Measures media ad spend conversion into long-term customer lease commitments. For every 1 SAR spent on media ads, 4.53 SAR in future contract value was secured."
    },
    {
      label: "7-Day Cash Collected ROI (Total Marketing)",
      formula: "Performance Cash Collected (SAR 11,022) ÷ Total Marketing Spend (SAR 3,736) = 2.95x",
      description: "Measures immediate cash return efficiency of recent marketing efforts over the last 7 days. For every 1 SAR spent, 2.95 SAR in immediate cash was collected."
    },
    {
      label: "7-Day Contract LTV ROI (Total Marketing)",
      formula: "Performance Contract LTV (SAR 34,998) ÷ Total Marketing Spend (SAR 3,736) = 9.37x",
      description: "Measures recently generated long-term contract value relative to recent marketing cost. For every 1 SAR spent, 9.37 SAR in future contract value was secured."
    }
  ],
  ar: [
    {
      label: "عائد النقد المحصل لشهر يونيو (إجمالي التسويق)",
      formula: "النقد المحصل للأداء (٢٦,٦٢٢ ر.س) ÷ إجمالي الإنفاق التسويقي (١٨,٣٢٤ ر.س) = ١.٤٥ ضعف",
      description: "يقيس السيولة النقدية الفورية المحصلة مقابل كل ١ ريال تم إنفاقه على إجمالي التسويق (الحملات الرقمية + تكاليف إنتاج المحتوى). مقابل كل ريال من الإنفاق، حصلنا على ١.٤٥ ريال نقداً كرسوم إدارة."
    },
    {
      label: "العائد على القيمة العمرية لعقود يونيو (LTV) (إجمالي التسويق)",
      formula: "القيمة العمرية لعقود الأداء (٨٠,٨٠٤ ر.س) ÷ إجمالي الإنفاق التسويقي (١٨,٣٢٤ ر.س) = ٤.٤١ ضعف",
      description: "يقيس القيمة التعاقدية المستقبلية المؤمنة مقابل كل ١ ريال تم إنفاقه على إجمالي التسويق. مقابل كل ريال من الإنفاق، تم الالتزام بـ ٤.٤١ ريال كقيمة عقود مستقبلية."
    },
    {
      label: "عائد النقد المحصل لشهر يونيو (الحملات الإعلانية فقط)",
      formula: "النقد المحصل للأداء (٢٦,٦٢٢ ر.س) ÷ إنفاق الإعلانات الرقمية (١٧,٨٢٤ ر.س) = ١.٤٩ ضعف",
      description: "يقيس كفاءة تحويل الإنفاق المباشر على الإعلانات دون حساب تكاليف إنتاج المحتوى الفرعية. مقابل كل ريال مستثمر في الإعلانات (تيك توك وميتا)، تم تحصيل ١.٤٩ ريال نقداً."
    },
    {
      label: "العائد على قيمة العقود (LTV) لشهر يونيو (الحملات الإعلانية فقط)",
      formula: "القيمة العمرية لعقود الأداء (٨٠,٨٠٤ ر.س) ÷ إنفاق الإعلانات الرقمية (١٧,٨٢٤ ر.س) = ٤.٥٣ ضعف",
      description: "يقيس نجاح الحملات الإعلانية في إبرام التزامات إيجارية طويلة الأجل. مقابل كل ريال تم إنفاقه على الحملات، تم تأمين ٤.٥٣ ريال من العقود المستقبلية."
    },
    {
      label: "عائد النقد المحصل لـ ٧ أيام الأخيرة (إجمالي التسويق)",
      formula: "النقد المحصل للأداء (١١,٠٢٢ ر.س) ÷ إجمالي الإنفاق التسويقي (٣,٧٣٦ ر.س) = ٢.٩٥ ضعف",
      description: "يقيس كفاءة استرجاع السيولة الفورية لجهود التسويق المحسنة مؤخراً خلال الـ ٧ أيام الأخيرة. مقابل كل ريال من الإنفاق، تم تحصيل ٢.٩٥ ريال نقداً كرسوم إدارة."
    },
    {
      label: "العائد على القيمة العمرية لعقود ٧ أيام (LTV) (إجمالي التسويق)",
      formula: "القيمة العمرية لعقود الأداء (٣٤,٩٩٨ ر.س) ÷ إجمالي الإنفاق التسويقي (٣,٧٣٦ ر.س) = ٩.٣٧ ضعف",
      description: "يقيس نسبة القيمة الإيجارية المبرمة مؤخراً مقارنة بنفقات الأسبوع الأخير المطور. مقابل كل ريال إنفاق، تم تأمين عقود مستقبلية تبلغ قيمتها ٩.٣٧ ريال."
    }
  ]
};

const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose, lang }) => {
  const content = definitions[lang];
  const isRTL = lang === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
             <div className="bg-gray-50/50 border-b border-gray-100 p-6 flex justify-between items-center">
                 <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#4A2C5A]">
                        {lang === 'en' ? 'Calculations & Formulas' : 'طرق الاحتساب والمعادلات'}
                    </h3>
                 </div>
                 <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors shrink-0"
                 >
                    <CloseIcon className="w-5 h-5" />
                 </button>
             </div>

             <div className="p-6 overflow-y-auto space-y-6">
                {content.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="text-[#1D1D1F] font-bold text-lg mb-2">{item.label}</h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3 font-mono text-xs sm:text-sm text-[#4A2C5A] overflow-x-auto">
                            {item.formula}
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
             </div>
         </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FormulaModal;
