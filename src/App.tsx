import React, { useState, useEffect } from 'react';
import { useSourcingStore, ProductItem, Project } from './store';
import { Database, Download, Trash2, FolderSync, PlusCircle, PenLine, Keyboard, ScanSearch, Check, Edit2, X, Link as LinkIcon, MessageCircle, FileText, Printer, CloudUpload, LogOut, Globe, ExternalLink, Image as ImageIcon, Settings, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export const ALIBABA_CATALOGS = [
  "Apparel & Accessories", "Consumer Electronics", "Sports & Entertainment", "Beauty",
  "Packaging & Printing", "Home & Garden", "Sportswear & Outdoor Apparel",
  "Jewelry, Eyewear & Watches", "Shoes & Accessories", "Luggage, Bags & Cases",
  "Parents, Kids & Toys", "Personal Care & Home Care", "Health & Medical",
  "Gifts & Crafts", "Pet Supplies", "School & Office Supplies", "Industrial Machinery",
  "Commercial Equipment & Machinery", "Construction & Building Machinery",
  "Construction & Real Estate", "Furniture", "Lights & Lighting", "Home Appliances",
  "Automotive Supplies & Tools", "Vehicle Parts & Accessories", "Tools & Hardware",
  "Renewable Energy", "Electrical Equipment & Supplies", "Safety & Security",
  "Material Handling", "Testing Instrument & Equipment", "Power Transmission",
  "Electronic Components", "Vehicles & Transportation", "Agriculture, Food & Beverage",
  "Raw Materials", "Fabrication Services", "Service", "Uncategorized"
];

const ANIMATED_CHARACTERS = [
  { id: 'bear', name: 'Original Bear', faces: ['ʕ•ᴥ•ʔ', 'ʕ -ᴥ-ʔ', 'ʕ >ᴥ<ʔ', 'ʕ º ᴥ ºʔ', 'ʕ ͡° ͜ʖ ͡°ʔ'] },
  { id: 'happy', name: 'Stay Positive', faces: ['(•‿•)', '(✷‿✷)', '(ʘ‿ʘ)', '(◕‿◕)', '(✯‿✯)'] },
  { id: 'cool', name: 'Cool Cat', faces: ['(⌐■_■)', '( •_•)>⌐■-■', '(⌐■_■)', '( ͡° ͜ʖ ͡°)', '(▀̿Ĺ̯▀̿ ̿)'] },
  { id: 'wink', name: 'Winker', faces: ['(･ω<)☆', '(✿◠‿◠)', '(･ω<)☆', '(^_-)', '(-_・)'] },
  { id: 'shock', name: 'Surprised', faces: ['(⊙_⊙)', '(ﾟдﾟ)', '(⊙_⊙)', '(O_O)', '(°A°)'] },
  { id: 'cat', name: 'Neko', faces: ['(=^･ω･^=)', '(=^･ｪ･^=)', '(=^･ω･^=)', '(^・ω・^ )', '(=^-ω-^=)'] },
  { id: 'robot', name: 'Bot 01', faces: ['[o_o]', '[x_x]', '[o_o]', '[+_+]', '[-_-]'] },
  { id: 'shy', name: 'Blushy', faces: ['(◡‿◡✿)', '(◕‿◕✿)', '(◡‿◡✿)', '(ꈍᴗꈍ)', '(◕‿◕)'] },
  { id: 'wave', name: 'Hello', faces: ['(￣▽￣)ノ', '( ^_^)/', '(￣▽￣)ノ', '(* ﾟ∀ﾟ)ﾉ', '( ・_・)ノ'] },
  { id: 'eat', name: 'Foodie', faces: ['(っ˘ڡ˘ς)', '(๑´ڡ`๑)', '(っ˘ڡ˘ς)', '(o^∀^o)', '(๑´ㅂ`๑)'] }
];

const AnimatedBear = ({ onClick }: { onClick?: () => void }) => {
    const { avatarType, avatarValue } = useSourcingStore();
    const character = ANIMATED_CHARACTERS.find(c => c.faces.includes(avatarValue)) || ANIMATED_CHARACTERS[0];
    const [face, setFace] = useState(avatarValue || character.faces[0]);
    
    useEffect(() => {
       if (avatarType !== 'animated') return;
       const interval = setInterval(() => {
           const r = Math.random();
           if(r < 0.3) {
               const randomFace = character.faces[Math.floor(Math.random() * (character.faces.length - 1)) + 1];
               setFace(randomFace); 
               setTimeout(() => setFace(avatarValue), 2000);
           }
       }, 5000);
       return () => clearInterval(interval);
    }, [avatarType, avatarValue, character]);

    if (avatarType === 'image') {
      return (
        <div 
          className="w-14 h-14 shrink-0 relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
           <img src={avatarValue} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      );
    }

    return (
      <div className="w-14 h-14 shrink-0 relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center cursor-pointer" onClick={onClick}>
        <AnimatePresence mode="wait">
          <motion.div 
             key={face}
             initial={{ opacity: 0, y: 5, scale: 0.8 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -5, scale: 0.8 }}
             transition={{ duration: 0.3 }}
             className="font-mono text-[14px] font-bold text-slate-700 dark:text-slate-200 select-none whitespace-nowrap"
          >
            {face}
          </motion.div>
        </AnimatePresence>
      </div>
    )
}

export default function App() {
  const { 
    projects, currentProjectId, badgeText, themeColor, avatarType, avatarValue, 
    createProject, switchProject, deleteProject, updateProjectName, updateBadgeText, 
    setThemeColor, setAvatar, addItem, updateItem, removeItem, clearCurrentProject 
  } = useSourcingStore();
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectName = currentProject ? currentProject.name : 'New Project';
  const items = currentProject ? currentProject.items : [];

  // Theme & Settings
  const [appSettings, setAppSettings] = useState(() => JSON.parse(localStorage.getItem('appSettings') || '{"isDarkMode": false, "pdfHeaderSize": 2, "pdfItemTitleSize": 1, "pdfItemSpecsSize": 0.8, "pdfColorBase": "#0f172a", "pdfColorPrimary": "#2563eb"}'));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    if (appSettings.isDarkMode) {
       document.documentElement.classList.add('dark-mode');
    } else {
       document.documentElement.classList.remove('dark-mode');
    }
  }, [appSettings]);

  useEffect(() => {
    // Sync themeColor to body class
    const colors = ['blue', 'rose', 'emerald', 'amber', 'red', 'orange', 'yellow', 'green', 'indigo', 'violet'];
    colors.forEach(c => document.body.classList.remove(`theme-${c}`));
    if (themeColor !== 'blue') {
      document.body.classList.add(`theme-${themeColor}`);
    }
  }, [themeColor]);

  useEffect(() => {
    if (projects.length === 0) {
      createProject('New Project');
    } else if (!currentProjectId && projects.length > 0) {
      switchProject(projects[0].id);
    }
  }, [projects.length, currentProjectId, createProject, switchProject]);

  // PDF Preiew State
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-hide success messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Form States
  const [manualForm, setManualForm] = useState({
    productName: '',
    supplierName: '',
    supplierYears: '',
    supplierLocation: '',
    supplierType: '',
    isVerified: false,
    isCustomManufacturer: false,
    catalog: '',
    price: '',
    moq: '',
    shipping: '',
    specs: '',
    sourceUrl: '',
    chatUrl: '',
    imageUrls: ['', '', ''],
    notes: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductItem>>({ imageUrls: ['', '', ''] });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBadge, setIsEditingBadge] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [hasDriveConfig, setHasDriveConfig] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSettingUpKeys, setIsSettingUpKeys] = useState(false);
  const [googleKeys, setGoogleKeys] = useState({ clientId: '', clientSecret: '' });

  useEffect(() => {
    const savedKeys = localStorage.getItem('google_drive_keys');
    if (savedKeys) {
        try {
            setGoogleKeys(JSON.parse(savedKeys));
        } catch (e) {
            console.warn("Invalid saved Google keys, clearing...");
            localStorage.removeItem('google_drive_keys');
        }
    }
    checkDriveStatus();
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsDriveConnected(true);
        setSuccessMsg("Google Drive Connected!");
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const saveGoogleKeys = async () => {
      if (!googleKeys.clientId || !googleKeys.clientSecret) {
          setError("Vui lòng nhập cả Client ID và Client Secret");
          return;
      }
      localStorage.setItem('google_drive_keys', JSON.stringify(googleKeys));
      setIsSettingUpKeys(false);
      setSuccessMsg("Đã lưu thiết lập cục bộ!");
      
      try {
          const res = await fetch('/api/auth/google/url', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(googleKeys)
          });
          const { url } = await res.json();
          window.open(url, 'google_auth', 'width=600,height=700');
      } catch (e) {
          setError("Không thể khởi tạo đăng nhập Google.");
      }
  };

  const checkDriveStatus = async () => {
    const extToken = localStorage.getItem('chrome_gdrive_token');
    if (extToken) {
       setIsDriveConnected(true);
       return;
    }
    try {
      const res = await fetch('/api/auth/google/status');
      const data = await res.json();
      setIsDriveConnected(data.connected);
      setHasDriveConfig(data.hasConfig);
    } catch (e) {
      console.error("Failed to check drive status");
    }
  };

  const handleGDriveLogin = async () => {
    // 1. Chrome Extension Context
    // @ts-ignore
    if (typeof chrome !== 'undefined' && chrome.identity) {
      // @ts-ignore
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        // @ts-ignore
        if (chrome.runtime.lastError || !token) {
          // @ts-ignore
          const err = chrome.runtime.lastError?.message || "";
          if (err.includes("OAuth2 client ID")) {
               setError("Lỗi Extension: Vui lòng đọc kỹ hướng dẫn. Bạn chưa cấu hình 'oauth2 client_id' bằng mã Extension ID của bạn vào file manifest.json!");
          } else {
               setError("Chrome Ext Auth Auth: " + err);
          }
          return;
        }
        localStorage.setItem('chrome_gdrive_token', token);
        setIsDriveConnected(true);
        setSuccessMsg("Connected to Google Drive via extension popup!");
      });
      return;
    }

    // 2. Original Express Backend Mode (Web App)
    try {
      if (hasDriveConfig) {
          const res = await fetch('/api/auth/google/url'); 
          const { url } = await res.json();
          window.open(url, 'google_auth', 'width=600,height=700');
      } else {
          // Fallback if environment variables are not set
          if (!googleKeys.clientId || !googleKeys.clientSecret) {
              setIsSettingUpKeys(true);
              return;
          }

          const res = await fetch('/api/auth/google/url', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(googleKeys)
          });
          const { url } = await res.json();
          window.open(url, 'google_auth', 'width=600,height=700');
      }
    } catch (e) {
      setError("Cannot reach backend server to initialize Google Auth.");
    }
  };

  const handleGDriveLogout = async () => {
    localStorage.removeItem('chrome_gdrive_token');
    try {
      await fetch('/api/auth/google/logout', { method: 'POST' });
    } catch (e) {}
    setIsDriveConnected(false);
    setSuccessMsg("Logged out from Google");
  };

  const handleSyncToDrive = async () => {
    if (!isDriveConnected) {
      handleGDriveLogin();
      return;
    }
    setIsSyncing(true);
    try {
      const backupData = { projectName, items, exportedAt: new Date().toISOString() };
      const filename = `Sourcing_${projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.json`;
      const fileContent = JSON.stringify(backupData, null, 2);

      const extToken = localStorage.getItem('chrome_gdrive_token');
      if (extToken) {
          // Upload directly using Google APIs REST
          const form = new FormData();
          const metadata = new Blob([JSON.stringify({ name: filename, mimeType: 'application/json' })], { type: 'application/json' });
          const file = new Blob([fileContent], { type: 'application/json' });
          form.append('metadata', metadata);
          form.append('file', file);
          
          const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${extToken}` },
              body: form
          });
          if (res.ok) {
             setSuccessMsg("Exported to Google Drive directly via Extension!");
          } else {
             setError("Sync failed. Token might be expired.");
             localStorage.removeItem('chrome_gdrive_token');
             setIsDriveConnected(false);
          }
      } else {
          // Flow with Node.js Server
          const res = await fetch('/api/drive/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, content: fileContent, mimeType: 'application/json' })
          });
          const data = await res.json();
          if (data.success) {
            setSuccessMsg("Exported to Google Drive!");
            if (data.link) window.open(data.link, '_blank');
          } else {
            throw new Error(data.error);
          }
      }
    } catch (e: any) {
      setError("Sync failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenPrintTab = () => {
    // Generate HTML for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to open the printable report.");
      return;
    }

    const html = document.getElementById('printable-report')?.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
        } catch (e) {
          return '';
        }
      }).join('');

    const customPdfStyles = `
      body { background: white !important; margin: 0; padding: 20px; font-family: sans-serif; }
      .print\\:hidden { display: none !important; }
      @media print {
        .no-print { display: none; }
        body { padding: 0; }
      }
      /* Scale Adjustments for PDF */
      .pdf-report-title { font-size: ${appSettings.pdfHeaderSize}rem !important; color: ${appSettings.pdfColorBase} !important; }
      .pdf-product-title { font-size: ${appSettings.pdfItemTitleSize}rem !important; color: ${appSettings.pdfColorPrimary} !important; }
      .pdf-supplier-info { font-size: ${appSettings.pdfItemSpecsSize}rem !important; color: ${appSettings.pdfColorBase} !important; }
      .pdf-price-tag { font-size: 18px !important; color: ${appSettings.pdfColorPrimary} !important; }
      .pdf-shipping-tag { font-size: 18px !important; color: ${appSettings.pdfColorBase} !important; }
      .pdf-moq-tag { font-size: 14px !important; color: ${appSettings.pdfColorBase} !important; font-weight: bold !important; opacity: 0.8; }
      .pdf-link-tag { font-size: 15px !important; }
      .pdf-image { width: 144px !important; height: 144px !important; min-width: 144px !important; }
      .pdf-notes { font-size: 18px !important; font-weight: bold !important; border-left: 4px solid ${appSettings.pdfColorPrimary} !important; padding-left: 8px !important; }
      .pdf-specs-text { font-size: ${appSettings.pdfItemSpecsSize}rem !important; }
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>${projectName} - Sourcing Report</title>
          <style>${styles}</style>
          <style>${customPdfStyles}</style>
        </head>
        <body>
          <div class="max-w-[210mm] mx-auto">
            ${html}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              // window.close(); // Uncomment to auto-close after print
            }, 800);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadHTML = () => {
    const html = document.getElementById('printable-report')?.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try { return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join(''); } 
        catch (e) { return ''; }
      }).join('');

    const fullHtml = `
      <html>
        <head>
          <title>${projectName} - Sourcing Report</title>
          <meta charset="utf-8">
          <style>${styles}</style>
          <style>
              body { background: white !important; margin: 0; padding: 20px; font-family: sans-serif; }
              @media print { body { padding: 0; } }
              
              /* Scale Adjustments for PDF */
              .pdf-product-title { font-size: 21px !important; }
              .pdf-supplier-info { font-size: 15px !important; }
              .pdf-price-tag { font-size: 18px !important; }
              .pdf-shipping-tag { font-size: 18px !important; }
              .pdf-moq-tag { font-size: 14px !important; color: black !important; font-weight: bold !important; }
              .pdf-link-tag { font-size: 15px !important; }
              .pdf-image { width: 144px !important; height: 144px !important; min-width: 144px !important; }
              .pdf-notes { font-size: 18px !important; font-weight: bold !important; border-left: 4px solid #fcd34d !important; padding-left: 8px !important; }
              .pdf-specs-text { font-size: 14px !important; }
          </style>
        </head>
        <body>
          <div class="max-w-[210mm] mx-auto">${html}</div>
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sourcing_Report_${projectName.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccessMsg("Report downloaded as HTML!");
  };

  const showAutoSaveToast = () => setSuccessMsg("Auto-saved successfully!");

  const handleCreateProject = () => {
    const name = prompt("Enter new project name:", `Project ${projects.length + 1}`);
    if (name) createProject(name);
  };

  const scrapeCurrentPage = () => {
    setIsExtracting(true);
    setError(null);
    setSuccessMsg(null);
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chrome.tabs.query({active: true, currentWindow: true}, (tabs: any) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.id) {
          setError('Current tab not found.');
          setIsExtracting(false);
          return;
        }

        if (!activeTab.url?.includes('alibaba.com')) {
          setError('Please open an Alibaba product page to extract data.');
          setIsExtracting(false);
          return;
        }

        const sourceUrl = activeTab.url || '';

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        chrome.scripting.executeScript({
          target: {tabId: activeTab.id},
          func: () => {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const dData = window.detailData?.globalData || {};
                const getMeta = (prop: string) => document.querySelector('meta[property="' + prop + '"]')?.getAttribute('content') || document.querySelector('meta[name="' + prop + '"]')?.getAttribute('content') || "";
                
                // --- Product Name ---
                // @ts-ignore
                const productName = dData.product?.subject || document.querySelector('.product-title-container h1, .module_title h1, h1')?.innerText?.trim() || getMeta("og:title") || document.title;
                
                // --- Supplier Info ---
                let supplierName = dData.seller?.companyName || "";
                if (!supplierName) {
                    const sel = ['.company-name', '.supplier-name-title', '[data-spm="company_profile"]', '.company-name-container a', '.seller-name'];
                    for (const s of sel) {
                         const el = document.querySelector(s);
                         // @ts-ignore
                         if (el?.innerText?.trim()) { 
                             // @ts-ignore
                             supplierName = el.innerText.trim(); 
                             break; 
                         }
                    }
                }

                let supplierYears = dData.seller?.companyJoinYears || "";
                if (supplierYears && !supplierYears.toString().includes('yr')) supplierYears += " yrs";
                if (!supplierYears) {
                    const yrsEl = document.querySelector('.company-life, .join-year, .year-num');
                    // @ts-ignore
                    if (yrsEl?.innerText) supplierYears = yrsEl.innerText.trim();
                }

                let supplierLocation = dData.seller?.companyRegisterCountry || "";
                
                // --- Supplier Location Detail ---
                const locationData = dData.nodeMap?.module_unifed_company_card?.privateData?.locationInfo?.location || 
                                   dData.module_unifed_company_card?.privateData?.locationInfo?.location;
                
                if (locationData) {
                    supplierLocation = locationData.replace('Located in ', '').trim();
                } else {
                    const locationEl = document.querySelector('.location');
                    if (locationEl?.innerHTML?.includes('Located in')) {
                        // @ts-ignore
                        supplierLocation = locationEl.innerText.replace('Located in ', '').trim();
                    } else if (supplierLocation === 'CN') {
                        supplierLocation = "China";
                    }
                    const countryEl = document.querySelector('.register-country');
                    if ((!supplierLocation || supplierLocation === 'China' || supplierLocation === 'CN') && countryEl) {
                        // @ts-ignore
                        supplierLocation = countryEl.innerText.trim();
                    }
                }

                // --- Supplier Type ---
                let supplierType = dData.seller?.companyBusinessType || "";
                const identityData = dData.nodeMap?.module_unifed_company_card?.privateData?.sellerIdentity || 
                                   dData.module_unifed_company_card?.privateData?.sellerIdentity ||
                                   dData.nodeMap?.module_mini_company_card?.privateData?.sellerIdentity ||
                                   dData.module_mini_company_card?.privateData?.sellerIdentity;
                                   
                if (identityData) {
                    supplierType = identityData;
                } else {
                    const typeEl = document.querySelector('.id-truncate');
                    if (typeEl) {
                        // @ts-ignore
                        const tText = typeEl.innerText?.trim();
                        // Filter out things like "#5 hot selling..."
                        if (tText && tText.length > 3 && !tText.includes('#') && !tText.includes('selling')) {
                            supplierType = tText;
                        }
                    }
                }

                let isVerified = false;
                const vKeywords = ['verified', 'trustpass', 'assessed', 'onsite check', 'a&v checked'];
                if (supplierType && vKeywords.some(k => supplierType.toLowerCase().includes(k))) {
                    isVerified = true;
                }
                let isCustomManufacturer = false;
                
                const verifiedEl = document.querySelector('.verified-icon, [alt="Verified"], .verified, .verified-supplier, .verified-icon-container, [data-spm-anchor-id*="verified"], .verify-icon');
                const pageText = document.body.innerText;
                
                // Active detection from data or DOM
                if (dData.seller?.baoAccountIsDisplayAssurance || dData.seller?.isVerifiedSupplier || pageText.includes('Verified Supplier') || pageText.includes('TrustPass Profile') || pageText.includes('Verified Manufacturer')) {
                    isVerified = true;
                }
                
                if (!isVerified && verifiedEl) {
                    isVerified = true;
                }

                if (isVerified && pageText.includes('Custom Manufacturer')) {
                    isCustomManufacturer = true;
                }

                // --- Price ---
                let price = "";
                const priceData = dData.product?.price?.productRangePrices || {};
                if (priceData.priceRangeText) {
                    price = priceData.priceRangeText;
                } else {
                    const priceItems = document.querySelectorAll('.price-item, .ma-price-item, .ladder-price-item, [data-testid="range-price"]');
                    if (priceItems.length > 0) {
                        const tiers: string[] = [];
                        priceItems.forEach(item => {
                            // @ts-ignore
                            const p = item.querySelector('.price, .format-price, .ladder-price-value, span')?.innerText?.trim() || "";
                            // @ts-ignore
                            const q = item.querySelector('.quality, .moq, .ladder-price-qty, .unit, .id-mb-2')?.innerText?.trim() || "";
                            if (p || q) tiers.push(`${q}: ${p}`.trim());
                        });
                        if (tiers.length > 0) price = tiers.join(' | ');
                    }
                }
                if (!price) price = getMeta("og:price:amount") ? `${getMeta("og:price:amount")} ${getMeta("og:price:currency")}` : "";

                // --- MOQ ---
                let moq = dData.product?.moq || "";
                if (!moq) {
                    const moqEl = document.querySelector(".moq, .ma-min-order, .order-quantity, [data-testid='range-price'] .id-mb-2");
                    if (moqEl) {
                        // @ts-ignore
                        moq = moqEl.innerText.replace(/Minimum order quantity:?/i, '').trim();
                    }
                }

                // --- Shipping ---
                let shipping = "";
                const shippingEl = document.querySelector('.logistic-item, .shipping-fee-text, [data-testid="sku-logistic-empty"]');
                if (shippingEl) {
                    // @ts-ignore
                    shipping = shippingEl.innerText.trim();
                }

                // --- Specs ---
                let specsStr = "";
                const specItems = document.querySelectorAll('[data-testid="module-attribute-row"], .do-entry-item, .product-properties li, .attribute-item, table.obj-table tr');
                const specsList: string[] = [];
                specItems.forEach(item => {
                     // @ts-ignore
                     const k = item.querySelector('[data-testid="module-attribute-name"], .do-entry-item-left, .name, th, .item-left')?.innerText?.trim();
                     // @ts-ignore
                     const v = item.querySelector('[data-testid="module-attribute-value"], .do-entry-item-right, .value, td, .item-right')?.innerText?.trim();
                     if (k && v) specsList.push(`- ${k.replace(/[:\n]/g, '')}: ${v}`);
                     else {
                         // @ts-ignore
                         if (item.innerText?.includes(':')) {
                             // @ts-ignore
                             specsList.push(`- ${item.innerText.replace(/\n+/g, ': ').trim()}`);
                         }
                     }
                });
                specsStr = [...new Set(specsList)].slice(0, 12).join('\n');

                // --- Catalog ---
                let catalog = "";
                const breadcrumbs = document.querySelectorAll('.detail-breadcrumb-layout a, .path-item, .breadcrumb-item, .breadcrumb a');
                if (breadcrumbs && breadcrumbs.length > 0) {
                    // Try the last meaningful one
                    // @ts-ignore
                    catalog = breadcrumbs[breadcrumbs.length - 1].innerText.trim();
                }

                // --- Chat URL ---
                let chatUrl = "";
                const pid = dData.product?.productId || window.location.href.match(/_(\d{8,})\.html/)?.[1] || "";
                
                // session tokens often in detailData or global detail context
                // @ts-ignore
                const sData = window.detailData || {};
                // @ts-ignore
                const gData = window.globalData || {};

                const activeAccountId = dData.seller?.activeAccountId || sData.sellerId || gData.sellerId || "";
                const activeAccountIdEncrypt = dData.seller?.activeIdEncrypt || sData.sellerIdEncrypt || "";
                const chatToken = dData.seller?.chatToken || sData.chatToken || "";
                
                // 1. Look for explicit messenger links in the page
                const allLinks = Array.from(document.querySelectorAll('a[href*="messenger.htm"]'));
                const foundMessenger = allLinks.find(a => {
                   const h = a.getAttribute('href') || '';
                   return h.includes('activeAccountId') && h.includes('chatToken');
                });
                
                if (foundMessenger) {
                  chatUrl = foundMessenger.getAttribute('href') || '';
                } else if (activeAccountId && chatToken) {
                  // 2. Build it from tokens (Matches user requested format)
                  chatUrl = `https://message.alibaba.com/message/messenger.htm?activeAccountId=${activeAccountId}&activeAccountIdEncrypt=${activeAccountIdEncrypt}&chatToken=${chatToken}&productId=${pid}`;
                } else {
                  // 3. Fallback to specialized redirect URL
                  if (pid) {
                    chatUrl = `https://message.alibaba.com/message/default.htm?type=product&action=contact_supplier&productId=${pid}`;
                  } else {
                    const memberId = dData.seller?.memberId || "";
                    chatUrl = `https://message.alibaba.com/message/default.htm?memberId=${memberId}&memberType=seller`;
                  }
                }
                
                if (chatUrl && chatUrl.startsWith('//')) chatUrl = 'https:' + chatUrl;

                // --- Images ---
                const rawImages = dData.product?.mediaItems?.map((m: any) => m.imageUrl?.big || m.imageUrl?.original).filter(Boolean) || [];
                let scrapedImageUrls = rawImages.slice(0, 3).map((url: string) => {
                    let u = url;
                    if (u.startsWith('//')) u = 'https:' + u;
                    return u.replace(/\.webp.*/, '.jpg');
                });
                
                if (scrapedImageUrls.length === 0) {
                    let fb = getMeta("og:image");
                    if (!fb) {
                        const imgEl = document.querySelector('.main-image img, .viewer-image img, .current-main-image img');
                        // @ts-ignore
                        if (imgEl) fb = imgEl.getAttribute('src') || "";
                    }
                    if (fb) {
                        if (fb.startsWith('//')) fb = 'https:' + fb;
                        scrapedImageUrls.push(fb.replace(/\.webp.*/, '.jpg'));
                    }
                }

                return { productName, supplierName, supplierYears, supplierLocation, supplierType, isVerified, isCustomManufacturer, price, moq, shipping, catalog, chatUrl, imageUrls: scrapedImageUrls, specsStr };
            } catch (e: any) {
                return { error: e.toString() };
            }
          }
        }, (results: any) => {
          setIsExtracting(false);
          if (results && results[0] && results[0].result && !results[0].result.error) {
            const scraped = results[0].result;
            
            // Normalize Catalog
            let normalizedCatalog = scraped.catalog || 'Uncategorized';
            if (normalizedCatalog !== 'Uncategorized') {
                const found = ALIBABA_CATALOGS.find(c => 
                    normalizedCatalog.toLowerCase().includes(c.toLowerCase()) || 
                    c.toLowerCase().includes(normalizedCatalog.toLowerCase()) ||
                    normalizedCatalog.toLowerCase().split('&')[0]?.trim() === c.toLowerCase().split('&')[0]?.trim()
                );
                if (found) normalizedCatalog = found;
            }

            // Fill manual form
            setManualForm({
              productName: scraped.productName || '',
              supplierName: scraped.supplierName || '',
              supplierYears: scraped.supplierYears || '',
              supplierLocation: scraped.supplierLocation || '',
              supplierType: scraped.supplierType || '',
              isVerified: scraped.isVerified || false,
              isCustomManufacturer: scraped.isCustomManufacturer || false,
              catalog: normalizedCatalog,
              price: scraped.price || '',
              moq: scraped.moq || '',
              shipping: scraped.shipping || '',
              specs: scraped.specsStr || '',
              sourceUrl: sourceUrl,
              chatUrl: scraped.chatUrl || '',
              imageUrls: scraped.imageUrls && scraped.imageUrls.length > 0 ? [...scraped.imageUrls, '', ''].slice(0, 3) : ['', '', ''],
              notes: ''
            });
            setSuccessMsg("Data extracted! Review & Save.");
          } else {
            setError("DOM Extraction error. Page might not have fully loaded or structure changed.");
          }
        });
      });
    } else {
      setIsExtracting(false);
      // Simulate data for Dev environment outside extension
      setManualForm({
        productName: 'Premium Men Jacket',
        supplierName: 'Guangzhou Fashion Trading',
        supplierYears: '5 yrs',
        supplierLocation: 'Guangzhou, Guangdong, CN',
        supplierType: 'Multispecialty Supplier',
        isVerified: true,
        catalog: 'Apparel & Accessories',
        price: '150.00 PHP - 200.00 PHP',
        moq: '50 Pieces',
        specs: '- Material: Cotton\n- Color: Black, White\n- Style: Casual',
        sourceUrl: 'https://alibaba.com/sample',
        chatUrl: 'https://message.alibaba.com/sample',
        imageUrls: ['https://sc04.alicdn.com/kf/H7b1f3c3a1c0d4a98a00085d7bfeeab1cU.jpg', '', ''],
        notes: ''
      });
      setSuccessMsg("[DEV MODE] Sample data created (not running as Extension).");
    }
  };

  const handleManualSubmit = () => {
    if (!manualForm.productName || !manualForm.supplierName) {
      setError("Please enter Product Name and Supplier!");
      return;
    }
    
    const specsList = manualForm.specs.split('\n').filter(s => s.trim().length > 0);
    const cleanImageUrls = (manualForm.imageUrls || []).map(u => u.trim()).filter(u => u.length > 0);
    
    addItem({
      productName: (manualForm.productName || '').trim(),
      supplierName: (manualForm.supplierName || '').trim(),
      supplierYears: (manualForm.supplierYears || '').trim(),
      supplierLocation: (manualForm.supplierLocation || '').trim(),
      supplierType: (manualForm.supplierType || '').trim(),
      isVerified: !!manualForm.isVerified,
      isCustomManufacturer: !!manualForm.isCustomManufacturer,
      catalog: (manualForm.catalog || '').trim() || 'Uncategorized',
      price: (manualForm.price || '').trim() || 'N/A',
      moq: (manualForm.moq || '').trim() || 'N/A',
      shipping: (manualForm.shipping || '').trim(),
      specs: specsList,
      imageUrls: cleanImageUrls,
      imageUrl: cleanImageUrls[0] || '',
      sourceUrl: (manualForm.sourceUrl || '').trim(),
      chatUrl: (manualForm.chatUrl || '').trim(),
      notes: (manualForm.notes || '').trim()
    });

    // Reset
    setManualForm({ 
      productName: '', 
      supplierName: '', 
      supplierYears: '', 
      supplierLocation: '', 
      supplierType: '', 
      isVerified: false, 
      isCustomManufacturer: false,
      catalog: 'Uncategorized', 
      price: '', 
      moq: '', 
      shipping: '',
      specs: '', 
      sourceUrl: '', 
      chatUrl: '', 
      imageUrls: ['', '', ''], 
      notes: '' 
    });
    showAutoSaveToast();
    setError(null);
  };

  const handleBackup = () => {
    const backupData = { projectName, items };
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `alibaba_${projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const content = re.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && Array.isArray(parsed.items)) {
            // It's a valid backup file
            useSourcingStore.getState().importProject(parsed);
            setSuccessMsg("Kho lưu trữ đã được nhập thành công!");
          } else {
            setError("File không hợp lệ: Không tìm thấy sản phẩm nào.");
          }
        } catch (err) {
          setError("Lỗi đọc file JSON.");
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  const startEditing = (p: ProductItem) => {
    setEditingId(p.id);
    const normalizedImageUrls = p.imageUrls && p.imageUrls.length > 0 ? [...p.imageUrls, '', ''].slice(0, 3) : [p.imageUrl || '', '', ''];
    setEditForm({ ...p, imageUrls: normalizedImageUrls });
  };

  const saveEdit = () => {
    if (editingId) {
      const cleanImageUrls = (editForm.imageUrls || []).map(u => u.trim()).filter(u => u.length > 0);
      updateItem(editingId, { 
        ...editForm, 
        imageUrls: cleanImageUrls,
        imageUrl: cleanImageUrls[0] || ''
      });
      showAutoSaveToast();
    }
    setEditingId(null);
  };

  const handleDownloadPDF = async () => {
    if (items.length === 0) return;
    setIsPreviewMode(true);
  };

  // Group Data
  const groupedData: Record<string, Record<string, ProductItem[]>> = {};
  items.forEach(item => {
    const supplier = item.supplierName || 'Unknown Supplier';
    const catalog = item.catalog || 'Uncategorized';
    if (!groupedData[supplier]) groupedData[supplier] = {};
    if (!groupedData[supplier][catalog]) groupedData[supplier][catalog] = [];
    groupedData[supplier][catalog].push(item);
  });

  if (isPreviewMode) {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-200">
        <div className="bg-white px-4 py-3 shrink-0 flex items-center justify-between shadow-md z-10 print:hidden sticky top-0">
          <h1 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            PDF Preview - {projectName}
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsPreviewMode(false)} className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded">
              Cancel
            </button>
            <button onClick={handleDownloadHTML} className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Save HTML
            </button>
            <button onClick={handleOpenPrintTab} className="px-4 py-1.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded shadow flex items-center gap-2">
              <Printer className="w-4 h-4"/> Open & Print
            </button>
          </div>
        </div>

        {/* Printable Area - A4 Setup */}
        <div className="flex-1 overflow-auto p-4 print:p-0 bg-slate-200 print:bg-white flex justify-center">
          <div id="printable-report" className="bg-white shadow-xl print:shadow-none w-[210mm] min-h-[297mm] p-[10mm] text-slate-900 border border-slate-300 print:border-none">
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight">{projectName} Sourcing Report</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Generated: {format(new Date(), 'MMM dd, yyyy')}</p>
            </div>
            
            <div className="space-y-8">
              {Object.entries(groupedData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([supplier, catalogs]) => {
                const sortedCatalogs = Object.entries(catalogs).sort(([a], [b]) => a.localeCompare(b));
                const firstProduct = sortedCatalogs[0][1][0];
                return (
                <div key={supplier} className="break-inside-avoid border border-slate-300 rounded overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b border-slate-300 bg-slate-900 print:bg-slate-100 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-white print:text-slate-900">
                      <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        {supplier}
                      </h2>
                      {firstProduct.isVerified && (
                        <div className="flex items-center gap-1 bg-linear-to-r from-blue-500 to-indigo-600 print:bg-blue-100 px-1.5 py-0.5 rounded-sm shadow-sm">
                          <Check className="w-2.5 h-2.5 text-white/90 print:text-blue-600" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white print:text-blue-700 bg-clip-text text-transparent bg-linear-to-b from-white to-white/70 print:text-blue-700">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-white pdf-supplier-info mt-1 min-h-[20px]">
                      {firstProduct.isVerified && (
                        <img 
                          src="/verified.png" 
                          alt="Verified" 
                          className="h-4 object-contain brightness-[1.5]" 
                          onError={(e) => { e.currentTarget.style.display='none'; }} 
                        />
                      )}
                      
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        {firstProduct.supplierType && (
                          <span className="text-white print:text-slate-600 font-bold">
                            {firstProduct.supplierType}
                          </span>
                        )}
                        <span className="text-white/60">•</span>
                        {firstProduct.supplierLocation && (
                          <span className="flex items-center gap-1.5">
                             {firstProduct.supplierLocation.includes('CN') && (
                              <img 
                                src="/china_flag.png" 
                                alt="CN" 
                                className="h-2.5 object-contain rounded-sm" 
                                onError={(e) => { e.currentTarget.style.display='none'; }} 
                              />
                            )}
                            <span className="text-white print:text-slate-800">
                               {firstProduct.supplierLocation.replace('Located in ', '')}
                            </span>
                          </span>
                        )}
                        {firstProduct.supplierYears && (
                          <span className="flex items-center gap-1">
                            <span className="text-white/60">•</span>
                            <span className="text-white print:text-slate-800">
                               <span className="font-bold underline decoration-white/30">{firstProduct.supplierYears.replace(/\D/g, '')}</span> {firstProduct.supplierYears.includes('yr') || firstProduct.supplierYears.includes('year') ? 'years' : firstProduct.supplierYears} on alibaba
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-6 bg-white">
                    {sortedCatalogs.map(([catalog, products]) => (
                      <div key={catalog}>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">{catalog}</h3>
                        <div className="space-y-4">
                          {products.map((p, idx) => (
                            <div key={p.id} className="flex gap-4 p-3 border border-slate-200 rounded break-inside-avoid bg-slate-50">
                              <div className="flex flex-col gap-2 shrink-0">
                                {p.imageUrls && p.imageUrls.length > 0 ? (
                                  p.imageUrls.map((img, i) => (
                                    <div key={i} className="w-24 h-24 bg-white border border-slate-200 p-1 rounded flex items-center justify-center pdf-image">
                                      <img src={img} crossOrigin="anonymous" className="max-w-full max-h-full object-contain" />
                                    </div>
                                  ))
                                ) : p.imageUrl ? (
                                  <div className="w-24 h-24 bg-white border border-slate-200 p-1 rounded flex items-center justify-center pdf-image">
                                    <img src={p.imageUrl} crossOrigin="anonymous" className="max-w-full max-h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-24 h-24 bg-white border border-slate-200 p-1 rounded flex items-center justify-center pdf-image">
                                    <div className="text-xs text-slate-300">No Image</div>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 leading-snug mb-1 text-sm pdf-product-title">{p.productName}</h4>
                                <div className="flex gap-4 mb-2">
                                  <div className="flex flex-col gap-1">
                                    <div className="font-bold text-green-700 text-xs py-0.5 px-2 bg-green-50 border border-green-100 rounded pdf-price-tag">{p.price}</div>
                                    <div className="font-bold text-black text-[10px] pdf-moq-tag">MOQ: {p.moq}</div>
                                  </div>
                                  {p.shipping && (
                                    <div className="font-bold text-amber-700 text-xs py-0.5 px-2 bg-amber-50 border border-amber-100 rounded h-fit pdf-shipping-tag">{p.shipping}</div>
                                  )}
                                </div>
                                {p.specs && p.specs.length > 0 && (
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 border-t border-slate-100 pt-2 pdf-specs">
                                    {p.specs.slice(0, 10).map((s, i) => {
                                      const parts = s.split(':');
                                      const key = parts[0]?.replace('- ', '') || '';
                                      const val = parts.slice(1).join(':') || '';
                                      return (
                                        <div key={i} className="flex justify-between text-[9px] border-b border-slate-50 pb-0.5 pdf-specs-text">
                                          <span className="text-slate-400 font-medium uppercase tracking-tighter">{key}</span>
                                          <span className="text-slate-700 font-bold truncate max-w-[150px]">{val}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {p.notes && (
                                  <div className="mt-2 p-2 bg-amber-50/50 border border-amber-100 rounded text-[9px] text-slate-600 italic pdf-notes" dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${p.notes.replace(/\\n/g, '<br/>')}` }} />
                                )}
                                <div className="mt-3 flex gap-4 text-[9px] font-bold uppercase tracking-wider pdf-link-tag">
                                  {p.sourceUrl && <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1">🔗 Product Link</a>}
                                  {p.chatUrl && <a href={p.chatUrl} target="_blank" rel="noopener noreferrer" className="text-fuchsia-600 hover:text-fuchsia-800 transition flex items-center gap-1">💬 Contact Supplier</a>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden theme-${appSettings.appTheme}`}>
      
      {/* Extension Header Focus */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between shadow-sm z-10 w-full">
        <div className="flex items-center gap-2">
          <AnimatedBear onClick={() => setIsAvatarModalOpen(true)} />
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 px-1 rounded" title="Click to edit badge">
              {isEditingBadge ? (
                <input 
                  autoFocus
                  className="text-blue-600 outline-none border-b border-blue-600 bg-transparent w-16"
                  value={badgeText}
                  onChange={(e) => updateBadgeText(e.target.value)}
                  onBlur={() => setIsEditingBadge(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingBadge(false)}
                />
              ) : (
                <span onClick={() => setIsEditingBadge(true)} className="text-blue-600 flex items-center gap-1">
                  {badgeText || 'Pro'}
                  <PenLine className="w-2.5 h-2.5 text-blue-400 opacity-50 hover:opacity-100" />
                </span>
              )}
            </h1>
            {isEditingTitle && currentProjectId ? (
              <input 
                autoFocus
                className="text-[10px] px-1 py-0 border border-blue-300 rounded outline-none ring-1 ring-blue-100 font-semibold w-24"
                value={projectName}
                onChange={(e) => updateProjectName(currentProjectId, e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              />
            ) : (
              <div className="flex items-center gap-1">
                <select 
                  className="text-[10px] font-semibold text-slate-600 bg-transparent py-0.5 border-none outline-none cursor-pointer hover:text-blue-600 truncate max-w-[100px]"
                  value={currentProjectId || ''}
                  onChange={e => switchProject(e.target.value)}
                >
                  {projects.length === 0 && <option value="">No Projects</option>}
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {currentProjectId && (
                  <>
                    <button onClick={() => setIsEditingTitle(true)} className="text-slate-400 hover:text-blue-600 ml-1" title="Rename Project">
                      <PenLine className="w-2.5 h-2.5" />
                    </button>
                    {projects.length > 1 && (
                        <button onClick={() => {
                           if (window.confirm("Are you sure you want to delete this project?")) {
                             deleteProject(currentProjectId);
                           }
                        }} className="text-slate-400 hover:text-red-600" title="Delete Project">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 overflow-hidden">
          {isDriveConnected ? (
            <button 
              onClick={handleSyncToDrive} 
              disabled={isSyncing}
              className={`p-1.5 rounded flex items-center gap-1 text-[10px] font-bold ${isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-green-50 text-green-700 hover:bg-green-100'}`} 
              title="Sync to Google Drive"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              {isSyncing ? 'Sync' : 'Drive'}
            </button>
          ) : (
            <button 
              onClick={handleGDriveLogin}
              className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded flex items-center gap-1 text-[10px] font-bold" 
              title="Connect Google Drive"
            >
              <Globe className="w-3.5 h-3.5" />
              Drive
            </button>
          )}
          <button 
            onClick={handleImportClick}
            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded flex items-center gap-1 text-[10px] font-bold" 
            title="Import from Backup"
          >
            <FolderSync className="w-3.5 h-3.5" />
            Import
          </button>
          <button onClick={handleCreateProject} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="New Project">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Extension Scrollable Canvas */}
      <main className="flex-1 overflow-y-auto p-3 space-y-4 w-full content-start">
        
        {/* Scrape Focus Button (Sticky) */}
        <div className="sticky top-0 z-20 pb-3 pt-1 bg-slate-50">
          <button 
            onClick={scrapeCurrentPage}
            disabled={isExtracting}
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg shadow hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isExtracting ? (
               <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> Extracting DOM...</>
            ) : (
               <><ScanSearch className="w-4 h-4" /> Scrape Alibaba Page</>
            )}
          </button>
        </div>

        {error && <div className="text-[11px] font-medium text-red-600 bg-red-50 border border-red-100 p-2 rounded">{error}</div>}
        {successMsg && <div className="text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 p-2 rounded">{successMsg}</div>}

        {/* Input Form (Auto-filled by Scraper) */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-blue-500"/> Edit / Add Manually
              </span>
              <div className="flex items-center gap-1">
                 <button onClick={() => setAppSettings({...appSettings, isDarkMode: !appSettings.isDarkMode})} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Toggle Theme">
                   {appSettings.isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                 </button>
                 <button onClick={() => setIsSettingsOpen(true)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="App Settings">
                   <Settings className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Product Name *</label>
                <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none" value={manualForm.productName} onChange={(e) => setManualForm({...manualForm, productName: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Supplier * (Locked)</label>
                  <input readOnly className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 rounded text-xs outline-none cursor-not-allowed" value={manualForm.supplierName} />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Years</label>
                  <input readOnly className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 rounded text-xs outline-none cursor-not-allowed" placeholder="e.g. 5 yrs" value={manualForm.supplierYears || ''} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Verified Status</label>
                  <div 
                    onClick={() => setManualForm({...manualForm, isVerified: !manualForm.isVerified})}
                    className={`flex items-center gap-1 h-[26px] border rounded px-1.5 cursor-pointer shadow-xs transition-all ${manualForm.isVerified ? 'bg-linear-to-r from-emerald-500/80 to-green-600/80 border-green-400 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                  >
                    <Check className={`w-3 h-3 ${manualForm.isVerified ? 'text-white' : 'text-slate-300'}`} />
                    <span className={`text-[9px] font-black uppercase truncate ${manualForm.isVerified ? 'bg-clip-text text-transparent bg-linear-to-b from-white to-white/70' : ''}`}>
                      {manualForm.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Catalog</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Auto-detected item category" value={manualForm.catalog} onChange={(e) => setManualForm({...manualForm, catalog: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Price</label>
                  <textarea 
                    className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded text-xs text-green-700 font-semibold h-[40px] focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
                    title={manualForm.price}
                    value={manualForm.price}
                    onChange={(e) => setManualForm({...manualForm, price: e.target.value})}
                    placeholder="Enter price..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">MOQ</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-amber-700 font-semibold focus:ring-1 focus:ring-blue-500 outline-none" value={manualForm.moq} onChange={(e) => setManualForm({...manualForm, moq: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Shipping</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-amber-700 font-semibold focus:ring-1 focus:ring-blue-500 outline-none" value={manualForm.shipping || ''} onChange={(e) => setManualForm({...manualForm, shipping: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Key Attributes</label>
                  <textarea className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none h-[28px]" placeholder="- Fabric...&#10;- Size..." value={manualForm.specs} onChange={(e) => setManualForm({...manualForm, specs: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5 border-t border-slate-100 pt-1 mt-1">Images</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map(idx => (
                    <input 
                      key={idx}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] focus:ring-1 focus:ring-blue-500 outline-none" 
                      placeholder={`Image URL ${idx + 1}...`} 
                      value={manualForm.imageUrls[idx] || ''} 
                      onChange={(e) => {
                        const newUrls = [...manualForm.imageUrls];
                        newUrls[idx] = e.target.value;
                        setManualForm({...manualForm, imageUrls: newUrls});
                      }} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5 border-t border-slate-100 pt-1 mt-1">My Notes (Optional)</label>
                <textarea 
                  className="w-full px-2 py-1.5 border border-amber-100 bg-amber-50/20 rounded text-xs focus:ring-1 focus:ring-amber-500 outline-none resize-none h-[40px] italic" 
                  placeholder="e.g. Discuss with team, check quality sample first..." 
                  value={manualForm.notes} 
                  onChange={(e) => setManualForm({...manualForm, notes: e.target.value})} 
                />
              </div>

               <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5 flex items-center gap-1"><LinkIcon className="w-2.5 h-2.5"/> Web Link</label>
                  <input 
                    className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 focus:bg-white rounded text-[10px] text-blue-600 outline-none focus:ring-1 focus:ring-blue-500 h-[28px]" 
                    placeholder="Enter web link..."
                    value={manualForm.sourceUrl || ''} 
                    onChange={(e) => setManualForm({...manualForm, sourceUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5 flex items-center gap-1"><MessageCircle className="w-2.5 h-2.5"/> Chat Link</label>
                  <input 
                    className="w-full px-2 py-1.5 border border-slate-200 bg-slate-50 focus:bg-white rounded text-[10px] text-fuchsia-600 outline-none focus:ring-1 focus:ring-blue-500 h-[28px]" 
                    placeholder="Enter chat link..."
                    value={manualForm.chatUrl || ''} 
                    onChange={(e) => setManualForm({...manualForm, chatUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleManualSubmit}
              className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 rounded shadow flex justify-center items-center gap-1.5 hover:bg-blue-700 text-sm transition"
            >
              <Check className="w-4 h-4" /> Save Product
            </button>
        </div>

        {/* Saved Items List */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
               <Database className="w-3.5 h-3.5" /> Saved Data ({items.length})
             </h3>
             {items.length > 0 && (
               <button onClick={clearCurrentProject} className="text-[10px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1">
                 <Trash2 className="w-3 h-3"/> Clear All
               </button>
             )}
          </div>

          {items.length === 0 ? (
             <div className="text-center py-6 text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg">
                No products in the current project yet.
             </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedData).map(([supplier, catalogs]) => (
                 <div key={supplier} className="border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden">
                    <div className="bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-800 border-b border-slate-200 w-full truncate">
                      🏢 {supplier}
                    </div>
                    <div className="p-2 space-y-3">
                      {Object.entries(catalogs).map(([catalog, products]) => (
                        <div key={catalog}>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                             {catalog}
                           </div>
                           <div className="space-y-2">
                             {products.map(p => (
                               <div key={p.id} className="relative group p-2 border border-slate-100 rounded bg-slate-50 hover:bg-white transition flex flex-col gap-1.5">
                                 {/* Edit/Delete Actions */}
                                 <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => startEditing(p)} className="p-1 bg-white shadow-sm rounded text-blue-600 border border-slate-100"><Edit2 className="w-2.5 h-2.5"/></button>
                                    <button onClick={() => { removeItem(p.id); showAutoSaveToast(); }} className="p-1 bg-white shadow-sm rounded text-red-600 border border-slate-100"><Trash2 className="w-2.5 h-2.5"/></button>
                                 </div>

                                 {editingId === p.id ? (
                                   <div className="flex flex-col gap-2 text-[10px]">
                                      <input className="w-full border p-1 rounded" value={editForm.productName} onChange={e => setEditForm({...editForm, productName: e.target.value})} placeholder="Product Name" />
                                      <input className="w-full border p-1 rounded" value={editForm.catalog || ''} onChange={e => setEditForm({...editForm, catalog: e.target.value})} placeholder="Catalog" />
                                      <div className="flex gap-1 items-start">
                                        <textarea 
                                          className="w-[33%] border p-1 rounded bg-white text-green-700 font-semibold h-[40px] text-[10px] focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                          value={editForm.price || ''} 
                                          onChange={e => setEditForm({...editForm, price: e.target.value})} 
                                          placeholder="Price"
                                        />
                                        <input className="w-[33%] border p-1 rounded font-semibold text-amber-700 h-[26px]" value={editForm.moq || ''} onChange={e => setEditForm({...editForm, moq: e.target.value})} placeholder="MOQ" />
                                        <input className="w-[33%] border p-1 rounded font-semibold text-amber-700 h-[26px]" value={editForm.shipping || ''} onChange={e => setEditForm({...editForm, shipping: e.target.value})} placeholder="Shipping" />
                                      </div>
                                      <textarea className="w-full border p-1 rounded text-slate-600 h-[40px] italic text-[9px] resize-none" value={editForm.notes || ''} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="Personal Notes..." />
                                      <div className="flex gap-1">
                                        {[0, 1, 2].map(idx => (
                                          <input 
                                            key={idx}
                                            className="w-1/3 border p-1 rounded text-blue-600 h-[26px]" 
                                            value={editForm.imageUrls?.[idx] || ''} 
                                            onChange={e => {
                                              const newUrls = [...(editForm.imageUrls || ['', '', ''])];
                                              newUrls[idx] = e.target.value;
                                              setEditForm({...editForm, imageUrls: newUrls});
                                            }} 
                                            placeholder={`Img URL ${idx + 1}`} 
                                          />
                                        ))}
                                      </div>
                                      <div 
                                        onClick={() => setEditForm({...editForm, isVerified: !editForm.isVerified})}
                                        className={`flex items-center gap-1.5 h-[24px] border rounded px-2 cursor-pointer transition-colors ${editForm.isVerified ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                                      >
                                        <Check className={`w-3 h-3 ${editForm.isVerified ? 'text-blue-600' : 'text-slate-300'}`} />
                                        <span className="text-[9px] font-bold uppercase truncate">
                                          {editForm.isVerified ? (editForm.isCustomManufacturer ? 'Verified Custom Manufacturer' : 'Verified') : 'Not Verified'}
                                        </span>
                                      </div>
                                      <div className="flex justify-end gap-1 mt-1">
                                        <button onClick={() => setEditingId(null)} className="px-2 py-0.5 bg-slate-200 rounded">Cancel</button>
                                        <button onClick={saveEdit} className="px-2 py-0.5 bg-blue-600 text-white rounded">Save</button>
                                      </div>
                                   </div>
                                 ) : (
                                   <div className="flex gap-2 items-center">
                                     <div className="flex gap-1">
                                       {(p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : p.imageUrl ? [p.imageUrl] : []).map((img, i) => (
                                         <img key={i} src={img} alt="thumb" className="w-10 h-10 object-contain bg-white border border-slate-200 rounded shrink-0" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                                       ))}
                                     </div>
                                     <div className="flex-1 flex flex-col justify-center min-w-0">
                                       <div className="font-semibold text-[11px] text-slate-800 pr-10 truncate">{p.productName}</div>
                                       <div className="flex gap-2 items-center mt-1 flex-wrap">
                                         <span className="text-[10px] font-bold text-green-600">{p.price}</span>
                                         <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">{p.moq}</span>
                                         {p.shipping && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">Ship: {p.shipping}</span>}
                                         {p.chatUrl && (
                                           <a 
                                             href={p.chatUrl} 
                                             target="_blank" 
                                             rel="noopener noreferrer" 
                                             className="text-[9px] font-bold text-fuchsia-600 hover:text-fuchsia-800 flex items-center gap-0.5 ml-auto"
                                             title="Chat with Supplier"
                                           >
                                             <MessageCircle className="w-2.5 h-2.5" /> Chat
                                           </a>
                                         )}
                                       </div>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Extension Footer Action */}
      <footer className="bg-slate-900 border-t border-slate-800 p-2 shrink-0 flex items-center justify-between w-full z-10 shadow-lg">
        <div className="flex gap-2">
            <button
                onClick={handleManualSubmit}
                className="bg-green-600 text-white px-2 py-1.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-green-500 transition shadow-lg shadow-green-500/20"
                title="Save Current Product"
            >
                <Check className="w-3.5 h-3.5" /> Product
            </button>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleBackup}
              className="text-slate-400 hover:text-white px-1.5 py-1 rounded text-[9px] font-bold flex items-center gap-1 transition"
              title="Download JSON Backup"
            >
               <FolderSync className="w-3 h-3" /> Export
            </button>
          )}
          {items.length > 0 ? (
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-2 py-1.5 rounded text-[10px] font-bold flex items-center tracking-wide gap-1 hover:bg-blue-500 transition relative"
              title="Download PDF Report"
            >
               <Download className="w-3.5 h-3.5" /> PDF
               <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[7px] min-w-[12px] h-[12px] flex items-center justify-center rounded-full border border-slate-900 px-0.5">
                  {items.length}
               </span>
            </button>
          ) : (
            <button disabled className="bg-slate-800 text-slate-500 px-2 py-1.5 rounded text-[9px] font-semibold cursor-not-allowed">
              NO DATA
            </button>
          )}
        </div>
      </footer>

      {isSettingsOpen && (
        <SettingsModal 
          settings={appSettings} 
          setSettings={setAppSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
      
      {isSettingUpKeys && (
        <GoogleKeyModal 
          keys={googleKeys} 
          setKeys={setGoogleKeys} 
          onSave={saveGoogleKeys} 
          onCancel={() => setIsSettingUpKeys(false)} 
        />
      )}
      {isAvatarModalOpen && (
        <AvatarModal 
          currentType={avatarType}
          currentValue={avatarValue}
          onSelect={(type, val) => {
            setAvatar(type, val);
            setIsAvatarModalOpen(false);
          }}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </div>
  );
}

// --- Modals and Overlays ---
function AvatarModal({ currentType, currentValue, onSelect, onClose }: { currentType: string, currentValue: string, onSelect: (t: 'animated' | 'image', v: string) => void, onClose: () => void }) {
  const [imgUrl, setImgUrl] = useState(currentType === 'image' ? currentValue : '');
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[400px] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-slate-800 dark:text-slate-100 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" /> Customize Avatar
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Character</h3>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATED_CHARACTERS.map(char => (
                <button 
                  key={char.id}
                  onClick={() => onSelect('animated', char.faces[0])}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition ${currentValue === char.faces[0] || (currentType === 'animated' && char.faces.includes(currentValue)) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}`}
                >
                  <div className="font-mono text-lg font-bold">{char.faces[0]}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{char.name}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Image URL</h3>
            <div className="flex gap-2">
              <input 
                className="flex-1 px-3 py-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://images.com/my-photo.jpg"
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
              />
              <button 
                onClick={() => imgUrl && onSelect('image', imgUrl)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function SettingsModal({ settings, setSettings, onClose }: { settings: any, setSettings: (s: any) => void, onClose: () => void }) {
  const { themeColor, setThemeColor } = useSourcingStore();
  const themes = [
    { id: 'blue', color: 'bg-blue-600' },
    { id: 'red', color: 'bg-red-600' },
    { id: 'orange', color: 'bg-orange-600' },
    { id: 'yellow', color: 'bg-yellow-400' },
    { id: 'green', color: 'bg-green-600' },
    { id: 'indigo', color: 'bg-indigo-600' },
    { id: 'violet', color: 'bg-violet-600' },
    { id: 'rose', color: 'bg-rose-600' },
    { id: 'emerald', color: 'bg-emerald-600' },
    { id: 'amber', color: 'bg-amber-600' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[360px] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-slate-800 dark:text-slate-100 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" /> App Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">App Theme (Rainbow)</h3>
            <div className="grid grid-cols-5 gap-2">
              {themes.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setThemeColor(t.id)}
                  className={`w-full h-8 rounded border-2 transition ${themeColor === t.id ? 'border-slate-800 dark:border-white scale-110 shadow-md ring-2 ring-white/20' : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'} ${t.color}`}
                  title={t.id}
                />
              ))}
            </div>
            <p className="text-[9px] text-slate-400 italic">* Default is Blue</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PDF Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-1">Text Color (Hex)</label>
                <input type="color" value={settings.pdfColorBase} onChange={e => setSettings({...settings, pdfColorBase: e.target.value})} className="w-full h-8 p-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded cursor-pointer" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-1">Highlight Color (Hex)</label>
                <input type="color" value={settings.pdfColorPrimary} onChange={e => setSettings({...settings, pdfColorPrimary: e.target.value})} className="w-full h-8 p-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PDF Typography (rem)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-1">Main Header</label>
                <input type="number" step="0.1" value={settings.pdfHeaderSize} onChange={e => setSettings({...settings, pdfHeaderSize: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-1">Item Title</label>
                <input type="number" step="0.1" value={settings.pdfItemTitleSize} onChange={e => setSettings({...settings, pdfItemTitleSize: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 mb-1">Item Specs</label>
                <input type="number" step="0.05" value={settings.pdfItemSpecsSize} onChange={e => setSettings({...settings, pdfItemSpecsSize: e.target.value})} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono outline-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function GoogleKeyModal({ keys, setKeys, onSave, onCancel }: { 
    keys: { clientId: string, clientSecret: string }, 
    setKeys: (k: any) => void, 
    onSave: () => void, 
    onCancel: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[340px] rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
          <h2 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Web App Authentication
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Bạn đang chạy ứng dụng này ở dạng Web App độc lập. Vì hệ thống không chứa cấu hình máy chủ gốc, bạn cần khai báo Google Client ID <b>một lần duy nhất</b> để thiết lập định danh với Google.
            <br/><br/>
            <i>Mẹo: Nếu bạn đóng gói thành Tiện ích Chrome thì không cần nhập khung này.</i>
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 font-mono">Client ID</label>
              <input 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="...apps.googleusercontent.com"
                value={keys.clientId}
                onChange={e => setKeys({ ...keys, clientId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 font-mono">Client Secret</label>
              <input 
                type="password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="GOCSPX-..."
                value={keys.clientSecret}
                onChange={e => setKeys({ ...keys, clientSecret: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="flex-1 px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              Đóng
            </button>
            <button onClick={onSave} className="flex-1 px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition">
              Lưu & Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
