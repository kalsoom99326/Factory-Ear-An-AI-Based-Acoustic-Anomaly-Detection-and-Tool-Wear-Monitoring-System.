// Standalone Factory Ear Frontend Runner
// Runs directly in browser when Vite server is not active
(function () {
  const { useState, useEffect, useRef, createElement: h } = window.React || {};
  if (!window.React || !window.ReactDOM) {
    console.warn("React/ReactDOM not loaded yet.");
    return;
  }

  // Icons Helper
  const Icon = ({ path, className = "w-5 h-5", stroke = "currentColor", fill = "none" }) => 
    h("svg", {
      className,
      fill,
      stroke,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      viewBox: "0 0 24 24"
    }, h("path", { d: path }));

  const icons = {
    dashboard: "M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    waveform: "M2 12h2M6 8v8M10 4v16M14 7v10M18 9v6M22 12h-2",
    check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    history: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4 1.5l1.6 1.2-1.4 2.4-2-.6a7.9 7.9 0 0 1-1.7 1l-.3 2.1h-2.8l-.3-2.1a7.9 7.9 0 0 1-1.7-1l-2 .6-1.4-2.4 1.6-1.2a8 8 0 0 1 0-2l-1.6-1.2 1.4-2.4 2 .6a7.9 7.9 0 0 1 1.7-1l.3-2.1h2.8l.3 2.1a7.9 7.9 0 0 1 1.7 1l2-.6 1.4 2.4-1.6 1.2a8 8 0 0 1 0 2z",
    radio: "M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0M12 12h.01",
    hardDrive: "M22 12H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    play: "M5 3l14 9-14 9V3z",
    pause: "M6 4h4v16H6zm8 0h4v16h-4z",
    rotate: "M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10",
    volume: "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    menu: "M3 12h18M3 6h18M3 18h18",
    x: "M18 6L6 18M6 6l12 12"
  };

  function StandaloneApp() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [selectedProfile, setSelectedProfile] = useState('metal-cutter');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Audio upload state
    const [audioFile, setAudioFile] = useState({
      name: 'cutting_tool_speed2_sample07.wav',
      size: '1.84 MB',
      duration: '4.2s',
      sampleRate: '16,000 Hz target',
      format: 'WAV (PCM 16-bit)',
      channels: '1 (Mono)'
    });
    const [uploadError, setUploadError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Pipeline state
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(100);
    const [activeStepIndex, setActiveStepIndex] = useState(4);
    const [elapsedTime, setElapsedTime] = useState('0.82s');

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(38);
    const [volume, setVolume] = useState(80);

    // Results state
    const [cutterClass, setCutterClass] = useState('Moderate');
    const [pumpStatus, setPumpStatus] = useState('Anomalous');
    const [pumpAnomalyScore, setPumpAnomalyScore] = useState(-0.28);
    const [reviewDecision, setReviewDecision] = useState('Flagged Maintenance');
    const [reviewNotes, setReviewNotes] = useState('Acoustic harmonics show distinct tool flank wear. Resharpening or blade replacement recommended within 20 operating hours.');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // History state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterProfile, setFilterProfile] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterReview, setFilterReview] = useState('all');

    // Settings state
    const [defaultProfile, setDefaultProfile] = useState('metal-cutter');
    const [anomalyThreshold, setAnomalyThreshold] = useState(-0.05);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api/v1');

    // Inspections list
    const inspections = [
      { id: 'INSP-2026-9841', timestamp: '2026-11-04 10:42 AM', machineProfile: 'metal-cutter', machineId: 'MC-ALPHA-04', resultStatus: 'Moderate Wear', isAnomaly: true, confidence: 88.4, reviewStatus: 'Flagged', operator: 'Umm-e-Kalsoom' },
      { id: 'INSP-2026-9840', timestamp: '2026-11-04 09:15 AM', machineProfile: 'industrial-pump', machineId: 'PUMP-ZENODO-00', resultStatus: 'Normal Operation', isAnomaly: false, confidence: 96.2, reviewStatus: 'Approved', operator: 'Umm-e-Kalsoom' },
      { id: 'INSP-2026-9839', timestamp: '2026-11-03 04:30 PM', machineProfile: 'metal-cutter', machineId: 'MC-ALPHA-02', resultStatus: 'Fresh Tool', isAnomaly: false, confidence: 97.1, reviewStatus: 'Approved', operator: 'David Vance' },
      { id: 'INSP-2026-9838', timestamp: '2026-11-03 02:10 PM', machineProfile: 'industrial-pump', machineId: 'PUMP-ZENODO-00', resultStatus: 'Cavitation Anomaly', isAnomaly: true, confidence: 91.8, reviewStatus: 'Pending Review', operator: 'Umm-e-Kalsoom' },
      { id: 'INSP-2026-9837', timestamp: '2026-11-03 11:00 AM', machineProfile: 'metal-cutter', machineId: 'MC-ALPHA-01', resultStatus: 'Broken Blade', isAnomaly: true, confidence: 95.0, reviewStatus: 'Flagged', operator: 'Marcus Brody' },
      { id: 'INSP-2026-9836', timestamp: '2026-11-02 03:22 PM', machineProfile: 'industrial-pump', machineId: 'PUMP-ZENODO-01', resultStatus: 'Normal Operation', isAnomaly: false, confidence: 94.5, reviewStatus: 'Approved', operator: 'Umm-e-Kalsoom' },
      { id: 'INSP-2026-9835', timestamp: '2026-11-02 01:14 PM', machineProfile: 'metal-cutter', machineId: 'MC-BETA-03', resultStatus: 'Base Standard', isAnomaly: false, confidence: 92.4, reviewStatus: 'Approved', operator: 'David Vance' },
      { id: 'INSP-2026-9834', timestamp: '2026-11-01 10:05 AM', machineProfile: 'industrial-pump', machineId: 'PUMP-ZENODO-00', resultStatus: 'Bearing Friction Anomaly', isAnomaly: true, confidence: 89.0, reviewStatus: 'Approved', operator: 'Umm-e-Kalsoom' }
    ];

    // Audio Playback simulation
    useEffect(() => {
      let interval;
      if (isPlaying) {
        interval = setInterval(() => {
          setPlaybackProgress(prev => {
            if (prev >= 100) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 2;
          });
        }, 100);
      }
      return () => clearInterval(interval);
    }, [isPlaying]);

    const handleFileDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processSelectedFile(e.dataTransfer.files[0]);
      }
    };

    const processSelectedFile = (file) => {
      setUploadError(null);
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.wav') && file.type !== 'audio/wav' && file.type !== 'audio/x-wav') {
        setUploadError('Invalid file type: Factory Ear strictly requires standard 16-bit uncompressed .WAV audio recordings.');
        return;
      }
      setAudioFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        duration: '4.2s (Standard)',
        sampleRate: '16,000 Hz target',
        format: 'WAV (PCM 16-bit)',
        channels: '1 (Mono)'
      });
    };

    const handleStartInspection = () => {
      if (!audioFile) {
        setUploadError('Please select or upload a valid .WAV audio file first.');
        return;
      }
      setCurrentTab('status');
      setIsProcessing(true);
      setProcessingProgress(0);
      setActiveStepIndex(0);

      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step <= 4) {
          setActiveStepIndex(step);
          setProcessingProgress(Math.round(((step + 1) / 5) * 100));
        } else {
          clearInterval(interval);
          setIsProcessing(false);
          setProcessingProgress(100);
          setElapsedTime('0.82s');
        }
      }, 500);
    };

    const processingSteps = [
      { id: 1, name: 'Audio Validation', desc: 'Verifying 16-bit PCM header format, mono channel integrity, and clip duration.', lat: '0.04s' },
      { id: 2, name: 'Audio Resampling (16,000 Hz)', desc: 'Applying anti-aliasing low-pass filter and standardizing sampling to 16 kHz.', lat: '0.12s' },
      { id: 3, name: 'Feature Extraction', desc: selectedProfile === 'metal-cutter' ? 'Extracting 128-bin Log-Mel Spectrogram matrix with Librosa STFT.' : 'Computing 1D Mel-Frequency Cepstral Coefficients (MFCCs) tabular feature distribution.', lat: '0.29s' },
      { id: 4, name: 'ML Model Inference', desc: selectedProfile === 'metal-cutter' ? 'PyTorch 2D CNN forward pass across tool wear classes (Fresh, Moderate, Broken, Base).' : 'Isolation Forest outlier evaluation against multi-SNR pump baseline.', lat: '0.25s' },
      { id: 5, name: 'Result Generation', desc: 'Compiling anomaly score thresholds, classification confidence scores, and audit trail.', lat: '0.12s' }
    ];

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
      { id: 'upload', label: 'Upload Audio', icon: icons.upload },
      { id: 'status', label: 'Processing Status', icon: icons.activity },
      { id: 'analysis', label: 'Audio Analysis', icon: icons.waveform },
      { id: 'results', label: 'Detection Results', icon: icons.check },
      { id: 'reports', label: 'Reports & History', icon: icons.history },
      { id: 'settings', label: 'Settings', icon: icons.settings },
    ];

    return h("div", { className: "flex min-h-screen bg-[#f5f3ff] text-slate-800" },
      // SIDEBAR
      h("aside", {
        className: `fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0f1d] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`
      },
        h("div", null,
          // Logo header
          h("div", { className: "p-6 border-b border-slate-800 flex items-center justify-between" },
            h("div", { className: "flex items-center space-x-3" },
              h("div", { className: "w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white" },
                h(Icon, { path: icons.radio, className: "w-6 h-6 animate-pulse" })
              ),
              h("div", null,
                h("h1", { className: "font-bold text-lg tracking-wide text-white flex items-center gap-1.5" },
                  "Factory Ear",
                  h("span", { className: "text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700/50" }, "AI DSP")
                ),
                h("p", { className: "text-xs text-slate-400 font-medium" }, "Acoustic Anomaly & Wear Engine")
              )
            ),
            h("button", { onClick: () => setMobileMenuOpen(false), className: "lg:hidden text-slate-400 p-1" },
              h(Icon, { path: icons.x, className: "w-5 h-5" })
            )
          ),

          // Active Profile Box
          h("div", { className: "px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/60 text-xs" },
            h("div", { className: "flex items-center justify-between text-slate-400 mb-1.5" },
              h("span", { className: "uppercase tracking-wider font-semibold text-[10px]" }, "Active Machine Profile"),
              h("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" })
            ),
            h("div", { className: "flex items-center justify-between font-medium text-slate-200" },
              h("span", { className: "flex items-center gap-1.5" },
                h(Icon, { path: selectedProfile === 'metal-cutter' ? icons.hardDrive : icons.zap, className: "w-3.5 h-3.5 text-purple-400" }),
                selectedProfile === 'metal-cutter' ? "Metal Cutter (2D CNN)" : "Industrial Pump (IF)"
              ),
              h("button", {
                onClick: () => setSelectedProfile(selectedProfile === 'metal-cutter' ? 'industrial-pump' : 'metal-cutter'),
                className: "text-[10px] text-purple-400 hover:text-purple-300 underline font-mono"
              }, "Switch")
            )
          ),

          // Navigation Links
          h("nav", { className: "p-4 space-y-1.5" },
            navItems.map(item =>
              h("button", {
                key: item.id,
                onClick: () => { setCurrentTab(item.id); setMobileMenuOpen(false); },
                className: `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              },
                h("div", { className: "flex items-center space-x-3" },
                  h(Icon, { path: item.icon, className: "w-5 h-5" }),
                  h("span", null, item.label)
                )
              )
            )
          )
        ),

        // User Footer
        h("div", { className: "p-4 border-t border-slate-800/80 bg-slate-950/40" },
          h("div", { className: "flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800" },
            h("div", { className: "w-9 h-9 rounded-full bg-purple-700/80 text-purple-200 flex items-center justify-center font-bold text-sm ring-2 ring-purple-500/30" }, "UK"),
            h("div", { className: "flex-1 min-w-0" },
              h("p", { className: "text-xs font-semibold text-white truncate" }, "Eng. Umm-e-Kalsoom"),
              h("p", { className: "text-[11px] text-slate-400 truncate" }, "Lead Reliability Engineer")
            ),
            h("div", { className: "w-2 h-2 rounded-full bg-emerald-500", title: "Online" })
          ),
          h("div", { className: "mt-3 px-2 flex items-center justify-between text-[11px] text-slate-400 font-mono" },
            h("span", null, "DSP Core v2.4"),
            h("span", { className: "text-emerald-400" }, "● 16,000 Hz")
          )
        )
      ),

      // MAIN CONTENT WRAPPER
      h("div", { className: "flex-1 flex flex-col min-w-0 overflow-y-auto" },
        // Top Header
        h("header", { className: "sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100/80 px-6 py-4 flex items-center justify-between" },
          h("div", { className: "flex items-center space-x-4" },
            h("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "lg:hidden p-2 rounded-lg text-slate-600 hover:bg-purple-50" },
              h(Icon, { path: icons.menu, className: "w-5 h-5" })
            ),
            h("div", null,
              h("div", { className: "flex items-center gap-2" },
                h("span", { className: "text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50" },
                  "Industrial Acoustic Workbench"
                ),
                h("span", { className: "text-xs text-slate-500 hidden sm:inline" },
                  `Dataset: ${selectedProfile === 'metal-cutter' ? 'Kaggle Cutting Tool Wear' : 'Zenodo MIMII Pump id_00'}`
                )
              ),
              h("h2", { className: "text-xl font-bold text-slate-900 capitalize mt-0.5" }, currentTab.replace('-', ' '))
            )
          ),

          h("div", { className: "flex items-center space-x-4" },
            h("div", { className: "hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700" },
              h("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
              h("span", null, "DSP Engine Online (16 kHz)")
            ),
            h("div", { className: "relative" },
              h("button", { onClick: () => setCurrentTab('results'), className: "p-2 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 relative" },
                h(Icon, { path: icons.bell, className: "w-5 h-5" }),
                h("span", { className: "absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" })
              )
            ),
            h("div", { className: "flex items-center bg-purple-50 p-1 rounded-xl border border-purple-200/60" },
              h("button", {
                onClick: () => setSelectedProfile('metal-cutter'),
                className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900'
                }`
              }, "Metal Cutter"),
              h("button", {
                onClick: () => setSelectedProfile('industrial-pump'),
                className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900'
                }`
              }, "Industrial Pump")
            )
          )
        ),

        // MAIN CONTENT BODY
        h("main", { className: "p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full" },
          // Demo Banner
          h("div", { className: "flex items-center justify-between p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 text-xs" },
            h("div", { className: "flex items-center space-x-2.5" },
              h("span", { className: "px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px] uppercase tracking-wider" }, "Demo Data"),
              h("span", null, "Acoustic DSP simulation and pre-production telemetry preview. Ready for FastAPI and ML backend integration.")
            ),
            h("div", { className: "hidden sm:flex items-center space-x-2 font-mono text-[11px] text-purple-700" },
              h("span", null, "Target Resampling: 16,000 Hz"),
              h("span", null, "•"),
              h("span", null, selectedProfile === 'metal-cutter' ? "2D CNN Tool Wear" : "Isolation Forest Anomaly")
            )
          ),

          // 1. DASHBOARD TAB
          currentTab === 'dashboard' && h("div", { className: "space-y-6" },
            // KPI CARDS
            h("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" },
              [
                { label: "Total Inspections", val: "1,428", sub: "+8.4% this week", color: "purple", detail: "Cutters: 812 | Pumps: 616" },
                { label: "Normal Machines", val: "1,356", sub: "95.0% acoustic integrity", color: "emerald", detail: "MIMII SNR -6 to 6dB" },
                { label: "Detected Anomalies", val: "72", sub: "5.0% triage alert rate", color: "rose", detail: "42 Wear | 30 Pump Anomaly" },
                { label: "Machine Health", val: "96.2%", sub: "Operational acoustic index", color: "purple", detail: "Mean latency: 0.82s" }
              ].map((c, i) =>
                h("div", { key: i, className: "bg-white p-5 rounded-2xl border border-purple-100 shadow-sm" },
                  h("div", { className: "flex items-center justify-between" },
                    h("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider" }, c.label),
                    h("div", { className: `p-2 rounded-xl bg-${c.color === 'emerald' ? 'emerald' : c.color === 'rose' ? 'rose' : 'purple'}-50 text-${c.color === 'emerald' ? 'emerald' : c.color === 'rose' ? 'rose' : 'purple'}-600` },
                      h(Icon, { path: c.color === 'rose' ? icons.alert : c.color === 'emerald' ? icons.check : icons.activity, className: "w-5 h-5" })
                    )
                  ),
                  h("div", { className: "mt-4" },
                    h("p", { className: "text-2xl font-extrabold text-slate-900" }, c.val),
                    h("p", { className: `text-xs text-${c.color === 'rose' ? 'rose' : c.color === 'emerald' ? 'emerald' : 'purple'}-600 font-medium mt-1` }, c.sub)
                  ),
                  h("div", { className: "mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400" }, c.detail)
                )
              )
            ),

            // CHARTS SECTION
            h("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
              // Tool-Wear Degradation Chart
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm" },
                h("div", { className: "flex items-center justify-between mb-4" },
                  h("div", null,
                    h("h3", { className: "font-bold text-slate-900 flex items-center gap-2" },
                      h(Icon, { path: icons.activity, className: "w-5 h-5 text-purple-600" }),
                      "Tool-Wear Trend Chart (Metal Cutter)"
                    ),
                    h("p", { className: "text-xs text-slate-500" }, "Progressive blade degradation over cutting hours (Kaggle dataset)")
                  ),
                  h("span", { className: "text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200" }, "2D CNN")
                ),
                h("div", { className: "relative pt-4 pb-2" },
                  h("svg", { viewBox: "0 0 500 200", className: "w-full h-48 overflow-visible" },
                    h("defs", null,
                      h("linearGradient", { id: "wG", x1: "0", y1: "0", x2: "0", y2: "1" },
                        h("stop", { offset: "0%", stopColor: "#7c3aed", stopOpacity: "0.35" }),
                        h("stop", { offset: "100%", stopColor: "#7c3aed", stopOpacity: "0.0" })
                      )
                    ),
                    h("line", { x1: "40", y1: "30", x2: "480", y2: "30", stroke: "#fee2e2", strokeDasharray: "4 4" }),
                    h("line", { x1: "40", y1: "80", x2: "480", y2: "80", stroke: "#fef3c7", strokeDasharray: "4 4" }),
                    h("line", { x1: "40", y1: "160", x2: "480", y2: "160", stroke: "#e2e8f0" }),
                    h("path", {
                      d: "M 50 150 Q 120 145, 180 130 T 280 100 T 360 70 T 450 35 L 450 160 L 50 160 Z",
                      fill: "url(#wG)"
                    }),
                    h("path", {
                      d: "M 50 150 Q 120 145, 180 130 T 280 100 T 360 70 T 450 35",
                      fill: "none",
                      stroke: "#7c3aed",
                      strokeWidth: "3.5"
                    }),
                    h("circle", { cx: "50", cy: "150", r: "5", fill: "#7c3aed", stroke: "#fff", strokeWidth: "2" }),
                    h("circle", { cx: "180", cy: "130", r: "5", fill: "#7c3aed", stroke: "#fff", strokeWidth: "2" }),
                    h("circle", { cx: "280", cy: "100", r: "5", fill: "#7c3aed", stroke: "#fff", strokeWidth: "2" }),
                    h("circle", { cx: "360", cy: "70", r: "5", fill: "#f59e0b", stroke: "#fff", strokeWidth: "2" }),
                    h("circle", { cx: "450", cy: "35", r: "6", fill: "#ef4444", stroke: "#fff", strokeWidth: "2" }),
                    h("text", { x: "50", y: "180", fill: "#64748b", fontSize: "11", textAnchor: "middle" }, "Fresh (0h)"),
                    h("text", { x: "280", y: "180", fill: "#64748b", fontSize: "11", textAnchor: "middle" }, "45h"),
                    h("text", { x: "360", y: "180", fill: "#64748b", fontSize: "11", textAnchor: "middle" }, "Moderate (60h)"),
                    h("text", { x: "450", y: "180", fill: "#64748b", fontSize: "11", textAnchor: "middle" }, "Broken (80h)")
                  )
                ),
                h("div", { className: "flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100" },
                  h("span", null, "Sample Tool-Wear Index"),
                  h("span", { className: "text-purple-700 font-medium" }, "F1-Score: 0.94 • Precision: 0.93")
                )
              ),

              // Inspection Activity Chart
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm" },
                h("div", { className: "flex items-center justify-between mb-4" },
                  h("div", null,
                    h("h3", { className: "font-bold text-slate-900 flex items-center gap-2" },
                      h(Icon, { path: icons.activity, className: "w-5 h-5 text-purple-600" }),
                      "Inspection Activity Chart"
                    ),
                    h("p", { className: "text-xs text-slate-500" }, "Daily acoustic inspections across Day & Night shifts")
                  ),
                  h("span", { className: "text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200" }, "Active")
                ),
                h("div", { className: "h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2" },
                  [
                    { day: 'Mon', d: 110, n: 95 },
                    { day: 'Tue', d: 130, n: 105 },
                    { day: 'Wed', d: 125, n: 115 },
                    { day: 'Thu', d: 140, n: 110 },
                    { day: 'Fri', d: 155, n: 130 },
                    { day: 'Sat', d: 90, n: 80 },
                    { day: 'Sun', d: 75, n: 65 }
                  ].map((item, idx) =>
                    h("div", { key: idx, className: "flex-1 flex flex-col items-center gap-1.5" },
                      h("div", { className: "w-full flex items-end justify-center gap-1 h-32" },
                        h("div", { className: "w-3 bg-purple-600 rounded-t", style: { height: `${(item.d / 160) * 110}px` } }),
                        h("div", { className: "w-3 bg-purple-300 rounded-t", style: { height: `${(item.n / 160) * 110}px` } })
                      ),
                      h("span", { className: "text-xs text-slate-600 font-medium" }, item.day)
                    )
                  )
                ),
                h("div", { className: "flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-100" },
                  h("div", { className: "flex gap-4" },
                    h("span", { className: "flex items-center gap-1" }, h("span", { className: "w-2.5 h-2.5 bg-purple-600 rounded inline-block" }), "Day Shift"),
                    h("span", { className: "flex items-center gap-1" }, h("span", { className: "w-2.5 h-2.5 bg-purple-300 rounded inline-block" }), "Night Shift")
                  ),
                  h("span", { className: "font-medium text-slate-700" }, "Total: 1,428 scans")
                )
              )
            ),

            // Fleet Status & Recent Inspections
            h("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
              // Fleet status
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4" },
                h("div", { className: "flex items-center justify-between" },
                  h("h3", { className: "font-bold text-slate-900 flex items-center gap-2" },
                    h(Icon, { path: icons.hardDrive, className: "w-5 h-5 text-purple-600" }),
                    "Machine Fleet Status"
                  ),
                  h("span", { className: "text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full" }, "10 Units")
                ),
                h("div", { className: "p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2" },
                  h("div", { className: "flex justify-between text-xs font-bold text-purple-900" },
                    h("span", null, "Metal Cutters (Profile A)"),
                    h("span", { className: "text-purple-600" }, "4 Active Assets")
                  ),
                  h("p", { className: "text-xs text-slate-500" }, "2D CNN Tool-Wear Degradation Tracker"),
                  h("div", { className: "grid grid-cols-3 gap-2 pt-1 text-center text-xs" },
                    h("div", { className: "bg-white p-2 rounded-lg border border-purple-100" },
                      h("span", { className: "block text-emerald-600 font-bold text-sm" }, "3"),
                      h("span", { className: "text-[10px] text-slate-400" }, "Fresh/Base")
                    ),
                    h("div", { className: "bg-white p-2 rounded-lg border border-purple-100" },
                      h("span", { className: "block text-amber-500 font-bold text-sm" }, "1"),
                      h("span", { className: "text-[10px] text-slate-400" }, "Moderate")
                    ),
                    h("div", { className: "bg-white p-2 rounded-lg border border-purple-100" },
                      h("span", { className: "block text-rose-500 font-bold text-sm" }, "0"),
                      h("span", { className: "text-[10px] text-slate-400" }, "Broken")
                    )
                  )
                ),
                h("div", { className: "p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2" },
                  h("div", { className: "flex justify-between text-xs font-bold text-purple-900" },
                    h("span", null, "Industrial Pumps (Profile B)"),
                    h("span", { className: "text-purple-600" }, "6 Monitored Assets")
                  ),
                  h("p", { className: "text-xs text-slate-500" }, "Isolation Forest Anomaly Detector"),
                  h("div", { className: "grid grid-cols-2 gap-2 pt-1 text-center text-xs" },
                    h("div", { className: "bg-white p-2 rounded-lg border border-purple-100" },
                      h("span", { className: "block text-emerald-600 font-bold text-sm" }, "5 Normal"),
                      h("span", { className: "text-[10px] text-slate-400" }, "Baseline Noise -6 to 6dB")
                    ),
                    h("div", { className: "bg-white p-2 rounded-lg border border-purple-100" },
                      h("span", { className: "block text-rose-500 font-bold text-sm" }, "1 Flagged"),
                      h("span", { className: "text-[10px] text-slate-400" }, "Cavitation Anomaly")
                    )
                  )
                ),
                h("button", {
                  onClick: () => setCurrentTab('upload'),
                  className: "w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                }, h(Icon, { path: icons.upload, className: "w-4 h-4" }), "Run New Acoustic Inspection")
              ),

              // Recent Inspections table
              h("div", { className: "lg:col-span-2 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4" },
                h("div", { className: "flex items-center justify-between" },
                  h("div", null,
                    h("h3", { className: "font-bold text-slate-900 flex items-center gap-2" },
                      h(Icon, { path: icons.history, className: "w-5 h-5 text-purple-600" }),
                      "Recent Inspections"
                    ),
                    h("p", { className: "text-xs text-slate-500" }, "Recent acoustic inspection runs & technician reviews")
                  ),
                  h("button", { onClick: () => setCurrentTab('reports'), className: "text-xs text-purple-600 font-semibold hover:underline" }, "View All Reports →")
                ),
                h("div", { className: "overflow-x-auto" },
                  h("table", { className: "w-full text-left text-xs" },
                    h("thead", null,
                      h("tr", { className: "border-b border-purple-100 text-slate-400 uppercase text-[10px]" },
                        h("th", { className: "pb-3" }, "Inspection ID"),
                        h("th", { className: "pb-3" }, "Machine"),
                        h("th", { className: "pb-3" }, "Status"),
                        h("th", { className: "pb-3" }, "Conf"),
                        h("th", { className: "pb-3" }, "Review"),
                        h("th", { className: "pb-3 text-right" }, "Action")
                      )
                    ),
                    h("tbody", { className: "divide-y divide-purple-50" },
                      inspections.slice(0, 5).map(row =>
                        h("tr", { key: row.id, className: "hover:bg-purple-50/40" },
                          h("td", { className: "py-3 font-mono font-medium" }, row.id),
                          h("td", { className: "py-3" },
                            h("span", { className: "font-semibold block" }, row.machineId),
                            h("span", { className: "text-[11px] text-slate-400 capitalize" }, row.machineProfile.replace('-', ' '))
                          ),
                          h("td", { className: "py-3" },
                            h("span", {
                              className: `inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                row.resultStatus.includes('Normal') || row.resultStatus.includes('Fresh')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : row.resultStatus.includes('Moderate')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`
                            }, row.resultStatus)
                          ),
                          h("td", { className: "py-3 font-mono font-medium" }, `${row.confidence}%`),
                          h("td", { className: "py-3" },
                            h("span", {
                              className: `inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                row.reviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`
                            }, row.reviewStatus)
                          ),
                          h("td", { className: "py-3 text-right" },
                            h("button", {
                              onClick: () => { setSelectedProfile(row.machineProfile); setCurrentTab('results'); },
                              className: "text-purple-600 font-semibold"
                            }, "View →")
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          ),

          // 2. UPLOAD AUDIO TAB
          currentTab === 'upload' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm" },
              h("h3", { className: "text-lg font-bold text-slate-900" }, "Acoustic Audio Upload & Machine Profile"),
              h("p", { className: "text-xs text-slate-500 mt-1" }, "Upload a standard 16-bit uncompressed .WAV recording from factory machinery for acoustic analysis.")
            ),

            uploadError && h("div", { className: "p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex justify-between items-center" },
              h("div", { className: "flex items-center gap-2" },
                h(Icon, { path: icons.alert, className: "w-5 h-5 text-rose-600" }),
                h("span", null, uploadError)
              ),
              h("button", { onClick: () => setUploadError(null), className: "font-bold text-rose-600" }, "Dismiss")
            ),

            // Profile Selection Cards
            h("div", { className: "space-y-3" },
              h("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-600" }, "Step 1: Select Target Machine Profile"),
              h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
                // Profile A
                h("div", {
                  onClick: () => setSelectedProfile('metal-cutter'),
                  className: `p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProfile === 'metal-cutter' ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-600/20' : 'border-purple-100 bg-white'
                  }`
                },
                  h("div", { className: "flex items-start justify-between" },
                    h("div", { className: "flex items-center space-x-3" },
                      h("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center ${selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}` },
                        h(Icon, { path: icons.hardDrive, className: "w-6 h-6" })
                      ),
                      h("div", null,
                        h("span", { className: "text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded" }, "Profile A"),
                        h("h4", { className: "font-bold text-base text-slate-900 mt-0.5" }, "Metal Cutter")
                      )
                    ),
                    h("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProfile === 'metal-cutter' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}` },
                      selectedProfile === 'metal-cutter' && h(Icon, { path: icons.check, className: "w-4 h-4 text-white" })
                    )
                  ),
                  h("div", { className: "mt-4 space-y-2 text-xs" },
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Model Architecture:"),
                      h("span", { className: "font-semibold" }, "2D CNN (PyTorch)")
                    ),
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Diagnostic Task:"),
                      h("span", { className: "font-semibold" }, "Tool-Wear Classification")
                    ),
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Feature Representation:"),
                      h("span", { className: "font-semibold" }, "128-bin Log-Mel Spectrogram")
                    ),
                    h("div", { className: "pt-2" },
                      h("span", { className: "text-slate-500 block mb-1" }, "Target Classes:"),
                      h("div", { className: "flex gap-1.5" },
                        ['Fresh', 'Moderate', 'Broken', 'Base'].map(c =>
                          h("span", { key: c, className: "px-2 py-0.5 rounded bg-white border border-purple-200 text-purple-900 text-[11px] font-mono" }, c)
                        )
                      )
                    )
                  )
                ),

                // Profile B
                h("div", {
                  onClick: () => setSelectedProfile('industrial-pump'),
                  className: `p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProfile === 'industrial-pump' ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-600/20' : 'border-purple-100 bg-white'
                  }`
                },
                  h("div", { className: "flex items-start justify-between" },
                    h("div", { className: "flex items-center space-x-3" },
                      h("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center ${selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}` },
                        h(Icon, { path: icons.zap, className: "w-6 h-6" })
                      ),
                      h("div", null,
                        h("span", { className: "text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded" }, "Profile B"),
                        h("h4", { className: "font-bold text-base text-slate-900 mt-0.5" }, "Industrial Pump")
                      )
                    ),
                    h("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProfile === 'industrial-pump' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}` },
                      selectedProfile === 'industrial-pump' && h(Icon, { path: icons.check, className: "w-4 h-4 text-white" })
                    )
                  ),
                  h("div", { className: "mt-4 space-y-2 text-xs" },
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Model Architecture:"),
                      h("span", { className: "font-semibold" }, "Isolation Forest (Scikit-Learn)")
                    ),
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Diagnostic Task:"),
                      h("span", { className: "font-semibold" }, "Acoustic Anomaly Detection")
                    ),
                    h("div", { className: "flex justify-between py-1 border-b border-purple-100/60" },
                      h("span", { className: "text-slate-500" }, "Feature Representation:"),
                      h("span", { className: "font-semibold" }, "1D MFCC Tabular Vectors")
                    ),
                    h("div", { className: "pt-2" },
                      h("span", { className: "text-slate-500 block mb-1" }, "Target Classes:"),
                      h("div", { className: "flex gap-1.5" },
                        ['Normal Operation', 'Anomalous Sound'].map(c =>
                          h("span", { key: c, className: "px-2 py-0.5 rounded bg-white border border-purple-200 text-purple-900 text-[11px] font-mono" }, c)
                        )
                      )
                    )
                  )
                )
              )
            ),

            // Drag and Drop Box
            h("div", { className: "space-y-3" },
              h("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-600" }, "Step 2: Upload Machine Audio (.WAV)"),
              h("div", {
                onDragOver: (e) => { e.preventDefault(); setIsDragging(true); },
                onDragLeave: () => setIsDragging(false),
                onDrop: handleFileDrop,
                className: `p-10 rounded-2xl border-2 border-dashed text-center transition-all ${
                  isDragging ? 'border-purple-600 bg-purple-100/60' : 'border-purple-200 bg-white hover:border-purple-400'
                }`
              },
                h("div", { className: "w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-4" },
                  h(Icon, { path: icons.upload, className: "w-7 h-7" })
                ),
                h("h4", { className: "font-bold text-slate-800 text-sm" }, "Drag and drop your machine .WAV audio recording here"),
                h("p", { className: "text-xs text-slate-400 mt-1" }, "Standard 16-bit PCM WAV audio recordings supported (16 kHz resampled automatically)"),
                h("div", { className: "mt-5 flex items-center justify-center gap-3" },
                  h("label", { className: "px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm" },
                    "Browse WAV Files",
                    h("input", {
                      type: "file",
                      accept: ".wav,audio/wav,audio/x-wav",
                      onChange: (e) => { if (e.target.files && e.target.files[0]) processSelectedFile(e.target.files[0]); },
                      className: "hidden"
                    })
                  ),
                  h("button", {
                    type: "button",
                    onClick: () => {
                      setAudioFile({
                        name: selectedProfile === 'metal-cutter' ? 'cutting_tool_speed2_sample07.wav' : 'pump_id00_normal_0dB_001.wav',
                        size: '1.84 MB',
                        duration: '4.2s',
                        sampleRate: '16,000 Hz target',
                        format: 'WAV (PCM 16-bit)',
                        channels: '1 (Mono)'
                      });
                      setUploadError(null);
                    },
                    className: "px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200"
                  }, "Load Sample WAV")
                )
              )
            ),

            // Loaded file card
            audioFile && h("div", { className: "bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4" },
              h("div", { className: "flex items-center justify-between" },
                h("div", { className: "flex items-center space-x-3" },
                  h("div", { className: "w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center" },
                    h(Icon, { path: icons.check, className: "w-5 h-5" })
                  ),
                  h("div", null,
                    h("h4", { className: "text-sm font-bold text-slate-900" }, audioFile.name),
                    h("p", { className: "text-xs text-slate-400" }, `${audioFile.format} • ${audioFile.channels}`)
                  )
                ),
                h("span", { className: "text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200" }, "WAV Validated")
              ),
              h("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-purple-50/50 p-3.5 rounded-xl border border-purple-100" },
                h("div", null, h("span", { className: "text-slate-400 block text-[10px] uppercase font-semibold" }, "File Size"), h("span", { className: "font-medium" }, audioFile.size)),
                h("div", null, h("span", { className: "text-slate-400 block text-[10px] uppercase font-semibold" }, "Duration"), h("span", { className: "font-medium" }, audioFile.duration)),
                h("div", null, h("span", { className: "text-slate-400 block text-[10px] uppercase font-semibold" }, "Target Rate"), h("span", { className: "font-medium text-purple-700" }, audioFile.sampleRate)),
                h("div", null, h("span", { className: "text-slate-400 block text-[10px] uppercase font-semibold" }, "Target Profile"), h("span", { className: "font-medium capitalize" }, selectedProfile.replace('-', ' ')))
              ),
              h("div", { className: "pt-2 flex items-center justify-between" },
                h("div", { className: "text-[11px] text-slate-400 flex items-center gap-1.5" },
                  h(Icon, { path: icons.shield, className: "w-4 h-4 text-purple-600" }),
                  "Ready for FastAPI audio stream ingestion."
                ),
                h("button", {
                  onClick: handleStartInspection,
                  className: "px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2"
                }, h(Icon, { path: icons.zap, className: "w-4 h-4" }), "Start Acoustic Inspection")
              )
            )
          ),

          // 3. PROCESSING STATUS TAB
          currentTab === 'status' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" },
              h("div", null,
                h("div", { className: "flex items-center gap-2" },
                  h("span", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded" }, "Pipeline Execution"),
                  h("span", { className: "text-xs text-slate-400" }, "•"),
                  h("span", { className: "text-xs font-mono text-slate-500" }, audioFile ? audioFile.name : 'audio.wav')
                ),
                h("h3", { className: "text-lg font-bold text-slate-900 mt-1" }, "Acoustic Processing Status"),
                h("p", { className: "text-xs text-slate-500" }, "Five-stage industrial acoustic anomaly and tool-wear pipeline")
              ),
              h("div", { className: "flex items-center gap-3" },
                h("div", { className: "text-right" },
                  h("span", { className: "text-[10px] text-slate-400 uppercase font-semibold block" }, "Total Latency"),
                  h("span", { className: "text-sm font-mono font-bold text-purple-700" }, elapsedTime)
                ),
                h("button", { onClick: handleStartInspection, className: "p-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50" },
                  h(Icon, { path: icons.rotate, className: "w-4 h-4" })
                )
              )
            ),

            // Progress bar
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-3" },
              h("div", { className: "flex justify-between items-center text-xs font-semibold" },
                h("span", { className: "text-slate-700" }, isProcessing ? `Processing Stage ${activeStepIndex + 1} of 5...` : "Pipeline Processing Completed"),
                h("span", { className: "font-mono text-purple-700" }, `${processingProgress}%`)
              ),
              h("div", { className: "w-full h-3 bg-purple-100 rounded-full overflow-hidden" },
                h("div", { className: "h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500", style: { width: `${processingProgress}%` } })
              )
            ),

            // 5 Stages
            h("div", { className: "space-y-3" },
              processingSteps.map((step, idx) => {
                const isCompleted = activeStepIndex > idx || (!isProcessing && activeStepIndex === 4);
                const isRunning = isProcessing && activeStepIndex === idx;
                return h("div", {
                  key: step.id,
                  className: `p-5 rounded-2xl border transition-all ${
                    isRunning ? 'bg-purple-50/70 border-purple-300 shadow-md ring-1 ring-purple-400/30' : isCompleted ? 'bg-white border-purple-100 shadow-sm' : 'bg-white/60 border-slate-100 opacity-60'
                  }`
                },
                  h("div", { className: "flex items-start justify-between" },
                    h("div", { className: "flex items-start space-x-4" },
                      h("div", {
                        className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted ? 'bg-emerald-500 text-white' : isRunning ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                        }`
                      }, isCompleted ? h(Icon, { path: icons.check, className: "w-4 h-4" }) : step.id),
                      h("div", null,
                        h("div", { className: "flex items-center gap-2" },
                          h("h4", { className: "font-bold text-sm text-slate-900" }, step.name),
                          h("span", {
                            className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : isRunning ? 'bg-purple-100 text-purple-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                            }`
                          }, isCompleted ? 'Completed' : isRunning ? 'Running' : 'Queued')
                        ),
                        h("p", { className: "text-xs text-slate-500 mt-1 max-w-2xl" }, step.desc)
                      )
                    ),
                    h("div", { className: "text-right font-mono text-xs text-slate-400" },
                      h("span", null, `Latency: ${step.lat}`)
                    )
                  )
                );
              })
            ),

            // Next actions
            h("div", { className: "p-5 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" },
              h("div", { className: "text-xs text-slate-500" }, "Inspect acoustic feature representations or view model inference output."),
              h("div", { className: "flex gap-3 w-full sm:w-auto" },
                h("button", {
                  onClick: () => setCurrentTab('analysis'),
                  className: "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-purple-300 text-purple-700 font-semibold text-xs hover:bg-purple-50 flex items-center justify-center gap-2"
                }, h(Icon, { path: icons.waveform, className: "w-4 h-4" }), "View Audio Analysis"),
                h("button", {
                  onClick: () => setCurrentTab('results'),
                  className: "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
                }, h(Icon, { path: icons.check, className: "w-4 h-4" }), "View Detection Results")
              )
            )
          ),

          // 4. AUDIO ANALYSIS TAB
          currentTab === 'analysis' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
              h("div", null,
                h("h3", { className: "text-lg font-bold text-slate-900" }, "Acoustic Signal & Feature Analysis"),
                h("p", { className: "text-xs text-slate-500" }, "Dual acoustic representations: Log-Mel Spectrogram for Metal Cutter & MFCC features for Industrial Pump")
              ),
              h("div", { className: "flex items-center gap-2" },
                h("span", { className: "text-xs text-slate-500 font-medium" }, "Focus:"),
                h("button", {
                  onClick: () => setSelectedProfile('metal-cutter'),
                  className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800'}`
                }, "Log-Mel Spectrogram"),
                h("button", {
                  onClick: () => setSelectedProfile('industrial-pump'),
                  className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800'}`
                }, "MFCC Features")
              )
            ),

            // Waveform & Controls
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5" },
              h("div", { className: "flex items-center justify-between" },
                h("div", null,
                  h("h4", { className: "font-bold text-sm text-slate-800 flex items-center gap-2" },
                    h(Icon, { path: icons.waveform, className: "w-4 h-4 text-purple-600" }),
                    "Time-Domain Audio Waveform (16,000 Hz Resampled)"
                  ),
                  h("p", { className: "text-xs text-slate-400" }, `File: ${audioFile ? audioFile.name : 'sample.wav'} • Duration: 4.2s`)
                ),
                h("span", { className: "font-mono text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200" },
                  `${(playbackProgress * 0.042).toFixed(2)}s / 4.20s`
                )
              ),

              // Waveform display
              h("div", { className: "h-32 bg-[#0d1326] rounded-xl p-4 flex items-center justify-between gap-1 relative overflow-hidden" },
                h("div", {
                  className: "absolute top-0 bottom-0 w-0.5 bg-purple-400 shadow-[0_0_8px_#a855f7] z-10 transition-all duration-100 pointer-events-none",
                  style: { left: `${playbackProgress}%` }
                }),
                Array.from({ length: 64 }).map((_, i) => {
                  const seed = (Math.sin(i * 0.4) + Math.cos(i * 0.7) * 0.5 + 1.5) / 3;
                  const height = Math.max(12, Math.round(seed * 90));
                  const isPassed = (i / 64) * 100 <= playbackProgress;
                  return h("div", {
                    key: i,
                    className: `flex-1 rounded-full transition-colors ${isPassed ? 'bg-purple-400 shadow-[0_0_4px_#c084fc]' : 'bg-slate-700'}`,
                    style: { height: `${height}%` }
                  });
                })
              ),

              // Playback controls
              h("div", { className: "flex flex-wrap items-center justify-between gap-4 pt-2" },
                h("div", { className: "flex items-center gap-3" },
                  h("button", {
                    onClick: () => setIsPlaying(!isPlaying),
                    className: "w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/30"
                  }, h(Icon, { path: isPlaying ? icons.pause : icons.play, className: "w-5 h-5" })),
                  h("button", {
                    onClick: () => { setIsPlaying(false); setPlaybackProgress(0); },
                    className: "p-2.5 rounded-xl border border-purple-200 text-slate-600 hover:bg-purple-50"
                  }, h(Icon, { path: icons.rotate, className: "w-4 h-4" })),
                  h("span", { className: "text-xs font-mono text-slate-500" }, "Rate: 1.0x (16 kHz Standard)")
                ),
                h("div", { className: "flex items-center gap-3" },
                  h(Icon, { path: icons.volume, className: "w-4 h-4 text-slate-400" }),
                  h("input", {
                    type: "range",
                    min: "0",
                    max: "100",
                    value: volume,
                    onChange: (e) => setVolume(Number(e.target.value)),
                    className: "w-28 accent-purple-600 h-1.5 bg-purple-100 rounded-lg cursor-pointer"
                  }),
                  h("span", { className: "text-xs font-mono text-slate-500 w-8" }, `${volume}%`)
                )
              )
            ),

            // Feature visualizers
            h("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
              // Log-Mel Spectrogram
              h("div", { className: `bg-white p-6 rounded-2xl border shadow-sm ${selectedProfile === 'metal-cutter' ? 'border-purple-500 ring-2 ring-purple-400/20' : 'border-purple-100 opacity-90'}` },
                h("div", { className: "flex items-center justify-between mb-3" },
                  h("div", null,
                    h("span", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded" }, "Metal Cutter Feature"),
                    h("h4", { className: "font-bold text-sm text-slate-900 mt-1" }, "128-bin Log-Mel Spectrogram"),
                    h("p", { className: "text-xs text-slate-400" }, "Time-Frequency acoustic energy (0–8,000 Hz)")
                  ),
                  h("span", { className: "text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200" }, "2D CNN Input")
                ),
                h("div", { className: "h-56 bg-[#0a0f1d] rounded-xl p-3 flex flex-col justify-between overflow-hidden" },
                  h("div", { className: "flex justify-between text-[10px] text-slate-400 font-mono border-b border-slate-800 pb-1" },
                    h("span", null, "8 kHz (Nyquist)"),
                    h("span", null, "Log-Mel Energy (dB)")
                  ),
                  h("div", { className: "grid grid-cols-16 gap-1 h-36 my-auto" },
                    Array.from({ length: 16 }).map((_, c) =>
                      h("div", { key: c, className: "flex flex-col gap-1 h-full" },
                        Array.from({ length: 8 }).map((_, r) => {
                          const intensity = (Math.sin(c * 0.6 + r * 0.8) + Math.cos(c * 0.4) + 2) / 4;
                          return h("div", {
                            key: r,
                            className: `flex-1 rounded-sm ${intensity > 0.65 ? 'bg-amber-400' : intensity > 0.4 ? 'bg-purple-600' : 'bg-indigo-950/80'}`
                          });
                        })
                      )
                    )
                  ),
                  h("div", { className: "flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-1" },
                    h("span", null, "0.0s"),
                    h("span", null, "Time Axis"),
                    h("span", null, "4.2s")
                  )
                ),
                h("p", { className: "text-xs text-slate-500 mt-3" }, "Tool-wear acoustic harmonics show distinct friction peaks in the 2.5 kHz - 4.5 kHz band.")
              ),

              // MFCC Matrix
              h("div", { className: `bg-white p-6 rounded-2xl border shadow-sm ${selectedProfile === 'industrial-pump' ? 'border-purple-500 ring-2 ring-purple-400/20' : 'border-purple-100 opacity-90'}` },
                h("div", { className: "flex items-center justify-between mb-3" },
                  h("div", null,
                    h("span", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded" }, "Industrial Pump Feature"),
                    h("h4", { className: "font-bold text-sm text-slate-900 mt-1" }, "MFCC Feature Distribution"),
                    h("p", { className: "text-xs text-slate-400" }, "13 Mel-Frequency Cepstral Coefficients")
                  ),
                  h("span", { className: "text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200" }, "IF Input")
                ),
                h("div", { className: "h-56 bg-white rounded-xl p-4 border border-purple-100 flex flex-col justify-between" },
                  h("div", { className: "flex justify-between text-[11px] text-slate-500" },
                    h("span", null, "Coefficients 1 to 13"),
                    h("span", { className: "font-mono text-purple-700" }, "MIMII baseline")
                  ),
                  h("div", { className: "flex items-end justify-between gap-2 h-36 pt-2" },
                    [
                      { c: 'C1', v: 78, n: 72 }, { c: 'C2', v: 65, n: 60 }, { c: 'C3', v: 84, n: 52 },
                      { c: 'C4', v: 70, n: 68 }, { c: 'C5', v: 45, n: 42 }, { c: 'C6', v: 92, n: 55 },
                      { c: 'C7', v: 38, n: 36 }, { c: 'C8', v: 50, n: 48 }, { c: 'C9', v: 32, n: 30 },
                      { c: 'C10', v: 28, n: 25 }, { c: 'C11', v: 24, n: 22 }, { c: 'C12', v: 20, n: 19 }, { c: 'C13', v: 15, n: 15 }
                    ].map((item, idx) =>
                      h("div", { key: idx, className: "flex-1 flex flex-col items-center gap-1" },
                        h("div", { className: "w-full flex items-end justify-center gap-0.5 h-28" },
                          h("div", {
                            className: `w-2.5 rounded-t-sm ${Math.abs(item.v - item.n) > 20 ? 'bg-rose-500' : 'bg-purple-600'}`,
                            style: { height: `${item.v}%` }
                          }),
                          h("div", { className: "w-1.5 bg-slate-300 rounded-t-sm", style: { height: `${item.n}%` } })
                        ),
                        h("span", { className: "text-[10px] text-slate-500 font-mono" }, item.c)
                      )
                    )
                  ),
                  h("div", { className: "flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1" },
                    h("span", { className: "flex items-center gap-1" }, h("span", { className: "w-2 h-2 rounded-full bg-purple-600" }), "Current MFCC"),
                    h("span", { className: "flex items-center gap-1" }, h("span", { className: "w-2 h-2 rounded-full bg-slate-300" }), "Normal Baseline"),
                    h("span", { className: "flex items-center gap-1 text-rose-500" }, h("span", { className: "w-2 h-2 rounded-full bg-rose-500" }), "Spikes")
                  )
                ),
                h("p", { className: "text-xs text-slate-500 mt-3" }, "Coefficients C3 and C6 deviate by >28% from noise baseline (-6, 0, 6dB), triggering anomaly.")
              )
            )
          ),

          // 5. DETECTION RESULTS TAB
          currentTab === 'results' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
              h("div", null,
                h("span", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded" }, "Inference Report"),
                h("h3", { className: "text-lg font-bold text-slate-900 mt-1" }, "Acoustic Diagnostic Results"),
                h("p", { className: "text-xs text-slate-500" }, "Machine model inferences & human-in-the-loop maintenance review")
              ),
              h("div", { className: "flex items-center gap-2" },
                h("span", { className: "text-xs text-slate-500 font-medium" }, "Viewing:"),
                h("div", { className: "bg-purple-50 p-1 rounded-xl border border-purple-200" },
                  h("button", {
                    onClick: () => setSelectedProfile('metal-cutter'),
                    className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white' : 'text-purple-900'}`
                  }, "Metal Cutter"),
                  h("button", {
                    onClick: () => setSelectedProfile('industrial-pump'),
                    className: `px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white' : 'text-purple-900'}`
                  }, "Industrial Pump")
                )
              )
            ),

            // Profile Results
            selectedProfile === 'metal-cutter' ? (
              // Metal Cutter
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-6" },
                h("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-purple-100" },
                  h("div", null,
                    h("span", { className: "text-xs font-semibold text-purple-600 uppercase" }, "PyTorch 2D CNN • Kaggle Dataset"),
                    h("h4", { className: "text-xl font-extrabold text-slate-900 mt-0.5" },
                      "Predicted Tool-Wear Class: ",
                      h("span", {
                        className: `inline-block px-3 py-0.5 rounded-lg ${
                          cutterClass === 'Fresh' ? 'bg-emerald-100 text-emerald-800' : cutterClass === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`
                      }, cutterClass)
                    )
                  ),
                  h("div", { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs" },
                    h("span", { className: "text-[10px] text-slate-400 px-2 font-semibold uppercase" }, "Demo:"),
                    ['Fresh', 'Moderate', 'Broken', 'Base'].map(cls =>
                      h("button", {
                        key: cls,
                        onClick: () => setCutterClass(cls),
                        className: `px-2.5 py-1 rounded-lg font-medium ${cutterClass === cls ? 'bg-purple-600 text-white' : 'text-slate-600'}`
                      }, cls)
                    )
                  )
                ),
                h("div", { className: "space-y-4" },
                  h("h5", { className: "font-bold text-sm text-slate-800" }, "Model Confidence Scores"),
                  h("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
                    [
                      { name: 'Fresh', score: cutterClass === 'Fresh' ? 94.2 : 4.1 },
                      { name: 'Moderate', score: cutterClass === 'Moderate' ? 88.4 : 6.3 },
                      { name: 'Broken', score: cutterClass === 'Broken' ? 95.1 : 3.8 },
                      { name: 'Base', score: cutterClass === 'Base' ? 92.0 : 2.5 }
                    ].map(item =>
                      h("div", { key: item.name, className: "p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-2" },
                        h("div", { className: "flex justify-between text-xs font-semibold" },
                          h("span", null, `${item.name} Blade`),
                          h("span", { className: "font-mono text-purple-700" }, `${item.score}%`)
                        ),
                        h("div", { className: "w-full h-2.5 bg-slate-200 rounded-full overflow-hidden" },
                          h("div", { className: `h-full rounded-full ${item.name === cutterClass ? 'bg-purple-600' : 'bg-slate-400'}`, style: { width: `${item.score}%` } })
                        )
                      )
                    )
                  )
                ),
                h("div", { className: "p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3" },
                  h(Icon, { path: icons.alert, className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }),
                  h("div", null,
                    h("p", { className: "font-bold" }, "Tool-Wear Triage Alert:"),
                    h("p", { className: "mt-0.5" }, cutterClass === 'Moderate' ? 'Blade has reached 68% estimated wear threshold. Flank friction harmonics detected at 3.2 kHz. Resharpen within 20 operating hours.' : 'Acoustic diagnostics operational state verified.')
                  )
                )
              )
            ) : (
              // Industrial Pump
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-6" },
                h("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-purple-100" },
                  h("div", null,
                    h("span", { className: "text-xs font-semibold text-purple-600 uppercase" }, "Isolation Forest • Zenodo MIMII (id_00)"),
                    h("h4", { className: "text-xl font-extrabold text-slate-900 mt-0.5" },
                      "Machine Status: ",
                      h("span", {
                        className: `inline-block px-3 py-0.5 rounded-lg text-sm ${pumpStatus === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`
                      }, pumpStatus === 'Normal' ? "NORMAL OPERATION" : "ANOMALOUS SOUND DETECTED")
                    )
                  ),
                  h("div", { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs" },
                    h("span", { className: "text-[10px] text-slate-400 px-2 font-semibold uppercase" }, "Demo:"),
                    h("button", {
                      onClick: () => { setPumpStatus('Normal'); setPumpAnomalyScore(0.18); },
                      className: `px-3 py-1 rounded-lg ${pumpStatus === 'Normal' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`
                    }, "Normal (+0.18)"),
                    h("button", {
                      onClick: () => { setPumpStatus('Anomalous'); setPumpAnomalyScore(-0.28); },
                      className: `px-3 py-1 rounded-lg ${pumpStatus === 'Anomalous' ? 'bg-rose-600 text-white' : 'text-slate-600'}`
                    }, "Anomalous (-0.28)")
                  )
                ),
                h("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5" },
                  h("div", { className: "p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2" },
                    h("span", { className: "text-xs text-slate-500 font-semibold uppercase" }, "Anomaly Score"),
                    h("p", { className: `text-3xl font-mono font-extrabold ${pumpAnomalyScore < -0.05 ? 'text-rose-600' : 'text-emerald-600'}` },
                      pumpAnomalyScore > 0 ? `+${pumpAnomalyScore.toFixed(2)}` : pumpAnomalyScore.toFixed(2)
                    ),
                    h("p", { className: "text-[11px] text-slate-500" }, "Decision threshold: -0.05")
                  ),
                  h("div", { className: "p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2" },
                    h("span", { className: "text-xs text-slate-500 font-semibold uppercase" }, "SNR Baseline"),
                    h("p", { className: "text-2xl font-mono font-extrabold text-slate-900" }, "0 dB SNR"),
                    h("p", { className: "text-[11px] text-slate-500" }, "Tested across -6 dB, 0 dB, +6 dB noise")
                  ),
                  h("div", { className: "p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2" },
                    h("span", { className: "text-xs text-slate-500 font-semibold uppercase" }, "Confidence"),
                    h("p", { className: "text-2xl font-mono font-extrabold text-purple-700" }, "96.4%"),
                    h("p", { className: "text-[11px] text-slate-500" }, "ROC-AUC: 0.941")
                  )
                ),
                h("div", { className: `p-4 rounded-xl border flex items-start space-x-3 text-xs ${pumpStatus === 'Anomalous' ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'}` },
                  h(Icon, { path: pumpStatus === 'Anomalous' ? icons.alert : icons.check, className: `w-5 h-5 ${pumpStatus === 'Anomalous' ? 'text-rose-600' : 'text-emerald-600'} shrink-0 mt-0.5` }),
                  h("div", null,
                    h("p", { className: "font-bold" }, "Detection Summary:"),
                    h("p", { className: "mt-0.5" }, pumpStatus === 'Anomalous' ? 'Acoustic deviation exceeds normal threshold (-0.28 vs -0.05). MFCC temporal coefficients reveal cavitation pulses in fluid pump id_00.' : 'Acoustic signature is fully aligned with normal operating sound.')
                  )
                )
              )
            ),

            // Technician Review Section
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5" },
              h("div", { className: "flex items-center justify-between pb-3 border-b border-purple-100" },
                h("div", null,
                  h("h4", { className: "font-bold text-base text-slate-900 flex items-center gap-2" },
                    h(Icon, { path: icons.user, className: "w-5 h-5 text-purple-600" }),
                    "Technician Maintenance Review & Sign-Off"
                  ),
                  h("p", { className: "text-xs text-slate-500" }, "Standardized human-in-the-loop audit for predictive maintenance triage")
                ),
                h("span", { className: "text-xs text-slate-500 font-mono" }, "Auditor: Eng. Umm-e-Kalsoom")
              ),
              reviewSubmitted && h("div", { className: "p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex justify-between" },
                h("span", { className: "flex items-center gap-2 font-medium" },
                  h(Icon, { path: icons.check, className: "w-4 h-4 text-emerald-600" }),
                  `Review signed off! Status: ${reviewDecision}`
                ),
                h("button", { onClick: () => setReviewSubmitted(false), className: "underline text-emerald-700" }, "Edit")
              ),
              h("div", { className: "space-y-4" },
                h("div", null,
                  h("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2" }, "Review Decision"),
                  h("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" },
                    [
                      { id: 'Approved', label: 'Approve Normal Operation', desc: 'Clear for production use' },
                      { id: 'Secondary Audit', label: 'Request Secondary Audit', desc: 'Repeat acoustic scan in 2 hrs' },
                      { id: 'Flagged Maintenance', label: 'Flag for Maintenance', desc: 'Schedule blade swap / pump overhaul' }
                    ].map(opt =>
                      h("div", {
                        key: opt.id,
                        onClick: () => setReviewDecision(opt.id),
                        className: `p-3.5 rounded-xl border cursor-pointer transition-all ${
                          reviewDecision === opt.id ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600' : 'border-slate-200 bg-white'
                        }`
                      },
                        h("div", { className: "flex items-center justify-between" },
                          h("span", { className: "text-xs font-bold text-slate-800" }, opt.label),
                          h("div", { className: `w-4 h-4 rounded-full border-2 flex items-center justify-center ${reviewDecision === opt.id ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}` },
                            reviewDecision === opt.id && h("div", { className: "w-1.5 h-1.5 bg-white rounded-full" })
                          )
                        ),
                        h("p", { className: "text-[11px] text-slate-500 mt-1" }, opt.desc)
                      )
                    )
                  )
                ),
                h("div", null,
                  h("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1" }, "Technician Audit Remarks & Notes"),
                  h("textarea", {
                    value: reviewNotes,
                    onChange: (e) => setReviewNotes(e.target.value),
                    rows: 3,
                    className: "w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  })
                ),
                h("div", { className: "flex items-center justify-between pt-2" },
                  h("span", { className: "text-[11px] text-slate-400 font-mono" }, `Timestamp: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`),
                  h("button", {
                    onClick: () => setReviewSubmitted(true),
                    className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2"
                  }, h(Icon, { path: icons.save, className: "w-4 h-4" }), "Submit Maintenance Sign-Off")
                )
              )
            )
          ),

          // 6. REPORTS & HISTORY TAB
          currentTab === 'reports' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" },
              h("div", null,
                h("h3", { className: "text-lg font-bold text-slate-900" }, "Acoustic Inspection Reports & Audit History"),
                h("p", { className: "text-xs text-slate-500" }, "Comprehensive log of machine acoustic scans, wear assessments, and technician reviews")
              ),
              h("button", {
                onClick: () => {
                  const csvContent = "data:text/csv;charset=utf-8,InspectionID,MachineProfile,MachineID,Timestamp,Status,Confidence,Review\n"
                    + inspections.map(e => `${e.id},${e.machineProfile},${e.machineId},"${e.timestamp}",${e.resultStatus},${e.confidence}%,${e.reviewStatus}`).join("\n");
                  const link = document.createElement("a");
                  link.setAttribute("href", encodeURI(csvContent));
                  link.setAttribute("download", `factory_ear_inspections_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                },
                className: "px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center gap-2"
              }, h(Icon, { path: icons.download, className: "w-4 h-4" }), "Export CSV Report")
            ),

            // Search & Filters
            h("div", { className: "bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4" },
              h("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" },
                h("div", { className: "relative" },
                  h(Icon, { path: icons.search, className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }),
                  h("input", {
                    type: "text",
                    placeholder: "Search ID, machine, operator...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  })
                ),
                h("select", {
                  value: filterProfile,
                  onChange: (e) => setFilterProfile(e.target.value),
                  className: "w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                },
                  h("option", { value: "all" }, "All Machine Profiles"),
                  h("option", { value: "metal-cutter" }, "Metal Cutter (2D CNN)"),
                  h("option", { value: "industrial-pump" }, "Industrial Pump (IF)")
                ),
                h("select", {
                  value: filterStatus,
                  onChange: (e) => setFilterStatus(e.target.value),
                  className: "w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                },
                  h("option", { value: "all" }, "All Detection Statuses"),
                  h("option", { value: "normal" }, "Normal / Fresh"),
                  h("option", { value: "anomaly" }, "Anomalies & Wear Alerts")
                ),
                h("select", {
                  value: filterReview,
                  onChange: (e) => setFilterReview(e.target.value),
                  className: "w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                },
                  h("option", { value: "all" }, "All Review States"),
                  h("option", { value: "Approved" }, "Approved"),
                  h("option", { value: "Pending Review" }, "Pending Review"),
                  h("option", { value: "Flagged" }, "Flagged Maintenance")
                )
              ),
              h("div", { className: "text-xs text-slate-500 pt-2 border-t border-purple-50 flex justify-between" },
                h("span", null, "Filtered records"),
                h("span", { className: "font-semibold text-purple-700" }, `${inspections.length} records available`)
              )
            ),

            // History table
            h("div", { className: "bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden" },
              h("div", { className: "overflow-x-auto" },
                h("table", { className: "w-full text-left text-xs" },
                  h("thead", { className: "bg-purple-50/50 border-b border-purple-100 text-slate-500 uppercase text-[10px]" },
                    h("tr", null,
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Inspection ID"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Machine"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Date"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Status"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Confidence"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Review"),
                      h("th", { className: "py-3.5 px-4 font-semibold" }, "Technician"),
                      h("th", { className: "py-3.5 px-4 font-semibold text-right" }, "Actions")
                    )
                  ),
                  h("tbody", { className: "divide-y divide-purple-50" },
                    inspections
                      .filter(row => {
                        const mSearch = row.id.toLowerCase().includes(searchQuery.toLowerCase()) || row.machineId.toLowerCase().includes(searchQuery.toLowerCase()) || row.operator.toLowerCase().includes(searchQuery.toLowerCase());
                        const mProf = filterProfile === 'all' || row.machineProfile === filterProfile;
                        const mStat = filterStatus === 'all' || (filterStatus === 'normal' ? !row.isAnomaly : row.isAnomaly);
                        const mRev = filterReview === 'all' || row.reviewStatus === filterReview;
                        return mSearch && mProf && mStat && mRev;
                      })
                      .map(row =>
                        h("tr", { key: row.id, className: "hover:bg-purple-50/40" },
                          h("td", { className: "py-3.5 px-4 font-mono font-medium" }, row.id),
                          h("td", { className: "py-3.5 px-4" },
                            h("span", { className: "font-semibold block" }, row.machineId),
                            h("span", { className: "text-[11px] text-slate-400 capitalize" }, row.machineProfile.replace('-', ' '))
                          ),
                          h("td", { className: "py-3.5 px-4 text-slate-500" }, row.timestamp),
                          h("td", { className: "py-3.5 px-4" },
                            h("span", {
                              className: `inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                row.resultStatus.includes('Normal') || row.resultStatus.includes('Fresh')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : row.resultStatus.includes('Moderate')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`
                            }, row.resultStatus)
                          ),
                          h("td", { className: "py-3.5 px-4 font-mono font-semibold" }, `${row.confidence}%`),
                          h("td", { className: "py-3.5 px-4" },
                            h("span", {
                              className: `inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                                row.reviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`
                            }, row.reviewStatus)
                          ),
                          h("td", { className: "py-3.5 px-4 text-slate-600" }, row.operator),
                          h("td", { className: "py-3.5 px-4 text-right" },
                            h("button", {
                              onClick: () => { setSelectedProfile(row.machineProfile); setCurrentTab('results'); },
                              className: "px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs"
                            }, "View Details")
                          )
                        )
                      )
                  )
                )
              )
            )
          ),

          // 7. SETTINGS TAB
          currentTab === 'settings' && h("div", { className: "space-y-6" },
            h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" },
              h("div", null,
                h("h3", { className: "text-lg font-bold text-slate-900" }, "System & Diagnostics Settings"),
                h("p", { className: "text-xs text-slate-500" }, "Configure acoustic sampling parameters, sensitivity thresholds, and technician profile")
              ),
              settingsSaved && h("span", { className: "text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5" },
                h(Icon, { path: icons.check, className: "w-4 h-4 text-emerald-600" }),
                "Settings saved successfully!"
              )
            ),

            h("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
              // Parameters
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5" },
                h("h4", { className: "font-bold text-sm text-slate-800 pb-2 border-b border-purple-100 flex items-center gap-2" },
                  h(Icon, { path: icons.settings, className: "w-4 h-4 text-purple-600" }),
                  "Acoustic Engine Parameters"
                ),
                h("div", { className: "space-y-4 text-xs" },
                  h("div", null,
                    h("label", { className: "font-bold text-slate-700 block mb-1" }, "Default Startup Machine Profile"),
                    h("select", {
                      value: defaultProfile,
                      onChange: (e) => setDefaultProfile(e.target.value),
                      className: "w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    },
                      h("option", { value: "metal-cutter" }, "Profile A: Metal Cutter (2D CNN Tool-Wear)"),
                      h("option", { value: "industrial-pump" }, "Profile B: Industrial Pump (Isolation Forest Anomaly)")
                    )
                  ),
                  h("div", null,
                    h("label", { className: "font-bold text-slate-700 block mb-1" }, "Audio Resampling Target"),
                    h("input", {
                      type: "text",
                      disabled: true,
                      value: "16,000 Hz (Nyquist target for Kaggle / MIMII DSP)",
                      className: "w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono"
                    })
                  ),
                  h("div", null,
                    h("div", { className: "flex justify-between items-center mb-1" },
                      h("label", { className: "font-bold text-slate-700" }, "Anomaly Decision Threshold"),
                      h("span", { className: "font-mono text-purple-700 font-semibold" }, anomalyThreshold.toFixed(2))
                    ),
                    h("input", {
                      type: "range",
                      min: "-0.50",
                      max: "0.00",
                      step: "0.01",
                      value: anomalyThreshold,
                      onChange: (e) => setAnomalyThreshold(Number(e.target.value)),
                      className: "w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer"
                    }),
                    h("div", { className: "flex justify-between text-[10px] text-slate-400 mt-1" },
                      h("span", null, "Strict (-0.50)"),
                      h("span", null, "Baseline (-0.05)"),
                      h("span", null, "Sensitive (0.00)")
                    )
                  )
                )
              ),

              // Profile Info
              h("div", { className: "bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5" },
                h("h4", { className: "font-bold text-sm text-slate-800 pb-2 border-b border-purple-100 flex items-center gap-2" },
                  h(Icon, { path: icons.user, className: "w-4 h-4 text-purple-600" }),
                  "Auditor & Facility Profile"
                ),
                h("div", { className: "space-y-4 text-xs" },
                  h("div", null,
                    h("label", { className: "font-bold text-slate-700 block mb-1" }, "Technician Name"),
                    h("input", {
                      type: "text",
                      defaultValue: "Umm-e-Kalsoom",
                      className: "w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    })
                  ),
                  h("div", null,
                    h("label", { className: "font-bold text-slate-700 block mb-1" }, "Role / Designation"),
                    h("input", {
                      type: "text",
                      defaultValue: "Lead Reliability & Acoustic Diagnostics Engineer",
                      className: "w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    })
                  ),
                  h("div", null,
                    h("label", { className: "font-bold text-slate-700 block mb-1" }, "FastAPI Backend Gateway URL"),
                    h("input", {
                      type: "text",
                      value: apiEndpoint,
                      onChange: (e) => setApiEndpoint(e.target.value),
                      className: "w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    })
                  )
                )
              )
            ),

            h("div", { className: "flex justify-end pt-2" },
              h("button", {
                onClick: () => {
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 3000);
                },
                className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 flex items-center gap-2"
              }, h(Icon, { path: icons.save, className: "w-4 h-4" }), "Save System Settings")
            )
          )
        )
      )
    );
  }

  // Mount to #root if Vite has not mounted
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.querySelector('#loading-fallback')) {
        const reactRoot = window.ReactDOM.createRoot(root);
        reactRoot.render(h(StandaloneApp));
      }
    }, 100);
  });
})();
