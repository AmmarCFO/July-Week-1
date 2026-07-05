// Mathwaa July 5, 2026 Marketing Report Data
// Period: Last 30 days (5 Jun–5 Jul) and Last 7 days (28 Jun–5 Jul)

export interface Booking {
  id: number;
  name: string;
  name_ar: string;
  branch: string;
  location: string;
  location_ar: string;
  monthlyRent: number;
  attribution: 'Performance' | 'Other';
  attribution_ar: string;
  status: 'Approved' | 'Cancelled' | 'Renewal';
  status_ar: string;
  checkIn: string;
  window: '30d' | '30d+7d' | 'upcoming';
  cash: number;
  ltv: number;
  paymentStatus: 'Paid' | 'Awaiting Payment' | 'Awaiting Tenant Approval';
  paymentStatus_ar: string;
}

export const BOOKINGS: Booking[] = [
  { id: 1, name: "Amal Alenazi", name_ar: "أمل العنزي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 5444, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "19/6", window: "30d", cash: 1361.0, ltv: 1701.25, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 2, name: "Day Aljameel", name_ar: "ضي الجميل", branch: "M23", location: "Al Yarmouk", location_ar: "اليرموك", monthlyRent: 4500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "25/6", window: "30d", cash: 1350.0, ltv: 4050.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 3, name: "Omaima Abdeen", name_ar: "أميمة عابدين", branch: "M20", location: "Al Zahraa", location_ar: "الزهراء", monthlyRent: 2500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "12/6", window: "30d", cash: 500.0, ltv: 1000.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 4, name: "Fai Alayafi", name_ar: "فيء العيافي", branch: "M32", location: "Al Qayrawan", location_ar: "القيروان", monthlyRent: 4500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "9/6", window: "30d", cash: 1125.0, ltv: 6750.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 5, name: "Heba Hosawi", name_ar: "هبة هوساوي", branch: "M20", location: "Al Zahraa", location_ar: "الزهراء", monthlyRent: 2400, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "16/6", window: "30d", cash: 480.0, ltv: 480.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 6, name: "Shuaa Almoghira", name_ar: "شعاع المغيرة", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4790, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "12/6", window: "30d", cash: 1197.5, ltv: 1197.5, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 7, name: "Athari Alqalhati", name_ar: "أثاري القلحاطي", branch: "M37", location: "Al Arid", location_ar: "العارض", monthlyRent: 2600, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "19/6", window: "30d", cash: 780.0, ltv: 780.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 8, name: "Zahraa Albasri", name_ar: "زهراء البصري", branch: "M7", location: "Al Arid", location_ar: "العارض", monthlyRent: 2900, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "12/6", window: "30d", cash: 580.0, ltv: 1160.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 9, name: "Faisal Alhussaini", name_ar: "فيصل الحسيني", branch: "M13", location: "Al Aqiq", location_ar: "العقيق", monthlyRent: 4800, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "19/6", window: "30d", cash: 960.0, ltv: 960.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 10, name: "Shahad Alotaibi", name_ar: "شهد العتيبي", branch: "M31", location: "Al Salam", location_ar: "السلام", monthlyRent: 3300, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "1/7", window: "30d+7d", cash: 990.0, ltv: 11880.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 11, name: "Fatma Alwasmi", name_ar: "فاطمة الوسمي", branch: "M6", location: "Al Arid", location_ar: "العارض", monthlyRent: 2900, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "19/6", window: "30d", cash: 580.0, ltv: 6960.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 12, name: "Dana Alshatab", name_ar: "دانة الشطب", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4345, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "27/6", window: "30d", cash: 1086.25, ltv: 1086.25, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 13, name: "Shahad Alshehri", name_ar: "شهد الشهري", branch: "M51", location: "Al Narjis", location_ar: "النرجس", monthlyRent: 2800, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "21/6", window: "30d", cash: 280.0, ltv: 3360.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 14, name: "Sulaf Albeshi", name_ar: "سلاف البيشي", branch: "M25", location: "Al Yarmouk", location_ar: "اليرموك", monthlyRent: 2330, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "24/6", window: "30d", cash: 699.0, ltv: 699.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 15, name: "Fatma Aldosari", name_ar: "فاطمة الدوسري", branch: "M39", location: "Al Nakhil", location_ar: "النخيل", monthlyRent: 3300, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "30/6", window: "30d+7d", cash: 990.0, ltv: 5940.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 16, name: "Majd Alotaibi", name_ar: "مجد العتيبي", branch: "M20", location: "Al Zahraa", location_ar: "الزهراء", monthlyRent: 2700, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "26/6", window: "30d", cash: 540.0, ltv: 1080.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 17, name: "Hoor Alturki", name_ar: "حور التركي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4420, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Cancelled", status_ar: "ملغى", checkIn: "27/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 18, name: "Sarah Almutairi", name_ar: "سارة المطيري", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "27/6", window: "30d", cash: 510.0, ltv: 6120.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 19, name: "Munira Alturki", name_ar: "منيرة التركي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4410, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "26/6", window: "30d", cash: 1102.5, ltv: 2205.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 20, name: "Alaa Alhayan", name_ar: "آلاء الحيان", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1560, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "23/6", window: "30d", cash: 468.0, ltv: 468.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 21, name: "Sarah AlSafar", name_ar: "سارة السفر", branch: "M15", location: "Al Yasmin", location_ar: "الياسمين", monthlyRent: 2500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "25/6", window: "30d", cash: 750.0, ltv: 4500.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 22, name: "Lamya Alghamdi", name_ar: "لمياء الغامدي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 5000, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "25/6", window: "30d", cash: 1250.0, ltv: 1250.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 23, name: "Ghada Alsughayyir", name_ar: "غادة الصغير", branch: "M39", location: "Al Nakhil", location_ar: "النخيل", monthlyRent: 5000, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "29/6", window: "30d+7d", cash: 1500.0, ltv: 4500.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 24, name: "Tahreem Atta", name_ar: "تحريم عطا", branch: "M1", location: "King Faisal", location_ar: "الملك فيصل", monthlyRent: 3500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Cancelled", status_ar: "ملغى", checkIn: "27/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 25, name: "Futun Alotaibi", name_ar: "فتون العتيبي", branch: "M31", location: "Al Salam", location_ar: "السلام", monthlyRent: 2970, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "3/6", window: "upcoming", cash: 891.0, ltv: 10692.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 26, name: "Nima Bishr", name_ar: "نعمة بشر", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4000, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "1/6", window: "upcoming", cash: 1000.0, ltv: 1000.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 27, name: "Gayatri Neti", name_ar: "غاياتري نيتي", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 5600, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "6/6", window: "30d", cash: 1400.0, ltv: 16800.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 28, name: "Ahmed Farrag", name_ar: "أحمد فراج", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 6500, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "9/6", window: "30d", cash: 1625.0, ltv: 19500.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 29, name: "Fatma Almohsen", name_ar: "فاطمة المحسن", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "27/6", window: "30d", cash: 510.0, ltv: 1020.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 30, name: "Noor Alalwan", name_ar: "نور العلوان", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "27/6", window: "30d", cash: 510.0, ltv: 1020.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 31, name: "Moayad Alsayad", name_ar: "مؤيد الصياد", branch: "M51", location: "Al Narjis", location_ar: "النرجس", monthlyRent: 6500, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "17/7", window: "upcoming", cash: 650.0, ltv: 650.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 32, name: "Remaa Adil", name_ar: "ريماء عادل", branch: "M56", location: "Al Madinah", location_ar: "المدينة المنورة", monthlyRent: 8050, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "28/6", window: "30d+7d", cash: 1610.0, ltv: 1610.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 33, name: "Khalid Alhunaiti", name_ar: "خالد الحنيطي", branch: "M13", location: "Al Aqiq", location_ar: "العقيق", monthlyRent: 5600, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Cancelled", status_ar: "ملغى", checkIn: "1/7", window: "30d+7d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 34, name: "Yasmeen Samaneh", name_ar: "ياسمين سمانة", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4190, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "12/6", window: "30d", cash: 1047.5, ltv: 1047.5, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 35, name: "Taimoor Ahmed", name_ar: "تيمور أحمد", branch: "M56", location: "Al Madinah", location_ar: "المدينة المنورة", monthlyRent: 135, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "18/6", window: "30d", cash: 27.0, ltv: 27.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 36, name: "Hawra AlZaher", name_ar: "حوراء آل زاهر", branch: "M18", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 3400, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Cancelled", status_ar: "ملغى", checkIn: "20/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Awaiting Payment", paymentStatus_ar: "بانتظار السدااد" },
  { id: 37, name: "Hala Almuwaishir", name_ar: "هالة المويشير", branch: "M50", location: "Al Narjis", location_ar: "النرجس", monthlyRent: 3200, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "1/7", window: "30d+7d", cash: 320.0, ltv: 3840.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 38, name: "Khairia Mandoura", name_ar: "خيرية مندورة", branch: "M25", location: "Al Yarmouk", location_ar: "اليرموك", monthlyRent: 2330, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "24/6", window: "30d", cash: 699.0, ltv: 699.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 39, name: "Mashael Albalawi", name_ar: "مشاعل البلوي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4420, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "19/6", window: "30d", cash: 1105.0, ltv: 3315.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 40, name: "Layan Almutairi", name_ar: "ليان المطيري", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4000, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "26/6", window: "30d", cash: 1000.0, ltv: 2000.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 41, name: "Radwa Madkour", name_ar: "رضوى مدكور", branch: "M13", location: "Al Aqiq", location_ar: "العقيق", monthlyRent: 5500, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "27/6", window: "30d", cash: 1100.0, ltv: 13200.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 42, name: "Hira Asif", name_ar: "حيرة آصف", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 7000, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "30/6", window: "30d+7d", cash: 1750.0, ltv: 21000.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 43, name: "Taghreed Almutairi", name_ar: "تغريد المطيري", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4950, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "1/7", window: "30d+7d", cash: 1237.5, ltv: 1237.5, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 44, name: "Hind Alotaibi", name_ar: "هند العتيبي", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "1/7", window: "30d+7d", cash: 153.0, ltv: 5508.0, paymentStatus: "Awaiting Payment", paymentStatus_ar: "بانتظار السداد" },
  { id: 45, name: "Sadeem Alotaibi", name_ar: "سديم العتيبي", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "24/6", window: "30d", cash: 153.0, ltv: 5508.0, paymentStatus: "Awaiting Payment", paymentStatus_ar: "بانتظار السداد" },
  { id: 46, name: "Fatma Albatbah", name_ar: "فاطمة البطاح", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4600, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "4/7", window: "30d+7d", cash: 1150.0, ltv: 1150.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 47, name: "Nasser Almulhim", name_ar: "ناصر الملحم", branch: "M43", location: "Al Ta'awun", location_ar: "التعاون", monthlyRent: 10752, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Cancelled", status_ar: "ملغى", checkIn: "4/6", window: "upcoming", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 48, name: "Mohammed Abdelmonem", name_ar: "محمد عبد المنعم", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 5400, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Cancelled", status_ar: "ملغى", checkIn: "17/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 49, name: "Maimouna Hajouri", name_ar: "ميمونة هجوري", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 5000, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Cancelled", status_ar: "ملغى", checkIn: "23/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 50, name: "Nawar Batweel", name_ar: "نوار باتويل", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4550, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Cancelled", status_ar: "ملغى", checkIn: "27/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 51, name: "Mai Alghunaimi", name_ar: "مي الغنيمي", branch: "M32", location: "Al Qayrawan", location_ar: "القيروان", monthlyRent: 2600, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Renewal", status_ar: "تجديد", checkIn: "14/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 52, name: "Nouf Bin Ghadeer", name_ar: "نوف بن غدير", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4350, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Renewal", status_ar: "تجديد", checkIn: "14/6", window: "30d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 53, name: "Lana Alhemairi", name_ar: "لانا الحميري", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4500, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "28/6", window: "30d+7d", cash: 1125.0, ltv: 1125.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 54, name: "Adwaa Hosawi", name_ar: "أضواء هوساوي", branch: "M42", location: "Al Arid", location_ar: "العارض", monthlyRent: 1700, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "1/7", window: "30d+7d", cash: 510.0, ltv: 510.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 55, name: "Yu kai", name_ar: "يو كاي", branch: "M55", location: "Al Madinah", location_ar: "المدينة المنورة", monthlyRent: 6325, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "30/6", window: "30d+7d", cash: 1265.0, ltv: 15180.0, paymentStatus: "Awaiting Payment", paymentStatus_ar: "بانتظار السداد" },
  { id: 56, name: "Janna kay", name_ar: "جينا دي بير", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 4972, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "12/7", window: "upcoming", cash: 1243.0, ltv: 14916.0, paymentStatus: "Awaiting Tenant Approval", paymentStatus_ar: "بانتظار موافقة المستأجر" },
  { id: 57, name: "Almuazzir Albusaidi", name_ar: "المعز البوسعيدي", branch: "M57", location: "(new branch)", location_ar: "فرع جديد", monthlyRent: 4000, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "30/6", window: "30d+7d", cash: 1000.0, ltv: 1000.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 58, name: "Sami atef", name_ar: "سامي عاطف", branch: "M43", location: "Al Ta'awun", location_ar: "التعاون", monthlyRent: 5500, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "9/7", window: "upcoming", cash: 385.0, ltv: 4620.0, paymentStatus: "Awaiting Tenant Approval", paymentStatus_ar: "بانتظار موافقة المستأجر" },
  { id: 59, name: "Faisal Alotaimeen", name_ar: "فيصل العثيمين", branch: "M13", location: "Al Aqiq", location_ar: "العقيق", monthlyRent: 7400, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Cancelled", status_ar: "ملغى", checkIn: "1/7", window: "30d+7d", cash: 0, ltv: 0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 60, name: "Esraa Ahmed", name_ar: "إسراء أحمد", branch: "M13", location: "Al Aqiq", location_ar: "العقيق", monthlyRent: 5480, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "14/7", window: "upcoming", cash: 1096.0, ltv: 13152.0, paymentStatus: "Awaiting Tenant Approval", paymentStatus_ar: "بانتظار موافقة المستأجر" },
  { id: 61, name: "Abdullah Alkhuneizi", name_ar: "عبد الله الخنيزي", branch: "M33", location: "Al Olaya", location_ar: "العليا", monthlyRent: 6140, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "2/7", window: "30d+7d", cash: 1535.0, ltv: 1535.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 62, name: "Deemah Almutairi", name_ar: "ديمة المطيري", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4900, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "4/7", window: "30d+7d", cash: 1225.0, ltv: 1225.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 63, name: "Shahad Idris", name_ar: "شهد ادريس", branch: "M23", location: "Al Yarmouk", location_ar: "اليرموك", monthlyRent: 2800, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "5/7", window: "30d+7d", cash: 840.0, ltv: 840.0, paymentStatus: "Awaiting Tenant Approval", paymentStatus_ar: "بانتظار موافقة المستأجر" },
  { id: 64, name: "Jory Alatiwi", name_ar: "جوري العتيوي", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 5100, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "4/7", window: "30d+7d", cash: 1275.0, ltv: 1275.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 65, name: "Rufaida Alsharif", name_ar: "رفيدة الشريف", branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", monthlyRent: 4350, attribution: "Performance", attribution_ar: "التسويق بالأداء", status: "Approved", status_ar: "مقبول", checkIn: "4/7", window: "30d+7d", cash: 1087.5, ltv: 3262.5, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" },
  { id: 66, name: "Fatma Almutawaa", name_ar: "فاطمة المطوع", branch: "M19", location: "Al Zahraa", location_ar: "الزهراء", monthlyRent: 2400, attribution: "Other", attribution_ar: "مصادر أخرى", status: "Approved", status_ar: "مقبول", checkIn: "5/7", window: "30d+7d", cash: 480.0, ltv: 5280.0, paymentStatus: "Paid", paymentStatus_ar: "تم السداد" }
];

export interface OccupancyContribution {
  branch: string;
  location: string;
  location_ar: string;
  perfBookings: number;
  units: number;
  pct: number;
}

export const OCCUPANCY_DATA: OccupancyContribution[] = [
  { branch: "M20", location: "Al Zahraa", location_ar: "الزهراء", perfBookings: 3, units: 4, pct: 75.0 },
  { branch: "M23", location: "Al Yarmouk", location_ar: "اليرموك", perfBookings: 2, units: 4, pct: 50.0 },
  { branch: "M39", location: "Al Nakhil", location_ar: "النخيل", perfBookings: 2, units: 4, pct: 50.0 },
  { branch: "M25", location: "Al Yarmouk", location_ar: "اليرموك", perfBookings: 1, units: 3, pct: 33.3 },
  { branch: "M7", location: "Al Arid", location_ar: "العارض", perfBookings: 1, units: 4, pct: 25.0 },
  { branch: "M38", location: "Al Sulaimaniyah", location_ar: "السليمانية", perfBookings: 9, units: 37, pct: 24.3 },
  { branch: "M32", location: "Al Qayrawan", location_ar: "القيروان", perfBookings: 1, units: 5, pct: 20.0 },
  { branch: "M37", location: "Al Arid", location_ar: "العارض", perfBookings: 1, units: 5, pct: 20.0 },
  { branch: "M6", location: "Al Arid", location_ar: "العارض", perfBookings: 1, units: 5, pct: 20.0 },
  { branch: "M15", location: "Al Yasmin", location_ar: "الياسمين", perfBookings: 1, units: 5, pct: 20.0 },
  { branch: "M31", location: "Al Salam", location_ar: "السلام", perfBookings: 1, units: 12, pct: 8.3 },
  { branch: "M13", location: "Al Aqiq", location_ar: "العقيق", perfBookings: 1, units: 35, pct: 2.9 },
  { branch: "M51", location: "Al Narjis", location_ar: "النرجس", perfBookings: 1, units: 20, pct: 5.0 },
  { branch: "M42", location: "Al Arid", location_ar: "العارض", perfBookings: 3, units: 100, pct: 3.0 }
];

export const METRICS = {
  last30d: {
    totalCash: 44819,
    perfCash: 25142,
    perfCashPct: 56,
    perfLtv: 76364,
    otherCash: 19677,
    otherLtv: 121477
  },
  last7d: {
    totalCash: 20043,
    perfCash: 9542,
    perfCashPct: 48,
    perfLtv: 30558,
    otherCash: 10500,
    otherLtv: 57340
  }
};

export const ROI_DATA = {
  last30d: {
    adSpend: 17824,
    contentCreation: 500,
    roiCashAdsOnly: 1.41,
    roiCashAdsAndContent: 1.37,
    roiLtvAdsOnly: 4.28,
    roiLtvAdsAndContent: 4.17,
    tiktokSpend: 10214,
    metaSpend: 7610
  },
  last7d: {
    adSpend: 3736,
    contentCreation: 0,
    roiCashAdsOnly: 2.55,
    roiCashAdsAndContent: 2.55,
    roiLtvAdsOnly: 8.18,
    roiLtvAdsAndContent: 8.18,
    tiktokSpend: 2446,
    metaSpend: 1289.50
  }
};
