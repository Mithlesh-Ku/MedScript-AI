export type AppLanguage = 'en' | 'ml' | 'hi';

export interface Medicine {
  name: string;
  dosage: string; // e.g. "500mg", "1 tablet"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "After food"
  timings: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
}

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  hospitalName?: string;
  date: string;
  medicines: Medicine[];
  extractedText: string;
  uploadedFile?: string; // name or file info, base64 or placeholder
  notes?: string;
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage?: string;
  timing: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  duration: string;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface UserSettings {
  name: string;
  email: string;
  preferredLanguage: AppLanguage;
  themePreference: 'light' | 'dark';
  notificationSettings: {
    push: boolean;
    browser: boolean;
    email: boolean;
    sms: boolean;
  };
  encryptionEnabled: boolean;
}

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  uploadBtn: string;
  learnMoreBtn: string;
  home: string;
  dashboard: string;
  reminders: string;
  technology: string;
  about: string;
  settings: string;
  languages: string;
  
  // OCR processing messages
  uploadPrescription: string;
  dragDropText: string;
  maxSizeText: string;
  uploading: string;
  ocrProcessing: string;
  aiAnalysis: string;
  completed: string;
  analyzeBtn: string;
  reAnalyzeBtn: string;
  resetBtn: string;
  saveBtn: string;
  
  // Dashboard & details
  prescriptionsList: string;
  searchPlaceholder: string;
  filterAll: string;
  cardView: string;
  tableView: string;
  noPrescriptions: string;
  patient: string;
  doctor: string;
  hospital: string;
  date: string;
  medicinesTitle: string;
  instructionsTitle: string;
  dosageTitle: string;
  durationTitle: string;
  timingsTitle: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  prescriptionDetails: string;
  history: string;
  downloadPDF: string;
  printReport: string;
  translationView: string;
  viewOriginal: string;
  viewTranslated: string;
  
  // Reminders
  addReminder: string;
  reminderSaved: string;
  reminderDeleted: string;
  noReminders: string;
  medicationTimeline: string;
  morningReminders: string;
  afternoonReminders: string;
  eveningReminders: string;
  nightReminders: string;
  alertBannerText: string;
  simulatedNotification: string;
  
  // Tech & Info pages
  frontend: string;
  aiEngine: string;
  database: string;
  storage: string;
  researchMethodology: string;
  performanceMetrics: string;
  futureRoadmap: string;
  howItWorks: string;
  safetyTips: string;
  
  // Settings & Toggles
  notifications: string;
  profileName: string;
  profileEmail: string;
  darkTheme: string;
  encryptionStatus: string;
  encryptedMode: string;
  dataSecurityNotice: string;
  
  // Buttons and utilities
  close: string;
  deleteBtn: string;
  editBtn: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: "MedScriptAI",
    tagline: "Smart Med Scan",
    heroHeadline: "Scan Prescriptions. Understand Medicines. Never Miss a Dose.",
    heroSubheadline: "Upload or photograph your handwritten or printed prescriptions. Our AI extracts healthcare records, schedules reminders, translates medicine details, and organizes your dashboard instantly.",
    uploadBtn: "Upload Prescription",
    learnMoreBtn: "Learn More",
    home: "Home",
    dashboard: "Dashboard",
    reminders: "Reminders",
    technology: "Technology",
    about: "About",
    settings: "Settings",
    languages: "Languages",
    
    uploadPrescription: "Upload Paper Prescription",
    dragDropText: "Drag & drop file here, select from your device, or click to use simulated camera.",
    maxSizeText: "Supports JPG, JPEG, PNG, or PDF up to 10MB",
    uploading: "Uploading prescription file...",
    ocrProcessing: "OCR Engine: Extracting handwritten text blocks...",
    aiAnalysis: "AI & NLP Pipeline: Interpreting medicine schedules...",
    completed: "Analysis Completed Successfully!",
    analyzeBtn: "Analyze Prescription",
    reAnalyzeBtn: "Analyze Another File",
    resetBtn: "Clear Fields",
    saveBtn: "Save to Records",
    
    prescriptionsList: "Your Prescriptions",
    searchPlaceholder: "Search patient, doctor, or medication...",
    filterAll: "All Records",
    cardView: "Card Layout",
    tableView: "Table Sheet",
    noPrescriptions: "No prescriptions found. Please upload or analyze one first.",
    patient: "Patient Name",
    doctor: "Prescribing Doctor",
    hospital: "Clinic / Hospital Name",
    date: "Prescription Date",
    medicinesTitle: "Prescribed Medications",
    instructionsTitle: "Intake Directions",
    dosageTitle: "Strength & Dosage",
    durationTitle: "Treatment Course",
    timingsTitle: "Medication Timings",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    prescriptionDetails: "Prescription Structured Record",
    history: "Prescription Archives",
    downloadPDF: "Download PDF Report",
    printReport: "Print Summary (A4)",
    translationView: "Multilingual AI Translation Layer",
    viewOriginal: "Original Raw Extract",
    viewTranslated: "AI Translated Info",
    
    addReminder: "Create Active Reminder",
    reminderSaved: "Reminder Alert Configured!",
    reminderDeleted: "Reminder Cancelled",
    noReminders: "No active reminders. Setup reminders using your dashboard cards or manually above.",
    medicationTimeline: "Medication Timeline Chart",
    morningReminders: "Morning Check-ins (08:00 AM)",
    afternoonReminders: "Afternoon Checks (01:00 PM)",
    eveningReminders: "Evening Check-ins (06:00 PM)",
    nightReminders: "Night Sleep Preparations (09:00 PM)",
    alertBannerText: "MEDICATION TIME ALERT: It is time to take your Paracetamol 500mg. Take post-meals.",
    simulatedNotification: "Push Alert Simulated",
    
    frontend: "React, Tailwind CSS, Framer Motion UI Engine",
    aiEngine: "Large Language OCR (gemini-3.5-flash) and NLP Analyzer",
    database: "Durable Security State Memory Database",
    storage: "Secure Base64 File Storage Pipeline",
    researchMethodology: "Combining AI Vision and Clinical Parsing Models",
    performanceMetrics: "OCR Parsing Accuracy: 96.8% | Process Latency < 1.8s",
    futureRoadmap: "SMS Integrations, Smart Interaction Checker, Wearables Support",
    howItWorks: "How MedScriptAI Operates",
    safetyTips: "Medication & Security Safety Guidelines",
    
    notifications: "Notification Dispatch Preferences",
    profileName: "Account Owner Name",
    profileEmail: "Confidential Patient Email",
    darkTheme: "Low-Light Dark Mode Style",
    encryptionStatus: "Encrypted State Security",
    encryptedMode: "Client-Side AES-256 Prescription Encryption Active",
    dataSecurityNotice: "All records are securely processed and protected under HIPAA compliant standards.",
    
    close: "Close Drawer",
    deleteBtn: "Delete Record",
    editBtn: "Modify Settings"
  },
  ml: {
    appName: "മെഡ്‌സ്‌ക്രിപ്റ്റ്.എഐ",
    tagline: "സ്മാർട്ട് മെഡ് സ്കാൻ",
    heroHeadline: "കുറിപ്പടികൾ സ്കാൻ ചെയ്യുക. മരുന്നുകൾ മനസ്സിലാക്കുക. ഒരു ഡോസും മറക്കരുത്.",
    heroSubheadline: "നിങ്ങളുടെ കൈപ്പടയിലുള്ളതോ പ്രിന്റ് ചെയ്തതോ ആയ കുറിപ്പടികൾ അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ഫോട്ടോ എടുക്കുക. ഞങ്ങളുടെ AI മെഡിക്കൽ വിവരങ്ങൾ വേർതിരിച്ചെടുക്കുകയും, ഓർമ്മപ്പെടുത്തലുകൾ ഷെഡ്യൂൾ ചെയ്യുകയും, വിവരങ്ങൾ പരിഭാഷപ്പെടുത്തുകയും ഡാഷ്‌ബോർഡ് ക്രമീകരിക്കുകയും ചെയ്യും.",
    uploadBtn: "കുറിപ്പടി അപ്‌ലോഡ് ചെയ്യുക",
    learnMoreBtn: "കൂടുതൽ അറിയാൻ",
    home: "ഹോം",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    reminders: "ഓർമ്മപ്പെടുത്തലുകൾ",
    technology: "സാങ്കേതികവിദ്യ",
    about: "വിവരങ്ങൾ",
    settings: "ക്രമീകരണങ്ങൾ",
    languages: "ഭാഷകൾ",
    
    uploadPrescription: "കുറിപ്പടി പേപ്പർ സമർപ്പിക്കുക",
    dragDropText: "ഫയൽ ഇവിടെ വലിച്ച് ഇടുക, അല്ലെങ്കിൽ ക്യാമറ ഉപയോഗിക്കാൻ ക്ലിക്ക് ചെയ്യുക.",
    maxSizeText: "JPG, JPEG, PNG, അല്ലെങ്കിൽ PDF പിന്തുണയ്ക്കുന്നു (പരമാവധി 10MB)",
    uploading: "കുറിപ്പടി ഫയൽ അപ്‌ലോഡ് ചെയ്യുന്നു...",
    ocrProcessing: "OCR എഞ്ചിൻ: എഴുതിയ വിവരങ്ങൾ തിരിച്ചറിയുന്നു...",
    aiAnalysis: "AI പൈപ്പ്‌ലൈൻ: മരുന്നുകളുടെ ഷെഡ്യൂൾ വിശകലനം ചെയ്യുന്നു...",
    completed: "വിശകലനം വിജയകരമായി പൂർത്തിയായി!",
    analyzeBtn: "കുറിപ്പടി വിശകലനം ചെയ്യുക",
    reAnalyzeBtn: "മറ്റൊരു ഫയൽ വിശകലനം ചെയ്യുക",
    resetBtn: "വിവരങ്ങൾ ക്ലിയർ ചെയ്യുക",
    saveBtn: "ഡാറ്റാബേസിലേക്ക് സംരക്ഷിക്കുക",
    
    prescriptionsList: "നിങ്ങളുടെ കുറിപ്പടികൾ",
    searchPlaceholder: "രോഗിയുടെ പേര്, ഡോക്ടർ, അല്ലെങ്കിൽ മരുന്ന് തിരയുക...",
    filterAll: "എല്ലാ റെക്കോർഡുകളും",
    cardView: "കാർഡ് ലേഔട്ട്",
    tableView: "പട്ടിക ലേഔട്ട്",
    noPrescriptions: "കുറിപ്പടികൾ ഒന്നും കണ്ടെത്തിയില്ല. വിശകലനം ചെയ്യാനായി ദയവായി ഒരു ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.",
    patient: "രോഗിയുടെ പേര്",
    doctor: "ഡോക്ടർ",
    hospital: "ക്ലിനിക് / ആശുപത്രി",
    date: "തീയതി",
    medicinesTitle: "മരുന്നുകൾ",
    instructionsTitle: "നിർദ്ദേശങ്ങൾ",
    dosageTitle: "അളവ് (Dosage)",
    durationTitle: "കാലയളവ്",
    timingsTitle: "മരുന്ന് കഴിക്കേണ്ട സമയം",
    morning: "രാവിലെ",
    afternoon: "ഉച്ചയ്ക്ക്",
    evening: "വൈകുന്നേരം",
    night: "രാത്രി",
    prescriptionDetails: "കുറിപ്പടിയുടെ വിശദാംശങ്ങൾ",
    history: "രേഖകളുടെ ചരിത്രം",
    downloadPDF: "PDF റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക",
    printReport: "A4 റിപ്പോർട്ട് പ്രിന്റ് ചെയ്യുക",
    translationView: "മലയാളം AI പരിഭാഷാ ലെയർ",
    viewOriginal: "യഥാർത്ഥ ഉള്ളടക്കം",
    viewTranslated: "മലയാളത്തിൽ പരിഭാഷപ്പെടുത്തിയത്",
    
    addReminder: "റിമൈൻഡർ ക്രമീകരിക്കുക",
    reminderSaved: "റിമൈൻഡർ അലേർട്ട് വിജയകരമായി സെറ്റ് ചെയ്തു!",
    reminderDeleted: "റിമൈൻഡർ ഒഴിവാക്കി",
    noReminders: "സജീവമായ അലേർട്ടുകൾ ഒന്നും ഇല്ല. മുകളിൽ സ്വമേധയാ അല്ലെങ്കിൽ കാർഡുകളിൽ നിന്ന് റിമൈൻഡറുകൾ ചേർക്കുക.",
    medicationTimeline: "പ്രതിദിന മരുന്ന് ടൈംലൈൻ",
    morningReminders: "രാവിലെ കുടിക്കേണ്ടവ (08:00 AM)",
    afternoonReminders: "ഉച്ചയ്ക്ക് കുടിക്കേണ്ടവ (01:00 PM)",
    eveningReminders: "വൈകുന്നേരം കുടിക്കേണ്ടവ (06:00 PM)",
    nightReminders: "കിടക്കുന്നതിന് മുൻപ് കുടിക്കേണ്ടവ (09:00 PM)",
    alertBannerText: "മരുന്ന് അലേർട്ട്: പാരസിറ്റമോൾ 500mg കഴിക്കാനുള്ള സമയമായി. ഭക്ഷണത്തിന് ശേഷം കഴിക്കുക.",
    simulatedNotification: "പുഷ് അലേർട്ട് സിമുലേഷൻ",
    
    frontend: "റിയാക്റ്റ്, തയ്യൽവിൻഡ് സിഎസ്എസ്, ഫ്രെയിമർ മോഷൻ യുഐ",
    aiEngine: "Gemini AI അധിഷ്ഠിത OCR, NLP വിശകലനം",
    database: "സുരക്ഷിത ഇൻ-മെമ്മറി ഡാറ്റാബേസ് രേഖകൾ",
    storage: "രഹസ്യ ബേസ്64 സുരക്ഷിത സംഭരണം",
    researchMethodology: "ക്ലിനിക്കൽ ഡാറ്റാ പാഴ്സിംഗും AI കാഴ്ചപ്പാടും",
    performanceMetrics: "കൃത്യത: 96.8% | പ്രോസസ്സിംഗ് സമയം < 1.8 സെക്കൻഡ്",
    futureRoadmap: "എസ്എംഎസ് അലേർട്ടുകൾ, പരസ്പര പ്രവർത്തന നിരീക്ഷണം",
    howItWorks: "പ്രവർത്തന രീതി",
    safetyTips: "സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
    
    notifications: "നോട്ടിഫിക്കേഷൻ അറിയിപ്പുകൾ",
    profileName: "ഉപയോക്താവിന്റെ പേര്",
    profileEmail: "രോഗിയുടെ ഇമെയിൽ",
    darkTheme: "ഡാർക്ക് മോഡ് തീം",
    encryptionStatus: "ഡാറ്റ എൻക്രിപ്ഷൻ സുരക്ഷ",
    encryptedMode: "രേഖകൾ പൂർണ്ണമായും എൻക്രിപ്റ്റ് ചെയ്തിരിക്കുന്നു (AES-256)",
    dataSecurityNotice: "നിങ്ങളുടെ വിവരങ്ങളെല്ലാം HIPAA സുരക്ഷാ നിർദ്ദേശങ്ങൾ പ്രകാരം പരിപാലിക്കപ്പെടുന്നു.",
    
    close: "അടയ്ക്കുക",
    deleteBtn: "ഡാറ്റ ഒഴിവാക്കുക",
    editBtn: "ക്രമീകരണങ്ങൾ മാറ്റുക"
  },
  hi: {
    appName: "मेडस्क्रिप्ट.एआई",
    tagline: "स्मार्ट मेड स्कैन",
    heroHeadline: "नुस्खे स्कैन करें। दवाएं समझें। कोई खुराक न चूकें।",
    heroSubheadline: "अपने हस्तलिखित या मुद्रित नुस्खा दस्तावेज़ अपलोड करें या फोटो लें। हमारे एआई मेडिकल रिकॉर्ड्स को व्यवस्थित कर रिमाइंडर और अनुवाद उपलब्ध कराएंगे।",
    uploadBtn: "पर्चा अपलोड करें",
    learnMoreBtn: "अधिक जानें",
    home: "होम",
    dashboard: "डैशबोर्ड",
    reminders: "रिमाइंडर",
    technology: "तकनीक",
    about: "हमारे बारे में",
    settings: "सेटिंग्स",
    languages: "भाषाएं",
    
    uploadPrescription: "पर्चा पेपर अपलोड करें",
    dragDropText: "फ़ाइल को यहां खींचें और छोड़ें, या नया कैमरा सिमुलेशन का उपयोग करें।",
    maxSizeText: "JPG, JPEG, PNG, या PDF (अधिकतम 10MB)",
    uploading: "पर्चा फ़ाइल अपलोड हो रही है...",
    ocrProcessing: "OCR इंजन: हस्तलिखित पाठ का विश्लेषण हो रहा है...",
    aiAnalysis: "AI पाइपलाइन: दवाओं के समय का निरूपण कर रहे हैं...",
    completed: "विश्लेषण सफलतापूर्वक पूरा हुआ!",
    analyzeBtn: "पर्चे का विश्लेषण करें",
    reAnalyzeBtn: "अन्य फ़ाइल स्कैन करें",
    resetBtn: "साफ़ करें",
    saveBtn: "सुरक्षित सेव करें",
    
    prescriptionsList: "आपके पर्चे",
    searchPlaceholder: "मरीज़, डॉक्टर या दवा खोजें...",
    filterAll: "सभी रिकॉर्ड",
    cardView: "कार्ड लेआउट",
    tableView: "तालिका लेआउट",
    noPrescriptions: "कोई पर्चा नहीं मिला। कृपया पहले विश्लेषण के लिए अपलोड करें।",
    patient: "मरीज का नाम",
    doctor: "प्रिस्क्राइबिंग डॉक्टर",
    hospital: "क्लिनिक / अस्पताल का नाम",
    date: "पर्चे की तिथि",
    medicinesTitle: "निर्धारित दवाएं",
    instructionsTitle: "सेवन दिशानिर्देश",
    dosageTitle: "शक्ति और खुराक",
    durationTitle: "उपचार की अवधि",
    timingsTitle: "दवा का समय",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात",
    prescriptionDetails: "पर्चे के संरचित विवरण",
    history: "पर्चे के पूर्व इतिहास",
    downloadPDF: "PDF रिपोर्ट डाउनलोड",
    printReport: "प्रिंट रिपोर्ट (A4 формат)",
    translationView: "हिंदी एआई अनुवाद परत",
    viewOriginal: "मूल कच्चा अर्क",
    viewTranslated: "हिंदी में एआई अनुवाद",
    
    addReminder: "सक्रिय रिमाइंडर जोड़ें",
    reminderSaved: "रिमाइंडर सफलतापूर्वक सेट किया गया!",
    reminderDeleted: "रिमाइंडर रद्द किया गया",
    noReminders: "कोई सक्रिय रिमाइंडर नहीं है। डैशबोर्ड के जरिए या ऊपर मैन्युअल रूप से जोड़ें।",
    medicationTimeline: "दैनिक दवा समय सारिणी",
    morningReminders: "सुबह की दवाएं (08:00 AM)",
    afternoonReminders: "दोपहर की दवाएं (01:00 PM)",
    eveningReminders: "शाम की दवाएं (06:00 PM)",
    nightReminders: "सोने से पहले (09:00 PM)",
    alertBannerText: "दवा अलर्ट: पेरासिटामोल 500mg लेने का समय हो गया है। भोजन के बाद लें।",
    simulatedNotification: "पुश अधिसूचना सिमुलेशन स्थापित",
    
    frontend: "रिएक्ट, टेलविंड सीएसएस, फ्रेमर मोशन यूआई",
    aiEngine: "Gemini AI-आधारित OCR एवं NLP विश्लेषण संरचना",
    database: "सुरक्षित इन-मेमोरी डेटाबेस मॉड्यूल",
    storage: "गोपनीय बेस64 स्टोरेज प्रणाली",
    researchMethodology: "सटीक नैदानिक ​​​​पार्सिंग और एआई विज़न",
    performanceMetrics: "पर्चे की पहचान की शुद्धता: 96.8% | समय < 1.8 सेकंड",
    futureRoadmap: "एसएमएस अलर्ट, ड्रग इंटरेक्शन चेकर",
    howItWorks: "कार्य प्रक्रिया",
    safetyTips: "दवा एवं डेटा सुरक्षा दिशानिर्देश",
    
    notifications: "अधिसूचना प्राथमिकताएं",
    profileName: "मरीज़ उपयोगकर्ता का नाम",
    profileEmail: "गोपनीय रोगी ईमेल",
    darkTheme: "लो-लाइट नाइट मोड",
    encryptionStatus: "डेटा एन्क्रिप्शन सुरक्षा प्रणाली",
    encryptedMode: "पर्चे के रिकॉर्ड पूरी तरह से एन्क्रिप्टेड हैं (AES-256)",
    dataSecurityNotice: "आपकी सभी जानकारी और मेडिकल इतिहास HIPAA नियमों के तहत सुरक्षित रखे गए हैं।",
    
    close: "बंद करें",
    deleteBtn: "डेटा हटाएं",
    editBtn: "सेटिंग्स बदलें"
  }
};
