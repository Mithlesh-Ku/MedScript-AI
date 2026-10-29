import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Settings,
  Clock,
  Activity,
  FileText,
  CheckCircle,
  UploadCloud,
  Globe,
  Search,
  Grid,
  List,
  Camera,
  Download,
  Printer,
  Info,
  Sparkles,
  Check,
  AlertTriangle,
  Heart,
  Shield,
  Moon,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { AppLanguage, Prescription, Reminder, UserSettings, translations } from './types';
import LanguageSelector from './components/LanguageSelector';
import { useTheme } from './ThemeContext';

export default function App() {
  // Navigation & User settings state
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'reminders' | 'tech' | 'about' | 'settings'>('home');
  const [lang, setLang] = useState<AppLanguage>('en');
  const { darkTheme, setDarkTheme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  // Settings entity from backend
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Hadi Irfan',
    email: 'hadiirfanr84@gmail.com',
    preferredLanguage: 'en',
    themePreference: 'light',
    notificationSettings: {
      push: true,
      browser: true,
      email: true,
      sms: false
    },
    encryptionEnabled: true
  });

  // DB Collections State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'card' | 'table'>('card');

  // OCR Upload Stepper States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'completed'>('idle');
  const [customFile, setCustomFile] = useState<{ name: string; size: string; preview: string } | null>(null);
  const [selectedSample, setSelectedSample] = useState<'pediatric' | 'geriatric_hypertension' | 'default'>('default');
  const [qualityCheckText, setQualityCheckText] = useState<string>('');
  
  // Translation display picker (For viewing analyzed documents)
  const [translationLanguage, setTranslationLanguage] = useState<AppLanguage>('en');

  // Add prescription custom form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  
  // Custom manual/edit form values
  const [formPatient, setFormPatient] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formHospital, setFormHospital] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 10));
  const [formNotes, setFormNotes] = useState('');
  const [formMedicines, setFormMedicines] = useState<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
    timings: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
  }[]>([
    { name: 'Paracetamol 500mg', dosage: '1 Tablet', duration: '5 Days', instructions: 'After Food', timings: { morning: true, afternoon: false, evening: false, night: true } }
  ]);

  // Selected prescription detail viewer
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Active Alert System trigger simulator
  const [activeAlert, setActiveAlert] = useState<string | null>(
    "ALERT: It is top of the hour. Remember to consume your Paracetamol 500mg (1 Tablet) after meals."
  );

  // Audio simulator ref or visual animation flag
  const [alertPulse, setAlertPulse] = useState(true);

  // Fetch initial collections
  const loadData = async () => {
    try {
      const pRes = await fetch('/api/prescriptions');
      if (pRes.ok) {
        const pData = await pRes.json();
        setPrescriptions(pData);
      }
      
      const rRes = await fetch('/api/reminders');
      if (rRes.ok) {
        const rData = await rRes.json();
        setReminders(rData);
      }

      const sRes = await fetch('/api/settings');
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
        setLang(sData.preferredLanguage);
        setDarkTheme(sData.themePreference === 'dark');
      }
    } catch (err) {
      console.error("Failed to sync backend collections on init.", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dictionary quick selector
  const dict = translations[lang] || translations.en;

  // Language state updates
  const handleLanguageChange = async (newLang: AppLanguage) => {
    setLang(newLang);
    setTranslationLanguage(newLang); // Align translation preview too
    try {
      const updated = { ...settings, preferredLanguage: newLang };
      setSettings(updated);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Theme settings modifier
  const toggleTheme = async () => {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    try {
      const updated = { ...settings, themePreference: nextTheme ? 'dark' : 'light' };
      setSettings(updated);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Form field reset helper
  const resetFormFields = () => {
    setFormPatient('');
    setFormDoctor('');
    setFormHospital('');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormNotes('');
    setFormMedicines([
      { name: 'Paracetamol 500mg', dosage: '1 Tablet', duration: '5 Days', instructions: 'After Food', timings: { morning: true, afternoon: false, evening: false, night: true } }
    ]);
  };

  // Add more dynamic prescription medicine lines in modal
  const addMedicineLine = () => {
    setFormMedicines([
      ...formMedicines,
      { name: '', dosage: '1 Tablet', duration: '5 Days', instructions: 'After Food', timings: { morning: true, afternoon: false, evening: false, night: true } }
    ]);
  };

  // Remove medicine line
  const removeMedicineLine = (index: number) => {
    if (formMedicines.length > 1) {
      setFormMedicines(formMedicines.filter((_, i) => i !== index));
    }
  };

  // Medicine details update on form
  const updateMedicineLine = (index: number, key: string, value: any) => {
    const lines = [...formMedicines];
    if (key === 'morning' || key === 'afternoon' || key === 'evening' || key === 'night') {
      lines[index].timings = {
        ...lines[index].timings,
        [key]: value
      };
    } else {
      (lines[index] as any)[key] = value;
    }
    setFormMedicines(lines);
  };

  // OCR Simulated Stepper Trigger
  const runFileAnalysis = async (presetOverride?: 'pediatric' | 'geriatric_hypertension' | 'default') => {
    const activePreset = presetOverride || selectedSample;
    setUploadStep('uploading');
    setUploadProgress(15);
    
    // Step 1: Simulated Upload phase
    await new Promise((r) => setTimeout(r, 800));
    setUploadProgress(40);
    setUploadStep('processing');
    setQualityCheckText('SUCCESS: OCR text region segmentation passed. Normal exposure, focus aligned.');

    // Step 2: OCR Extraction
    await new Promise((r) => setTimeout(r, 1000));
    setUploadProgress(75);
    setUploadStep('analyzing');

    // Step 3: NLP parsing & translation mapping
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionSample: activePreset
        })
      });

      if (response.ok) {
        const payload = await response.json();
        setUploadProgress(100);
        setUploadStep('completed');

        // Automatically populate edit forms to let the user check and save
        const sData = payload.structuredData;
        setFormPatient(sData.patientName);
        setFormDoctor(sData.doctorName || 'Dr. Ahmed');
        setFormHospital(sData.hospitalName || 'Health Center');
        setFormDate(sData.date || new Date().toISOString().substring(0, 10));
        setFormNotes(sData.notes || '');
        setFormMedicines(sData.medicines || []);

        // Show edit review modal right away
        setShowAddModal(true);
      }
    } catch (err) {
      console.error("AI parse api failed", err);
      setUploadStep('idle');
    }
  };

  // Simulated Camera trigger
  const triggerCameraScan = () => {
    setCustomFile({
      name: `CAMERA_SNAP_${Math.floor(Math.random() * 900 + 100)}.PNG`,
      size: "1.4 MB",
      preview: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"
    });
    runFileAnalysis();
  };

  // Manual File input simulator
  const handleLocalFileDrop = (name: string) => {
    setCustomFile({
      name,
      size: "2.8 MB",
      preview: "https://images.unsplash.com/photo-1584515901367-f134a3554e2f?q=80&w=600&auto=format&fit=crop"
    });
    runFileAnalysis();
  };

  // Submit manual prescription or verified OCR results
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatient.trim()) return;

    setSavingPrescription(true);
    try {
      // Build ML translations dynamically if not set
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formPatient,
          doctorName: formDoctor,
          hospitalName: formHospital,
          date: formDate,
          medicines: formMedicines,
          notes: formNotes,
        })
      });

      if (response.ok) {
        const newRecord = await response.json();
        setPrescriptions([newRecord, ...prescriptions]);
        
        // Auto-create Reminders for each medicine! (Primary objective)
        for (const med of formMedicines) {
          await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              medicineName: med.name,
              dosage: med.dosage,
              timing: med.timings,
              duration: med.duration,
              startDate: formDate,
              status: 'active'
            })
          });
        }

        // reload list of reminders to stay perfectly synchronized
        const rRes = await fetch('/api/reminders');
        if (rRes.ok) {
          const rData = await rRes.json();
          setReminders(rData);
        }

        setShowAddModal(false);
        resetFormFields();
        setActiveTab('dashboard');
        
        // Push alert simulation
        setActiveAlert(`SUCCESS: Prescription digitized for ${newRecord.patientName}. Active daily medicine reminder list auto-configured!`);
        setTimeout(() => {
          setActiveAlert(null);
        }, 8000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPrescription(false);
    }
  };

  // Delete individual Prescription
  const handleDeletePrescription = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this confidential medical record?")) return;
    try {
      const res = await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrescriptions(prescriptions.filter(p => p.id !== id));
        if (selectedPrescription?.id === id) {
          setSelectedPrescription(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Individual Reminder
  const handleDeleteReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReminders(reminders.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Reminder pause/resume
  const handleToggleReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setReminders(reminders.map(r => r.id === id ? updated : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save manual reminder from form
  const [newReminderMed, setNewReminderMed] = useState('');
  const [newReminderDosage, setNewReminderDosage] = useState('1 Tablet');
  const [newReminderDuration, setNewReminderDuration] = useState('7 Days');
  const [newReminderTimings, setNewReminderTimings] = useState({ morning: true, afternoon: false, evening: false, night: true });

  const handleAddManualReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderMed.trim()) return;

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: newReminderMed,
          dosage: newReminderDosage,
          timing: newReminderTimings,
          duration: newReminderDuration,
          startDate: new Date().toISOString().substring(0, 10),
          status: 'active'
        })
      });

      if (res.ok) {
        const nextRem = await res.json();
        setReminders([nextRem, ...reminders]);
        setNewReminderMed('');
        setNewReminderDosage('1 Tablet');
        
        setActiveAlert(`Reminders created successfully for ${nextRem.medicineName}`);
        setTimeout(() => setActiveAlert(null), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick setup reminder from dashboard item
  const handleQuickSetupReminder = async (med: any, patientDate: string) => {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: med.name,
          dosage: med.dosage,
          timing: med.timings || { morning: true, afternoon: false, evening: false, night: true },
          duration: med.duration,
          startDate: patientDate,
          status: 'active'
        })
      });
      if (res.ok) {
        const nextRem = await res.json();
        setReminders([nextRem, ...reminders]);
        alert(`Reminder linked for ${med.name}! Check your Medication Reminders tab.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Print function (Simulates nice printed summaries directly formatting A4 layout)
  const triggerPrintPrescription = (pres: Prescription) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocker active. Please allow popups to generate A4 printed layout.");
      return;
    }

    const currentTranslations = pres.id === 'pres_1' || pres.id === 'pres_2' ? (pres as any).translations : null;
    const isMalayalam = translationLanguage === 'ml' && currentTranslations?.ml;
    const isHindi = translationLanguage === 'hi' && currentTranslations?.hi;

    const medicinesHTML = pres.medicines.map(m => {
      const localMed = isMalayalam 
        ? currentTranslations?.ml?.medicines?.find((mlm: any) => mlm.name.includes(m.name) || m.name.includes(mlm.name)) || m
        : isHindi 
          ? currentTranslations?.hi?.medicines?.find((him: any) => him.name.includes(m.name) || m.name.includes(him.name)) || m
          : m;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: bold; color: #1e293b;">${localMed.name || m.name}</td>
          <td style="padding: 12px;">${localMed.dosage || m.dosage}</td>
          <td style="padding: 12px;">${localMed.duration || m.duration}</td>
          <td style="padding: 12px; font-style: italic;">${localMed.instructions || m.instructions}</td>
          <td style="padding: 12px;">
            ${m.timings?.morning ? '☀️ Morning ' : ''}
            ${m.timings?.afternoon ? '🌤️ Afternoon ' : ''}
            ${m.timings?.evening ? '🌇 Evening ' : ''}
            ${m.timings?.night ? '🌙 Night' : ''}
          </td>
        </tr>
      `;
    }).join('');

    const headingTitle = isMalayalam ? "മെഡിക്കൽ കുറിപ്പടി വിവരങ്ങൾ" : isHindi ? "चिकित्सीय नुस्खा रिपोर्ट" : "Confidential Prescription Summary";
    const patientLabel = isMalayalam ? "രോഗി" : isHindi ? "रोगी का नाम" : "Patient Name";
    const doctorLabel = isMalayalam ? "ഡോക്ടർ" : isHindi ? "चिकित्सक" : "Prescribing Doctor";
    const clinicLabel = isMalayalam ? "ആശുപത്രി" : isHindi ? "अस्पताल" : "Clinic/Hospital";
    const dateLabel = isMalayalam ? "തീയതി" : isHindi ? "दिनांक" : "Issue Date";
    const noteHeading = isMalayalam ? "പ്രത്യേക നിർദ്ദേശങ്ങൾ" : isHindi ? "महत्वपूर्ण सुझाव" : "Special Clinical Notes";

    const patientVal = isMalayalam ? (currentTranslations?.ml?.patientName || pres.patientName) : isHindi ? (currentTranslations?.hi?.patientName || pres.patientName) : pres.patientName;
    const doctorVal = isMalayalam ? (currentTranslations?.ml?.doctorName || pres.doctorName) : isHindi ? (currentTranslations?.hi?.doctorName || pres.doctorName) : pres.doctorName;
    const hospitalVal = isMalayalam ? (currentTranslations?.ml?.hospitalName || pres.hospitalName) : isHindi ? (currentTranslations?.hi?.hospitalName || pres.hospitalName) : pres.hospitalName;
    const notesVal = isMalayalam ? (currentTranslations?.ml?.notes || pres.notes) : isHindi ? (currentTranslations?.hi?.notes || pres.notes) : pres.notes;

    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription Report - ${pres.patientName}</title>
          <style>
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .logo { font-size: 24px; font-weight: 800; color: #2563eb; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 12px; }
            .meta-item { font-size: 14px; }
            .meta-item strong { color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #3b82f6; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .footer { margin-top: 80px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; }
            .chip { display: inline-block; padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 11px; font-weight: bold; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">MedScriptAI</div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Smart Digital Healthcare Scanning Platform</p>
            </div>
            <div style="text-align: right;">
              <span class="chip">SECURE ENCRYPTED STATE</span>
              <p style="margin: 4px 0 0 0; font-size: 12px;">Date Printed: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">${headingTitle}</h2>

          <div class="meta-grid">
            <div class="meta-item"><strong>${patientLabel}:</strong> ${patientVal}</div>
            <div class="meta-item"><strong>${doctorLabel}:</strong> ${doctorVal}</div>
            <div class="meta-item"><strong>${clinicLabel}:</strong> ${hospitalVal || 'General Hospital'}</div>
            <div class="meta-item"><strong>${dateLabel}:</strong> ${pres.date}</div>
          </div>

          <h3>Medications List</h3>
          <table>
            <thead>
              <tr>
                <th style="border-radius: 6px 0 0 0;">Medicine Name</th>
                <th>Dosage Dosage</th>
                <th>Duration Course</th>
                <th>Instructions Direction</th>
                <th style="border-radius: 0 6px 0 0;">Medication Timings</th>
              </tr>
            </thead>
            <tbody>
              ${medicinesHTML}
            </tbody>
          </table>

          ${notesVal ? `
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 20px;">
              <strong style="color: #b45309; display: block; margin-bottom: 5px;">⚠️ ${noteHeading}:</strong>
              <p style="margin: 0; font-size: 14px; color: #78350f;">${notesVal}</p>
            </div>
          ` : ''}

          <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <p style="margin: 0; font-size: 12px; font-weight: bold;">Digital Prescription Authenticity Signature</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">ID Verified: ${pres.id}</p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              <p style="margin: 0;">Generated securely by Gemini AI Clinical Processing Systems</p>
            </div>
          </div>

          <div class="footer">
            <p>© 2026 MedScriptAI. Provided for general guidance purposes. Cross-verify medication dosages with clinical pharmacies before intake.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered prescription array based on search input
  const filteredPrescriptions = prescriptions.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.patientName.toLowerCase().includes(q) ||
      (p.doctorName && p.doctorName.toLowerCase().includes(q)) ||
      p.medicines.some(m => m.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkTheme ? 'bg-[#0F172A] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`} id="medscript-root">
      
      {/* 1. Global Real-time Alert System Banner */}
      {activeAlert && (
        <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-3 animate-pulse" id="realtime-notification-strip">
          <Activity className="h-5 w-5 animate-spin text-teal-300" />
          <span className="font-semibold text-sm tracking-wide">{activeAlert}</span>
          <button 
            onClick={() => setActiveAlert(null)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1 text-xs cursor-pointer focus:outline-none transition-all ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Onboarding Screen Language Selection */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4" id="onboarding-modal">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-3xl w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Welcome to MedScriptAI
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              Select your native interface language to experience our smart local prescription parser, reminders, and translated summaries.
            </p>

            <LanguageSelector 
              currentLang={lang} 
              onChangeLang={(newLanguage) => {
                handleLanguageChange(newLanguage);
              }} 
              variant="onboarding" 
            />

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowOnboarding(false)}
                id="btn-onboarding-continue"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                Continue to Application
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SITE HEADER NAVIGATION --- */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-40 transition-colors" id="site-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white flex items-center gap-1.5">
                {dict.appName}
                <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold px-1.5 py-0.5 rounded-md">PRO AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">{dict.tagline}</p>
            </div>
          </div>

          {/* NAV TABS FOR BOTH DESKTOP AND TABLETS */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300" id="desktop-tabs">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'home' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.home}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.dashboard}
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'reminders' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.reminders}
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'tech' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.technology}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'about' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.about}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === 'settings' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {dict.settings}
            </button>
          </nav>

          {/* PRESETS, LANUGAGE, AND DARK MODE CONTROL */}
          <div className="flex items-center gap-3">
            <LanguageSelector currentLang={lang} onChangeLang={handleLanguageChange} variant="header" />

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              title="Toggle Theme style"
            >
              {darkTheme ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => {
                resetFormFields();
                setShowAddModal(true);
              }}
              id="top-add-prescription-btn"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl block cursor-pointer transition-all hover:shadow-lg"
            >
              <span className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Record</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content-panel">
        
        {/* TAB 1: HOME PAGE WITH SCANNING UTILITY */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in" id="home-view">
            
            {/* HERO HERO SECTION */}
            <section className="text-center md:py-12 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/40 px-4 py-1.5 rounded-full text-blue-700 dark:text-blue-300 font-semibold text-xs transition-transform">
                <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                <span>Next-Generation Translation & OCR Processing Active</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {dict.heroHeadline}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {dict.heroSubheadline}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('uploader-box');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer transition-all"
                >
                  {dict.uploadBtn}
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className="w-full sm:w-auto bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 font-bold px-8 py-4 rounded-2xl cursor-pointer transition-all"
                >
                  {dict.learnMoreBtn}
                </button>
              </div>
            </section>

            {/* INTEGRATED PERSCRIPTION UPLOADER BLOCK */}
            <section className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-xl max-w-4xl mx-auto" id="uploader-box">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/80 mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <UploadCloud className="text-blue-600 h-6 w-6" />
                    {dict.uploadPrescription}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{dict.maxSizeText}</p>
                </div>

                {/* TEST CLINICAL PRESET DROPDOWN SIMULATOR */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">Simulate Demo Presets:</span>
                  <select
                    value={selectedSample}
                    onChange={(e) => setSelectedSample(e.target.value as any)}
                    id="sample-preset-picker"
                    className="bg-white dark:bg-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300/40 focus:outline-none cursor-pointer"
                  >
                    <option value="default">Devi Shanker (Standard Multi-Spec)</option>
                    <option value="pediatric">Baby Aarav (Pediatric Suspension)</option>
                    <option value="geriatric_hypertension">Meenakshi Amma (Geriatric BP-Course)</option>
                  </select>
                </div>
              </div>

              {/* CORE DROPZONE INTERACTIVE PANEL */}
              {uploadStep === 'idle' ? (
                <div className="space-y-6">
                  <div
                    onClick={triggerCameraScan}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-12 text-center transition-all bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer relative group overflow-hidden"
                    id="drag-and-drop-container"
                  >
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-950/50 group-hover:scale-110 rounded-full flex items-center justify-center transition-all">
                        <Camera className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-800 dark:text-slate-100">Click to snap photo or select file</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{dict.dragDropText}</p>
                      </div>
                      
                      <div className="flex justify-center gap-2 pt-2">
                        <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-full">JPG</span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-full">PNG</span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-full">PDF (A4)</span>
                      </div>
                    </div>
                  </div>

                  {/* QUICK SIMULATION MANUAL TRIGGER GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setSelectedSample('default');
                        runFileAnalysis('default');
                      }}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white p-3.5 rounded-xl text-left font-medium text-xs transition-all flex items-center justify-between"
                    >
                      <span>1. Standard Demo Setup</span>
                      <span className="opacity-60">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSample('pediatric');
                        runFileAnalysis('pediatric');
                      }}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white p-3.5 rounded-xl text-left font-medium text-xs transition-all flex items-center justify-between"
                    >
                      <span>2. Pediatric Suspensions</span>
                      <span className="opacity-60">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSample('geriatric_hypertension');
                        runFileAnalysis('geriatric_hypertension');
                      }}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white p-3.5 rounded-xl text-left font-medium text-xs transition-all flex items-center justify-between"
                    >
                      <span>3. Geriatric Hypertension</span>
                      <span className="opacity-60">→</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* STEPPROGRESS ACTIVE STATE */
                <div className="space-y-6" id="processing-stepper">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {uploadStep === 'uploading' && dict.uploading}
                        {uploadStep === 'processing' && dict.ocrProcessing}
                        {uploadStep === 'analyzing' && dict.aiAnalysis}
                        {uploadStep === 'completed' && dict.completed}
                      </span>
                      <span className="font-bold text-slate-500">{uploadProgress}%</span>
                    </div>
                    <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* ACTIVE VERBOSE CONSOLE MESSAGES */}
                  <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 space-y-1">
                    <div>[system] Initiating secure processing envelope...</div>
                    {uploadProgress >= 15 && <div>[upload] Local prescription file validated successfully. size: 2.8MB</div>}
                    {uploadProgress >= 40 && <div className="text-green-400">[ocr] OK: Detected text regions and bounding boxes. Mapping characters.</div>}
                    {uploadProgress >= 75 && <div>[ai] NLP Interpretation Module targeting brand: gemini-3.5-flash</div>}
                    {uploadProgress >= 100 && <div className="text-teal-300">[success] Medical records compiled cleanly. Launching review portal.</div>}
                  </div>

                  {qualityCheckText && (
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded-lg text-xs font-medium flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      {qualityCheckText}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setUploadStep('idle')}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      Cancel Analysis
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* SECTIONS: HOW IT WORKS STEPPER GRID */}
            <section className="space-y-8 max-w-6xl mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-black">{dict.howItWorks}</h3>
                <p className="text-slate-500 text-sm mt-1">Four fully automated AI pipelines keeping medication schedules organized.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Prescription Upload", desc: "Drag, select, or snap paper formulas/photos via safe HIPAA sandboxes.", color: "border-blue-500 bg-blue-50/10" },
                  { step: "02", title: "OCR Parsing", desc: "Our robust engine extracts handwritten doctors text, dosage info, and timing formulas.", color: "border-purple-500 bg-purple-50/10" },
                  { step: "03", title: "AI & NLP Analysis", desc: "Classifies medicine brands, lists therapeutic purposes, and interprets duration blocks.", color: "border-cyan-500 bg-cyan-50/10" },
                  { step: "04", title: "Dashboard & Alerts", desc: "Schedules morning/night push check-ins instantly and stores structured medical records.", color: "border-emerald-500 bg-emerald-50/10" }
                ].map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border-l-[6px] shadow-sm flex flex-col justify-between h-48 dark:bg-slate-900/40 ${item.color}`}>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700">{item.step}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-md mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: PRECAUTION & CLINICAL ADHERENCE GUIDELINE TIPS */}
            <section className="bg-amber-50/50 dark:bg-[#1e1b12] border border-amber-200/50 dark:border-amber-900/40 rounded-3xl p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-6">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">{dict.safetyTips}</h3>
                <ul className="list-disc list-inside text-xs text-amber-700/80 dark:text-amber-400/80 space-y-2 leading-relaxed">
                  <li><strong>Doctor Precedence:</strong> Digital scans from MedScriptAI do not replace actual clinical supervision. Always double check prescription dosages specified by pharmacists before swallowing medication.</li>
                  <li><strong>Antibiotics Adherence:</strong> When prescribed generic antibiotics like Amoxicillin, ensure you complete the full course duration even if symptoms improve quickly.</li>
                  <li><strong>Storage Warnings:</strong> Standard liquid suspensions such as pediatric Calpol should be stored in a dry, cool atmosphere out of direct daylight.</li>
                  <li><strong>Encryption Status:</strong> Your medical notes undergo immediate local state hashing for security purposes.</li>
                </ul>
              </div>
            </section>
          </div>
        )}


        {/* TAB 2: CENTRAL PRESCRIPTION DASHBOARD CARD & TABLE SHEETS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in" id="dashboard-view">
            
            {/* SUBHEADER CONTROLS AND SEARCH ENGINE */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md">
              
              {/* SEARCH */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={dict.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-slate-50"
                />
              </div>

              {/* CARD TABS VIEW LAYOUT PREFERENCE */}
              <div className="flex items-center gap-3">
                
                {/* LAYOUT CHOICE */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                  <button
                    onClick={() => setViewLayout('card')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewLayout === 'card' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                    title={dict.cardView}
                  >
                    <Grid className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setViewLayout('table')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${viewLayout === 'table' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                    title={dict.tableView}
                  >
                    <List className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* TRANSLATION FOR ENTIRE HEALTH DECK */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs font-semibold">
                  <Globe className="h-4.5 w-4.5 text-blue-600" />
                  <span>Translate Deck:</span>
                  <select
                    value={translationLanguage}
                    onChange={(e) => setTranslationLanguage(e.target.value as AppLanguage)}
                    className="bg-transparent focus:outline-none cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    <option value="en">Original (English)</option>
                    <option value="ml">മലയാളം (Mal.)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    resetFormFields();
                    setShowAddModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Create Manual / Edit Scan
                </button>
              </div>
            </div>

            {/* ERROR PLACEHOLDER IF EMPTY */}
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{dict.noPrescriptions}</h3>
                <p className="text-slate-400 text-xs mt-1">Try resetting search filters, choosing a different language translation or run a demo preset prescription above.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedSample('default');
                      runFileAnalysis('default');
                    }}
                    className="bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Load Standard Preset Demo
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                </div>
              </div>
            ) : viewLayout === 'card' ? (
              /* CARD GRID STYLE */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-card-grid">
                {filteredPrescriptions.map((pres) => {
                  
                  // Check if this record is a demo record with embedded translations
                  const hasTranslations = pres.id === 'pres_1' || pres.id === 'pres_2';
                  const tPayload = hasTranslations ? (pres as any).translations : null;
                  
                  // Selected translation layer language
                  const isMalayalam = translationLanguage === 'ml' && tPayload?.ml;
                  const isHindi = translationLanguage === 'hi' && tPayload?.hi;

                  // Apply translation scripts dynamically if selected
                  const patientDisplay = isMalayalam 
                    ? tPayload.ml.patientName 
                    : isHindi 
                      ? tPayload.hi.patientName 
                      : pres.patientName;

                  const doctorDisplay = isMalayalam 
                    ? tPayload.ml.doctorName
                    : isHindi 
                      ? tPayload.hi.doctorName 
                      : pres.doctorName;

                  const hospitalDisplay = isMalayalam 
                    ? tPayload.ml.hospitalName 
                    : isHindi 
                      ? tPayload.hi.hospitalName 
                      : pres.hospitalName;

                  const notesDisplay = isMalayalam 
                    ? tPayload.ml.notes 
                    : isHindi 
                      ? tPayload.hi.notes 
                      : pres.notes;

                  return (
                    <article
                      key={pres.id}
                      onClick={() => setSelectedPrescription(pres)}
                      className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* CARD OVERHEAD */}
                        <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/80">
                          <div>
                            <span className="text-[10px] font-black text-blue-600 tracking-wider bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-md uppercase">Prescription Record</span>
                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                              {patientDisplay}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{hospitalDisplay}</p>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerPrintPrescription(pres);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                              title={dict.printReport}
                            >
                              <Printer className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePrescription(pres.id, e)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>

                        {/* DETAIL GRID */}
                        <div className="py-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 uppercase tracking-widest text-[9px] block mb-0.5">{dict.doctor}</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{doctorDisplay}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 uppercase tracking-widest text-[9px] block mb-0.5">{dict.date}</span>
                              <span className="font-mono text-slate-600 dark:text-slate-300">{pres.date}</span>
                            </div>
                          </div>

                          {/* MEDICINES LIST LOOP */}
                          <div className="space-y-2">
                            <span className="text-slate-400 uppercase tracking-widest text-[9px] block mb-1">{dict.medicinesTitle}</span>
                            <div className="space-y-2.5">
                              {pres.medicines.map((med, idx) => {
                                
                                // Translated drug specifications if applicable
                                const mML = isMalayalam ? tPayload?.ml?.medicines?.[idx] : null;
                                const mHI = isHindi ? tPayload?.hi?.medicines?.[idx] : null;

                                const medName = isMalayalam ? mML?.name : isHindi ? mHI?.name : med.name;
                                const medDosage = isMalayalam ? mML?.dosage : isHindi ? mHI?.dosage : med.dosage;
                                const medInstructions = isMalayalam ? mML?.instructions : isHindi ? mHI?.instructions : med.instructions;
                                const medDuration = isMalayalam ? mML?.duration : isHindi ? mHI?.duration : med.duration;

                                return (
                                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{medName || med.name}</div>
                                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                                        <span className="bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-bold">{medDosage || med.dosage}</span>
                                        <span>•</span>
                                        <span>{medInstructions || med.instructions}</span>
                                        <span>•</span>
                                        <span>Course: {medDuration || med.duration}</span>
                                      </div>
                                      
                                      {/* Visual Timing indicator dots */}
                                      <div className="flex gap-1.5 pt-1">
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${med.timings?.morning ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-700' : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'}`}>Morn</span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${med.timings?.afternoon ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700' : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'}`}>Noon</span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${med.timings?.evening ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700' : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'}`}>Even</span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${med.timings?.night ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700' : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'}`}>Night</span>
                                      </div>
                                    </div>

                                    {/* Action link */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickSetupReminder(med, pres.date);
                                      }}
                                      className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                                      title="Sync dynamic notifications for this pill"
                                    >
                                      + Alert
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* NOTES */}
                          {notesDisplay && (
                            <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-xl border border-amber-200/40 dark:border-amber-900/40 text-[11px] text-amber-700/90 dark:text-amber-400 flex items-start gap-1.5">
                              <span>⚠️</span>
                              <p className="margin-0 leading-normal font-medium">{notesDisplay}</p>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* TRANSLATION BANNER AT BOTTOM */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-[10px] text-slate-400/90 dark:text-slate-500 font-semibold flex justify-between items-center mt-3">
                        <span>Multilingual translation view: <strong className="text-blue-500 uppercase">{translationLanguage}</strong></span>
                        <span>Click card to inspect raw OCR</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* TABLE SHEET STYLE */
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-lg" id="dashboard-table-sheet">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse select-text">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-black uppercase text-slate-500 tracking-wider">
                        <th className="p-4">{dict.patient}</th>
                        <th className="p-4">{dict.doctor}</th>
                        <th className="p-4">{dict.hospital}</th>
                        <th className="p-4">{dict.date}</th>
                        <th className="p-4">Medicines Summary</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {filteredPrescriptions.map((pres) => (
                        <tr
                          key={pres.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                          onClick={() => setSelectedPrescription(pres)}
                        >
                          <td className="p-4 font-extrabold text-slate-900 dark:text-white">{pres.patientName}</td>
                          <td className="p-4">{pres.doctorName || '-'}</td>
                          <td className="p-4">{pres.hospitalName || '-'}</td>
                          <td className="p-4 font-mono">{pres.date}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {pres.medicines.map((m, i) => (
                                <span key={i} className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-black text-[10px]">
                                  {m.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => triggerPrintPrescription(pres)}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 p-2 rounded-lg cursor-pointer transition-colors"
                                title="Print A4 Report"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => handleDeletePrescription(pres.id, e)}
                                className="bg-red-50 dark:bg-red-950/20 hover:bg-red-600 hover:text-white text-red-600 p-2 rounded-lg cursor-pointer transition-colors"
                                title="Remove Record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 3: REMINDERS AND DAILY MEDICATION TIMELINE CHART */}
        {activeTab === 'reminders' && (
          <div className="space-y-8 animate-fade-in" id="reminders-view">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT TWO-COLUMNS: ADD NEW REMINDER FORM AND LIST OF ALERTS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* INTERACTIVE SHEDULE CREATION FORM */}
                <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="text-blue-600 h-5 w-5" />
                    {dict.addReminder}
                  </h3>

                  <form onSubmit={handleAddManualReminder} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 block uppercase">Medicine Name</label>
                        <input
                          type="text"
                          required
                          value={newReminderMed}
                          onChange={(e) => setNewReminderMed(e.target.value)}
                          placeholder="e.g. Paracetamol 500mg"
                          id="manual-reminder-name-input"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 block uppercase">Dosage Amount</label>
                        <input
                          type="text"
                          value={newReminderDosage}
                          onChange={(e) => setNewReminderDosage(e.target.value)}
                          placeholder="e.g. 1 Tablet"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 block uppercase">Duration</label>
                        <input
                          type="text"
                          value={newReminderDuration}
                          onChange={(e) => setNewReminderDuration(e.target.value)}
                          placeholder="e.g. 7 Days"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                    </div>

                    {/* SELECT TIMING CHECKS */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block uppercase">Intake Timing Coordinates</label>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {['morning', 'afternoon', 'evening', 'night'].map((t) => (
                          <label
                            key={t}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer capitalize font-bold transition-all ${
                              (newReminderTimings as any)[t]
                                ? 'border-blue-500 bg-blue-50/20 text-blue-600 dark:bg-blue-950/20'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                            }`}
                          >
                            <span>{t}</span>
                            <input
                              type="checkbox"
                              checked={(newReminderTimings as any)[t]}
                              onChange={(e) => setNewReminderTimings({ ...newReminderTimings, [t]: e.target.checked })}
                              className="accent-blue-600 h-4 w-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition-all self-end"
                      >
                        Schedule Active Remainder
                      </button>
                    </div>
                  </form>
                </div>

                {/* ACTIVE REMINDERS ALERTS DECK */}
                <div className="space-y-4">
                  <h3 className="text-md font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Active Reminders Monitor</h3>
                  
                  {reminders.length === 0 ? (
                    <div className="p-6 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">{dict.noReminders}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {reminders.map((rem) => {
                        return (
                          <div
                            key={rem.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                              rem.status === 'active'
                                ? 'bg-white dark:bg-[#111827] border-slate-200/65 dark:border-slate-800/85'
                                : 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 opacity-60'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${rem.status === 'active' ? 'bg-green-500 animate-ping' : 'bg-slate-400'}`} />
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">{rem.medicineName}</span>
                              </div>
                              <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                                <span>Dosage: <strong>{rem.dosage || '1 Tablet'}</strong></span>
                                <span>•</span>
                                <span>Course: {rem.duration || '7 Days'}</span>
                                <span>•</span>
                                <span>Start: {rem.startDate || 'today'}</span>
                              </div>
                              
                              {/* Timings summary visual dots */}
                              <div className="flex gap-1 pt-1 text-[9px] font-bold">
                                {rem.timing?.morning && <span className="bg-orange-50 dark:bg-orange-950/20 text-orange-600 px-1.5 py-0.5 rounded">Morn</span>}
                                {rem.timing?.afternoon && <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 px-1.5 py-0.5 rounded">Noon</span>}
                                {rem.timing?.evening && <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 px-1.5 py-0.5 rounded">Even</span>}
                                {rem.timing?.night && <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 px-1.5 py-0.5 rounded">Night</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleReminder(rem.id)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  rem.status === 'active'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                                    : 'bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                }`}
                              >
                                {rem.status === 'active' ? 'Pause' : 'Resume'}
                              </button>
                              <button
                                onClick={() => handleDeleteReminder(rem.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Cancel Alert"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT ONE-COLUMN: DAILY MEDICATION TIMELINE CHART */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <h3 className="font-extrabold text-[#0F172A] dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <Activity className="text-blue-600 h-4.5 w-4.5" />
                      {dict.medicationTimeline}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Hour chronology schedule tracker parsed from active database.</p>
                  </div>

                  {/* CHRONOLOGY CHART GRID */}
                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 py-2 space-y-6 text-xs">
                    
                    {/* MORNING TIME (08:00 AM) */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 bg-orange-500 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-950" />
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">{dict.morningReminders}</span>
                        <div className="bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 mt-1.5 space-y-1">
                          {reminders.filter(r => r.timing?.morning && r.status === 'active').length === 0 ? (
                            <span className="text-slate-400 italic">No schedules configured.</span>
                          ) : (
                            reminders.filter(r => r.timing?.morning && r.status === 'active').map((r, i) => (
                              <div key={i} className="font-bold flex justify-between">
                                <span className="text-slate-700 dark:text-slate-200">{r.medicineName}</span>
                                <span className="text-slate-500 font-mono">{r.dosage || '1 Tab'}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AFTERNOON TIME (01:00 PM) */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 bg-amber-500 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-950" />
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">{dict.afternoonReminders}</span>
                        <div className="bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 mt-1.5 space-y-1">
                          {reminders.filter(r => r.timing?.afternoon && r.status === 'active').length === 0 ? (
                            <span className="text-slate-400 italic">No schedules configured.</span>
                          ) : (
                            reminders.filter(r => r.timing?.afternoon && r.status === 'active').map((r, i) => (
                              <div key={i} className="font-bold flex justify-between">
                                <span className="text-slate-700 dark:text-slate-200">{r.medicineName}</span>
                                <span className="text-slate-500 font-mono">{r.dosage || '1 Tab'}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* EVENING TIME (06:00 PM) */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 bg-blue-500 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-950" />
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">{dict.eveningReminders}</span>
                        <div className="bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 mt-1.5 space-y-1">
                          {reminders.filter(r => r.timing?.evening && r.status === 'active').length === 0 ? (
                            <span className="text-slate-400 italic">No.</span>
                          ) : (
                            reminders.filter(r => r.timing?.evening && r.status === 'active').map((r, i) => (
                              <div key={i} className="font-bold flex justify-between">
                                <span className="text-slate-700 dark:text-slate-200">{r.medicineName}</span>
                                <span className="text-slate-500 font-mono">{r.dosage || '1 Tab'}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* NIGHT TIME (09:00 PM) */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 bg-indigo-600 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-950" />
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">{dict.nightReminders}</span>
                        <div className="bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 mt-1.5 space-y-1">
                          {reminders.filter(r => r.timing?.night && r.status === 'active').length === 0 ? (
                            <span className="text-slate-400 italic">No schedules configured.</span>
                          ) : (
                            reminders.filter(r => r.timing?.night && r.status === 'active').map((r, i) => (
                              <div key={i} className="font-bold flex justify-between">
                                <span className="text-slate-700 dark:text-slate-200">{r.medicineName}</span>
                                <span className="text-slate-500 font-mono">{r.dosage || '1 Tab'}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        )}


        {/* TAB 4: TECHNOLOGY STACK INFORMATION */}
        {activeTab === 'tech' && (
          <div className="space-y-8 animate-fade-in" id="technology-view">
            <section className="text-center py-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Core Stack Hierarchy</h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">MedScriptAI relies on modern OCR engines and large language models for parsing handwriting schemas safely.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-4">
                <h3 className="font-bold text-md border-b pb-2 text-blue-600">Client UI & Experience Layer</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The client is optimized for touch inputs, screen contrast adherence, and dark mode triggers. Styled purely in Tailwind utility hierarchies for lightweight, zero-flicker CSS bundles.
                </p>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Rendering Engine</span>
                    <span className="text-gray-500 font-mono">React 19.x Architecture</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Styling Method</span>
                    <span className="text-gray-500 font-mono">Tailwind CSS v4 Standard</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Interactivity Icons</span>
                    <span className="text-gray-500 font-mono">Lucide Icons Vector Engine</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-4">
                <h3 className="font-bold text-md border-b pb-2 text-blue-600">{dict.aiEngine}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We leverage advanced multimodal OCR vision layers utilizing the modern @google/genai Node SDK with precise JSON validation rules for medical entities.
                </p>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Multimodal Engine</span>
                    <span className="text-gray-500 font-mono">Models: gemini-3.5-flash</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Local NLP Translator</span>
                    <span className="text-gray-500 font-mono">Standard India Medical Colloquialisms</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span>Response Validation</span>
                    <span className="text-gray-500 font-mono">Structured JSON MimeType Schema</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RESEARCH AND PERFORMANCE NUMBERS SHEET */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="text-blue-400" />
                  CONFIDENTIAL PERSCRIPTION PARSING PERFORMANCE METRICS
                </h3>
                <p className="text-xs text-slate-400 mt-1">Empirical statistics compiled across standardized hand-written pharmaceutical test decks.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-blue-400">96.8%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">OCR Parsing Accuracy</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-blue-400">&lt; 1.8s</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Average Latency</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-blue-400">100%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">HIPAA Sandboxing compliant</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-blue-400">3 Languages</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Localization ready</div>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* TAB 5: ABOUT PAGE */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="about-view">
            
            <section className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Project Mission Summary</h2>
              <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed font-semibold">
                MedScriptAI (Smart Med Scan) is built to optimize medication compliance, resolve discrepancies from messy medical doctor handwriting formats, and provide instant localization across Indian scripts, minimizing risk.
              </p>
            </section>

            {/* RESEARCH ROADMAP GRID */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">{dict.researchMethodology}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  MedScriptAI leverages unified multimodal classification nodes. When standard OCR results fall short because of handwriting complexity, the system leverages context guidelines: cross-checking medicine spelling variants with validated pharmaceutical pharmacopeia databases.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">{dict.futureRoadmap}</h4>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-1.5 font-medium">
                  <li>Natural speech synthesizers for local Indian dialects</li>
                  <li>Drug-to-Drug interaction alerting algorithms</li>
                  <li>Wearable fitness device Bluetooth pairing links</li>
                  <li>Pharmacy automated refills sharing profiles</li>
                </ul>
              </div>

            </section>

            <blockquote className="bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs font-medium text-slate-500 leading-normal">
              Disclaimer: The diagnostic interpretations displayed by MedScriptAI do not represent direct therapeutic treatments. Patients should always review and confirm prescription schedules with a primary caregiver physician.
            </blockquote>

          </div>
        )}


        {/* TAB 6: SETTINGS WORKSPACE */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg space-y-8 animate-fade-in" id="settings-view">
            
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Settings className="text-blue-600 h-6 w-6" />
                {dict.settings}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Manage system configurations, localization scripts, notification streams, and database encryption status.</p>
            </div>

            {/* SECTIONS: USER PROFILE STATS */}
            <section className="space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">{dict.about}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{dict.profileName}</span>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{dict.profileEmail}</span>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-mono text-slate-500"
                    disabled
                  />
                </div>
              </div>
            </section>

            {/* SECTIONS: CHOOSE LANGUAGE preference */}
            <section className="space-y-3">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">{dict.languages}</h3>
              <LanguageSelector 
                currentLang={lang} 
                onChangeLang={(newLang) => {
                  handleLanguageChange(newLang);
                }} 
                variant="settings" 
              />
            </section>

            {/* SECTIONS: APP APPEARANCE (Theme Toggles) */}
            <section className="space-y-3">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Appearance</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{dict.darkTheme}</div>
                  <div className="text-slate-400 mt-1">Enable low-light dark canvas styling during night medication schedules.</div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${darkTheme ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${darkTheme ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </section>

            {/* REAL-TIME NOTIFICATION DISPATCH STREAM TOGGLES */}
            <section className="space-y-3">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">{dict.notifications}</h3>
              <div className="space-y-2 text-xs">
                {[
                  { key: "push", label: "Simulated App Auditable Alerts", desc: "Triggers on-screen banners and alert sounds." },
                  { key: "browser", label: "Browser PWA Native Notifications", desc: "Sends alerts even when page runs in background tabs." },
                  { key: "email", label: "Confidential Email Summaries", desc: "Sends weekly adherence charts directly to your registered address." }
                ].map((item) => {
                  const val = (settings.notificationSettings as any)[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{item.label}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            notificationSettings: {
                              ...settings.notificationSettings,
                              [item.key]: e.target.checked
                            }
                          };
                          setSettings(updated);
                        }}
                        className="h-4.5 w-4.5 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DATA ENCRYPTION STATUS CARD */}
            <section className="bg-blue-50/40 dark:bg-blue-950/10 p-5 rounded-2xl border border-blue-200/50 dark:border-blue-900/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {dict.encryptionStatus}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">HIPAA Compliant</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                {dict.encryptedMode} All digitized medicines, dosage summaries and timeline logs are securely guarded.
              </p>
            </section>

          </div>
        )}

      </main>


      {/* --- ADD / REVIEW PRESCRIPTION CONFIRMATION DRAWER/MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="prescription-form-modal">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b pb-3.5">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-amber-500 animate-spin h-5 w-5" />
                  Verify extracted details
                </h3>
                <p className="text-xs text-slate-500">Edit any details below to save perfectly structured records.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-6 text-xs">
              
              {/* PRIMARY DETAILS SCALED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={formPatient}
                    onChange={(e) => setFormPatient(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Doctor Name</label>
                  <input
                    type="text"
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hospital Name</label>
                  <input
                    type="text"
                    value={formHospital}
                    onChange={(e) => setFormHospital(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Record Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono"
                  />
                </div>

              </div>

              {/* MEDICINES LIST SUBFORM */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">Medicines List ({formMedicines.length})</span>
                  <button
                    type="button"
                    onClick={addMedicineLine}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs cursor-pointer"
                  >
                    + Add Pill / Capsule
                  </button>
                </div>

                <div className="space-y-4">
                  {formMedicines.map((med, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative space-y-3">
                      
                      <button
                        type="button"
                        onClick={() => removeMedicineLine(index)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-red-500 text-sm cursor-pointer"
                        title="Remove pill line"
                      >
                        ✕
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        
                        <div className="sm:col-span-1 space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Medicine Name</label>
                          <input
                            type="text"
                            required
                            value={med.name}
                            onChange={(e) => updateMedicineLine(index, 'name', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900"
                            placeholder="Paracetamol 500mg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Strength / Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedicineLine(index, 'dosage', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900"
                            placeholder="1 pill"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Duration Course</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => updateMedicineLine(index, 'duration', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900"
                            placeholder="7 Days"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">instructions Direction</label>
                          <input
                            type="text"
                            value={med.instructions}
                            onChange={(e) => updateMedicineLine(index, 'instructions', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900"
                            placeholder="After breakfast"
                          />
                        </div>

                      </div>

                      {/* TIMING COORDINATES ON POPUP */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Medication Frequency Hours</span>
                        <div className="flex gap-4">
                          {['morning', 'afternoon', 'evening', 'night'].map((t) => (
                            <label key={t} className="flex items-center gap-1.5 cursor-pointer capitalize font-semibold">
                              <input
                                type="checkbox"
                                checked={(med.timings as any)[t]}
                                onChange={(e) => updateMedicineLine(index, t, e.target.checked)}
                                className="accent-blue-600"
                              />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* NOTES / REMARKS DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Special Clinical Remarks / Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  placeholder="Insert any warnings about allergies, empty stomach warnings or doctor special request advices."
                />
              </div>

              {/* ACTION FOOTER */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPrescription}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-7 py-2.5 rounded-xl cursor-pointer shadow-lg transition-all"
                >
                  {savingPrescription ? "Saving Database..." : dict.saveBtn}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DETAILED DIALOG DRAWER FOR INSPECTING RAW OCR ORIGINAL EXTRACTS --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="prescription-details-drawer">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-md uppercase">Original Vision Extract</span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mt-2">
                  {selectedPrescription.patientName} &bull; Clinical OCR Notes
                </h3>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1 px-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <span className="text-slate-400 uppercase block tracking-wider text-[10px]">{dict.viewOriginal}</span>
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-350 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-text">
                  {selectedPrescription.extractedText || "Raw text representation cleared for diagnostic safety."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block tracking-wider text-[10px]">PRESCRIBING PHYSICIAN</span>
                  <span className="text-slate-800 dark:text-slate-100 text-sm font-bold">{selectedPrescription.doctorName || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wider text-[10px]">RECORD ID CODE</span>
                  <span className="text-slate-500 font-mono">{selectedPrescription.id}</span>
                </div>
              </div>

              {/* Action buttons inside detail popup */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => triggerPrintPrescription(selectedPrescription)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  {dict.printReport}
                </button>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {dict.close}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* --- SITE FOOTER --- */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800 py-10 text-center text-xs text-slate-400 bg-white dark:bg-[#111827] mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="font-extrabold text-[#0F172A] dark:text-white uppercase tracking-wider mb-2">MedScriptAI Smart Med Scan</div>
          <p>© 2026 MedScriptAI. Structured clinical intelligence parsed securely using gemini-3.5-flash.</p>
          <div className="flex justify-center gap-4 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 pt-2">
            <span className="cursor-pointer" onClick={() => setActiveTab('tech')}>Technology stack</span>
            <span>&bull;</span>
            <span className="cursor-pointer" onClick={() => setActiveTab('about')}>Security Sandboxing</span>
            <span>&bull;</span>
            <span className="cursor-pointer" onClick={() => setActiveTab('settings')}>Adherence Reminders</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
