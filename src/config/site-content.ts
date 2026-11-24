/**
 * Public-site content for the trainer: credentials, services, packages,
 * testimonials and FAQ. Sourced from the trainer's existing site
 * (omdafit.com). Everything the landing page shows comes from here, so copy
 * and prices are edited in one place.
 *
 * Packages here are the initial values only — once the coaching-packages
 * feature lands they are seeded into the database and edited from the
 * dashboard.
 */

type L = { ar: string; en: string };

export const HERO: {
  eyebrow: L;
  titleLine1: L;
  titleLine2: L;
  subtitle: L;
  ctaPrimary: L;
  ctaSecondary: L;
  badge: L;
} = {
  eyebrow: { ar: "تدريب أونلاين احترافي", en: "Online Coaching" },
  titleLine1: { ar: "أنا جاهز،", en: "I'm ready." },
  titleLine2: { ar: "إنت جاهز؟", en: "Are you ready?" },
  subtitle: {
    ar: "برنامج تمارين وتغذية مفصّل على مقاسك، مع متابعة حقيقية خطوة بخطوة حتى توصل لهدفك.",
    en: "A training and nutrition plan built around you, with real step-by-step follow-up until you reach your goal.",
  },
  ctaPrimary: { ar: "ابدأ التغيير", en: "Start now" },
  ctaSecondary: { ar: "تسجيل الدخول", en: "Sign in" },
  badge: { ar: "مدرب معتمد", en: "Certified Coach" },
};

export const PILLARS = ["TRAINING", "NUTRITION", "FOLLOW-UP", "STRENGTH", "DISCIPLINE", "RESULTS"] as const;

export const SERVICES: { title: L; desc: L }[] = [
  {
    title: { ar: "تمارين بالفيديو", en: "Workouts with video" },
    desc: {
      ar: "برنامج مخصّص لمستواك وأهدافك، مع فيديو لكل تمرين عشان تأدّيه صح.",
      en: "A plan for your level and goals, with a video for every exercise so your form is right.",
    },
  },
  {
    title: { ar: "تغذية مرنة", en: "Flexible nutrition" },
    desc: {
      ar: "نظام غذائي على ذوقك وميزانيتك — مش هتاكل نفس الأكل كل يوم.",
      en: "A diet built around your taste and budget — you won't eat the same food every day.",
    },
  },
  {
    title: { ar: "متابعة مستمرة", en: "Continuous follow-up" },
    desc: {
      ar: "تواصل مباشر، تعديل الخطة أول بأول، ودعم حقيقي طول رحلتك.",
      en: "Direct contact, plans adjusted as you go, and real support the whole way.",
    },
  },
];

export const CREDENTIALS: L[] = [];

export const STATS: { value: string; label: L }[] = [
  { value: "500+", label: { ar: "متدرب", en: "Clients" } },
  { value: "7+", label: { ar: "سنين خبرة", en: "Years" } },
  { value: "24/7", label: { ar: "متابعة", en: "Support" } },
];

export interface SitePackage {
  id: string;
  duration: L;
  /** Whole months of access; null for add-on style packages (VIP). */
  months: number | null;
  tagline: L;
  /** Prices in EGP. `originalPrice` is the struck-through price. */
  originalPrice: number;
  price: number;
  features: L[];
  popular?: boolean;
}

export const PACKAGES: SitePackage[] = [
  {
    id: "1m",
    duration: { ar: "شهر واحد", en: "1 Month" },
    months: 1,
    tagline: { ar: "بداية قوية", en: "Strong start" },
    originalPrice: 1000,
    price: 499,
    features: [
      { ar: "برنامج تمارين مخصّص بالفيديو", en: "Custom workout plan with video" },
      { ar: "نظام غذائي مرن حسب ميزانيتك", en: "Flexible diet for your budget" },
      { ar: "متابعة أسبوعية", en: "Weekly follow-up" },
    ],
  },
  {
    id: "3m",
    duration: { ar: "٣ شهور", en: "3 Months" },
    months: 3,
    tagline: { ar: "باقة الدب 🐻", en: "Most chosen" },
    originalPrice: 3000,
    price: 1499,
    popular: true,
    features: [
      { ar: "كل مزايا الشهر", en: "Everything in monthly" },
      { ar: "تعديل الخطة كل أسبوعين", en: "Plan updated every 2 weeks" },
      { ar: "متابعة دقيقة للقياسات", en: "Detailed measurement tracking" },
    ],
  },
  {
    id: "6m",
    duration: { ar: "٦ شهور", en: "6 Months" },
    months: 6,
    tagline: { ar: "نتائج تدوم", en: "Lasting results" },
    originalPrice: 6000,
    price: 3000,
    features: [
      { ar: "كل مزايا الـ٣ شهور", en: "Everything in 3 months" },
      { ar: "دعم أولوية على واتساب", en: "Priority WhatsApp support" },
      { ar: "مراجعة شهرية للصور", en: "Monthly photo review" },
    ],
  },
  {
    id: "12m",
    duration: { ar: "سنة كاملة", en: "12 Months" },
    months: 12,
    tagline: { ar: "أفضل قيمة", en: "Best value" },
    originalPrice: 12000,
    price: 6000,
    features: [
      { ar: "كل مزايا الـ٦ شهور", en: "Everything in 6 months" },
      { ar: "تثبيت السعر طوال السنة", en: "Price locked for a year" },
      { ar: "خطة تثبيت ونمط حياة", en: "Maintenance & lifestyle plan" },
    ],
  },
  {
    id: "vip",
    duration: { ar: "VIP", en: "VIP" },
    months: null,
    tagline: { ar: "دعم شخصي مباشر", en: "Direct personal support" },
    originalPrice: 5000,
    price: 2500,
    features: [
      { ar: "مكالمات هاتفية وفيديو", en: "Phone & video calls" },
      { ar: "رد فوري على مدار اليوم", en: "Same-day replies" },
      { ar: "متابعة يومية", en: "Daily follow-up" },
    ],
  },
];

export const TESTIMONIALS: { name: L; quote: L }[] = [];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { ar: "إزاي بدفع؟", en: "How do I pay?" },
    a: {
      ar: "الدفع عن طريق إنستا باي على الرقم 01014509058، وبعد ما الكابتن يأكد الدفع هيتواصل معاك على واتساب لتفعيل اشتراكك.",
      en: "Pay by InstaPay to 01014509058. Once the coach confirms the payment, he contacts you on WhatsApp to activate your subscription.",
    },
  },
  {
    q: { ar: "هستلم البرنامج إمتى؟", en: "When do I get my plan?" },
    a: {
      ar: "خلال ٢٤–٤٨ ساعة من تأكيد الدفع بيتبعتلك البرنامج كامل.",
      en: "Your full plan is sent within 24–48 hours of payment confirmation.",
    },
  },
  {
    q: { ar: "البرنامج للستات والرجالة؟", en: "Is it for men and women?" },
    a: {
      ar: "أيوه، البرامج متاحة للجنسين وبتتفصّل حسب الهدف.",
      en: "Yes — programs are available for both and tailored to your goal.",
    },
  },
];

export const CONTACT = {
  /** Local display format. */
  phone: "01014509058",
  /** International format, digits only — for wa.me links. */
  whatsapp: "201014509058",
  instapay: "01014509058",
  whatsappGreeting: {
    ar: "مرحبا كابتن، حابب أستفسر عن الاشتراك",
    en: "Hi coach, I'd like to ask about subscribing",
  } as L,
};

/**
 * Photo sets copied from the trainer's existing site, converted to WebP under
 * public/brand/. Paths are generated from the file counts below.
 */
const range = (n: number, start = 1) => Array.from({ length: n }, (_, i) => i + start);

export const GALLERY = {
  /** Client physique results (600×800). */
  transformations: range(5).map((i) => `/brand/transformations/t-${i}.webp`),
};
