import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Upload,
  Activity,
  Waveform,
  CheckCircle2,
  AlertTriangle,
  History,
  Settings as SettingsIcon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Cpu,
  Layers,
  Radio,
  Bell,
  User,
  ShieldCheck,
  ChevronRight,
  FileAudio,
  Sliders,
  TrendingUp,
  HardDrive,
  BarChart3,
  Server,
  Zap,
  Save,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { 
  NavigationTab, 
  MachineProfile, 
  ToolWearClass, 
  AudioMetadata, 
  InspectionRecord,
  ProcessingStep 
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedProfile, setSelectedProfile] = useState<MachineProfile>('metal-cutter');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Audio upload state
  const [audioFile, setAudioFile] = useState<AudioMetadata | null>({
    name: 'cutting_tool_speed2_sample07.wav',
    size: '1.84 MB',
    duration: '4.2s',
    sampleRate: '16,000 Hz',
    format: 'WAV (PCM 16-bit)',
    channels: '1 (Mono)'
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(100);
  const [activeStepIndex, setActiveStepIndex] = useState(4);
  const [elapsedTime, setElapsedTime] = useState('0.82s');

  // Audio analysis playback simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(38);
  const [volume, setVolume] = useState(80);

  // Results state
  const [cutterClass, setCutterClass] = useState<ToolWearClass>('Moderate');
  const [pumpStatus, setPumpStatus] = useState<'Normal' | 'Anomalous'>('Anomalous');
  const [pumpAnomalyScore, setPumpAnomalyScore] = useState(-0.28);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Secondary Audit' | 'Flagged Maintenance'>('Flagged Maintenance');
  const [reviewNotes, setReviewNotes] = useState('Acoustic harmonics show distinct tool flank wear. Resharpening or blade replacement recommended within 20 operating hours.');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // History & Reports State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProfile, setFilterProfile] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterReview, setFilterReview] = useState<string>('all');

  // Settings state
  const [defaultProfile, setDefaultProfile] = useState<MachineProfile>('metal-cutter');
  const [anomalyThreshold, setAnomalyThreshold] = useState(-0.05);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api/v1');

  // Sample inspection history
  const [inspections, setInspections] = useState<InspectionRecord[]>([
    {
      id: 'INSP-2026-9841',
      timestamp: '2026-11-04 10:42 AM',
      machineProfile: 'metal-cutter',
      machineId: 'MC-ALPHA-04',
      resultStatus: 'Moderate Wear',
      isAnomaly: true,
      scoreOrClass: 'Moderate',
      confidence: 88.4,
      reviewStatus: 'Flagged',
      operator: 'Umm-e-Kalsoom',
      notes: 'Blade acoustic resonance elevated.'
    },
    {
      id: 'INSP-2026-9840',
      timestamp: '2026-11-04 09:15 AM',
      machineProfile: 'industrial-pump',
      machineId: 'PUMP-ZENODO-00',
      resultStatus: 'Normal Operation',
      isAnomaly: false,
      scoreOrClass: '+0.18 Score',
      confidence: 96.2,
      reviewStatus: 'Approved',
      operator: 'Umm-e-Kalsoom',
      notes: 'Clean baseline acoustic profile.'
    },
    {
      id: 'INSP-2026-9839',
      timestamp: '2026-11-03 04:30 PM',
      machineProfile: 'metal-cutter',
      machineId: 'MC-ALPHA-02',
      resultStatus: 'Fresh Tool',
      isAnomaly: false,
      scoreOrClass: 'Fresh',
      confidence: 97.1,
      reviewStatus: 'Approved',
      operator: 'David Vance',
      notes: 'New blade acoustic calibration.'
    },
    {
      id: 'INSP-2026-9838',
      timestamp: '2026-11-03 02:10 PM',
      machineProfile: 'industrial-pump',
      machineId: 'PUMP-ZENODO-00',
      resultStatus: 'Cavitation Anomaly',
      isAnomaly: true,
      scoreOrClass: '-0.34 Score',
      confidence: 91.8,
      reviewStatus: 'Pending Review',
      operator: 'Umm-e-Kalsoom',
      notes: 'Acoustic signature matched cavitation dataset.'
    },
    {
      id: 'INSP-2026-9837',
      timestamp: '2026-11-03 11:00 AM',
      machineProfile: 'metal-cutter',
      machineId: 'MC-ALPHA-01',
      resultStatus: 'Broken Blade',
      isAnomaly: true,
      scoreOrClass: 'Broken',
      confidence: 95.0,
      reviewStatus: 'Flagged',
      operator: 'Marcus Brody',
      notes: 'Immediate blade swap executed.'
    },
    {
      id: 'INSP-2026-9836',
      timestamp: '2026-11-02 03:22 PM',
      machineProfile: 'industrial-pump',
      machineId: 'PUMP-ZENODO-01',
      resultStatus: 'Normal Operation',
      isAnomaly: false,
      scoreOrClass: '+0.12 Score',
      confidence: 94.5,
      reviewStatus: 'Approved',
      operator: 'Umm-e-Kalsoom'
    },
    {
      id: 'INSP-2026-9835',
      timestamp: '2026-11-02 01:14 PM',
      machineProfile: 'metal-cutter',
      machineId: 'MC-BETA-03',
      resultStatus: 'Base Standard',
      isAnomaly: false,
      scoreOrClass: 'Base',
      confidence: 92.4,
      reviewStatus: 'Approved',
      operator: 'David Vance'
    },
    {
      id: 'INSP-2026-9834',
      timestamp: '2026-11-01 10:05 AM',
      machineProfile: 'industrial-pump',
      machineId: 'PUMP-ZENODO-00',
      resultStatus: 'Bearing Friction Anomaly',
      isAnomaly: true,
      scoreOrClass: '-0.21 Score',
      confidence: 89.0,
      reviewStatus: 'Approved',
      operator: 'Umm-e-Kalsoom'
    }
  ]);

  // Audio Playback simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
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

  // Handle WAV file drag-and-drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadError(null);
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.wav') && file.type !== 'audio/wav' && file.type !== 'audio/x-wav') {
      setUploadError('Invalid file type: Factory Ear strictly requires standard 16-bit uncompressed .WAV audio recordings.');
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setAudioFile({
      name: file.name,
      size: fileSizeMB,
      duration: '4.2s (Standard)',
      sampleRate: '16,000 Hz target',
      format: 'WAV (PCM 16-bit)',
      channels: '1 (Mono)'
    });
  };

  // Start Inspection Pipeline Simulation
  const handleStartInspection = () => {
    if (!audioFile) {
      setUploadError('Please select or upload a valid .WAV audio file first.');
      return;
    }
    setCurrentTab('status');
    setIsProcessing(true);
    setProcessingProgress(0);
    setActiveStepIndex(0);

    // Simulate pipeline progression across the 5 required stages
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= 4) {
        setActiveStepIndex(currentStep);
        setProcessingProgress(Math.round(((currentStep + 1) / 5) * 100));
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setProcessingProgress(100);
        setElapsedTime('0.82s');
      }
    }, 600);
  };

  // Processing stages definition
  const processingSteps: ProcessingStep[] = [
    {
      id: 1,
      name: 'Audio Validation',
      description: 'Verifying 16-bit PCM header format, mono channel integrity, and clip length sanity.',
      status: activeStepIndex > 0 ? 'completed' : activeStepIndex === 0 ? 'in-progress' : 'pending',
      latency: '0.04s'
    },
    {
      id: 2,
      name: 'Audio Resampling (16,000 Hz)',
      description: 'Applying anti-aliasing low-pass filter and resampling audio array to standard 16 kHz DSP grid.',
      status: activeStepIndex > 1 ? 'completed' : activeStepIndex === 1 ? 'in-progress' : 'pending',
      latency: '0.12s'
    },
    {
      id: 3,
      name: 'Feature Extraction',
      description: selectedProfile === 'metal-cutter' 
        ? 'Extracting 128-bin Log-Mel Spectrogram matrix with Librosa STFT (2048 n_fft, 512 hop_length).'
        : 'Computing 1D Mel-Frequency Cepstral Coefficients (MFCCs) tabular feature distribution across frequency bins.',
      status: activeStepIndex > 2 ? 'completed' : activeStepIndex === 2 ? 'in-progress' : 'pending',
      latency: '0.29s'
    },
    {
      id: 4,
      name: 'ML Model Inference',
      description: selectedProfile === 'metal-cutter'
        ? 'PyTorch 2D CNN forward pass across tool wear classes (Fresh, Moderate, Broken, Base).'
        : 'Isolation Forest decision function evaluating acoustic outlier distance against MIMII pump id_00 baseline.',
      status: activeStepIndex > 3 ? 'completed' : activeStepIndex === 3 ? 'in-progress' : 'pending',
      latency: '0.25s'
    },
    {
      id: 5,
      name: 'Result Generation',
      description: 'Compiling anomaly score thresholds, classification confidence scores, and diagnostic audit trail.',
      status: activeStepIndex >= 4 && !isProcessing ? 'completed' : activeStepIndex === 4 ? 'in-progress' : 'pending',
      latency: '0.12s'
    }
  ];

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Audio', icon: Upload },
    { id: 'status', label: 'Processing Status', icon: Activity },
    { id: 'analysis', label: 'Audio Analysis', icon: Waveform },
    { id: 'results', label: 'Detection Results', icon: CheckCircle2 },
    { id: 'reports', label: 'Reports & History', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f3ff] text-slate-800">
      {/* SIDEBAR NAVIGATION - Dark Navy theme */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0f1d] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand / Logo Header */}
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-wide text-white flex items-center gap-1.5">
                  Factory Ear
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700/50">AI DSP</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Acoustic Anomaly & Wear Engine</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Profile Quick Indicator */}
          <div className="px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/60 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Active Machine Profile</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="flex items-center justify-between font-medium text-slate-200">
              <span className="flex items-center gap-1.5">
                {selectedProfile === 'metal-cutter' ? (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    Metal Cutter (2D CNN)
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Industrial Pump (IF)
                  </>
                )}
              </span>
              <button 
                onClick={() => setSelectedProfile(selectedProfile === 'metal-cutter' ? 'industrial-pump' : 'metal-cutter')}
                className="text-[10px] text-purple-400 hover:text-purple-300 underline font-mono cursor-pointer"
                title="Switch Machine Profile"
              >
                Switch
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id as NavigationTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-purple-200" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Plant Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-purple-700/80 text-purple-200 flex items-center justify-center font-bold text-sm ring-2 ring-purple-500/30">
              UK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Eng. Umm-e-Kalsoom</p>
              <p className="text-[11px] text-slate-400 truncate">Lead Reliability Engineer</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Technician Online" />
          </div>
          <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>DSP Core v2.4</span>
            <span className="text-emerald-400">● 16,000 Hz</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                  Industrial Acoustic Workbench
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Dataset: {selectedProfile === 'metal-cutter' ? 'Kaggle Cutting Tool Wear' : 'Zenodo MIMII Pump id_00'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 capitalize mt-0.5">
                {currentTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center space-x-4">
            {/* System Status Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>DSP Engine Online (16 kHz)</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setCurrentTab('results')}
                className="p-2 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 relative transition-colors"
                title="2 Anomaly Alerts Flagged"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
            </div>

            {/* Profile Selection Dropdown */}
            <div className="flex items-center bg-purple-50 p-1 rounded-xl border border-purple-200/60">
              <button
                onClick={() => setSelectedProfile('metal-cutter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProfile === 'metal-cutter'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-900 hover:bg-purple-100/60'
                }`}
              >
                Metal Cutter
              </button>
              <button
                onClick={() => setSelectedProfile('industrial-pump')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProfile === 'industrial-pump'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-900 hover:bg-purple-100/60'
                }`}
              >
                Industrial Pump
              </button>
            </div>
          </div>
        </header>

        {/* SCREEN ROUTING */}
        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* DEMO NOTICE BADGE */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px] uppercase tracking-wider">
                Demo & Prototype Mode
              </span>
              <span>
                Demonstration telemetry and acoustic DSP simulation for proposal verification. Ready for FastAPI ML backend integration.
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] text-purple-700">
              <span>Target Resampling: 16,000 Hz</span>
              <span>•</span>
              <span>Profile: {selectedProfile === 'metal-cutter' ? '2D CNN Wear Model' : 'Isolation Forest Anomaly'}</span>
            </div>
          </div>

          {/* 1. DASHBOARD SCREEN */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Summary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inspections</span>
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900">1,428</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +8.4% from previous shift
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>Metal Cutters: 812</span>
                    <span>Pumps: 616</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Normal Machines</span>
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900">1,356</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      95.0% acoustic baseline adherence
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>MIMII SNR: -6dB, 0dB, 6dB</span>
                    <span className="text-emerald-600 font-medium">Optimal</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected Anomalies</span>
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900">72</p>
                    <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                      <span>5.0% triage alert rate</span>
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>42 Wear alerts</span>
                    <span>30 Pump anomalies</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Machine Health</span>
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900">96.2%</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      Operational acoustic index
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>Mean latency: 0.82s</span>
                    <span className="text-emerald-600 font-medium">Target &lt;1.2s</span>
                  </div>
                </div>
              </div>

              {/* Charts Section: Tool-Wear Trend & Inspection Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool-Wear Trend Chart */}
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Tool-Wear Degradation Trend (Metal Cutter)
                      </h3>
                      <p className="text-xs text-slate-500">Progressive blade degradation over operational cutting hours (Kaggle dataset)</p>
                    </div>
                    <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-200">
                      PyTorch 2D CNN
                    </span>
                  </div>

                  {/* SVG Tool Wear Chart */}
                  <div className="relative pt-4 pb-2">
                    <svg viewBox="0 0 500 220" className="w-full h-52 overflow-visible">
                      <defs>
                        <linearGradient id="wearGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#e2e8f0" />

                      {/* Threshold zones */}
                      <rect x="40" y="30" width="440" height="40" fill="#fee2e2" fillOpacity="0.4" />
                      <text x="475" y="45" fill="#ef4444" fontSize="10" textAnchor="end" fontWeight="600">Broken Threshold</text>

                      <rect x="40" y="70" width="440" height="50" fill="#fef3c7" fillOpacity="0.3" />
                      <text x="475" y="85" fill="#d97706" fontSize="10" textAnchor="end" fontWeight="600">Moderate Wear</text>

                      {/* Area and Line */}
                      <path
                        d="M 50 170 Q 120 165, 180 150 T 280 120 T 360 85 T 450 45"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 170 Q 120 165, 180 150 T 280 120 T 360 85 T 450 45 L 450 180 L 50 180 Z"
                        fill="url(#wearGradient)"
                      />

                      {/* Data markers */}
                      <circle cx="50" cy="170" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="180" cy="150" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="280" cy="120" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="360" cy="85" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="450" cy="45" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />

                      {/* X Axis Labels */}
                      <text x="50" y="200" fill="#64748b" fontSize="11" textAnchor="middle">0h (Fresh)</text>
                      <text x="180" y="200" fill="#64748b" fontSize="11" textAnchor="middle">20h</text>
                      <text x="280" y="200" fill="#64748b" fontSize="11" textAnchor="middle">45h</text>
                      <text x="360" y="200" fill="#64748b" fontSize="11" textAnchor="middle">60h (Moderate)</text>
                      <text x="450" y="200" fill="#64748b" fontSize="11" textAnchor="middle">80h (Broken)</text>

                      {/* Y Axis Labels */}
                      <text x="30" y="35" fill="#94a3b8" fontSize="10" textAnchor="end">1.0</text>
                      <text x="30" y="85" fill="#94a3b8" fontSize="10" textAnchor="end">0.7</text>
                      <text x="30" y="135" fill="#94a3b8" fontSize="10" textAnchor="end">0.4</text>
                      <text x="30" y="180" fill="#94a3b8" fontSize="10" textAnchor="end">0.0</text>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                      Wear Progression Curve
                    </span>
                    <span className="font-medium text-purple-700">Class Balance: F1 0.94 • Precision 0.93</span>
                  </div>
                </div>

                {/* Inspection Activity Chart */}
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        Weekly Acoustic Inspection Activity
                      </h3>
                      <p className="text-xs text-slate-500">Acoustic scans performed per day across Day & Night shifts</p>
                    </div>
                    <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">
                      Target Met
                    </span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                    {[
                      { day: 'Mon', dayShift: 110, nightShift: 95 },
                      { day: 'Tue', dayShift: 130, nightShift: 105 },
                      { day: 'Wed', dayShift: 125, nightShift: 115 },
                      { day: 'Thu', dayShift: 140, nightShift: 110 },
                      { day: 'Fri', dayShift: 155, nightShift: 130 },
                      { day: 'Sat', dayShift: 90, nightShift: 80 },
                      { day: 'Sun', dayShift: 75, nightShift: 65 },
                    ].map((item, index) => {
                      const maxVal = 160;
                      const dayHeight = (item.dayShift / maxVal) * 120;
                      const nightHeight = (item.nightShift / maxVal) * 120;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="w-full flex items-end justify-center gap-1 h-36">
                            <div 
                              className="w-3.5 bg-purple-600 rounded-t-md hover:bg-purple-700 transition-all cursor-pointer relative group" 
                              style={{ height: `${dayHeight}px` }}
                              title={`Day Shift: ${item.dayShift} scans`}
                            />
                            <div 
                              className="w-3.5 bg-purple-300 rounded-t-md hover:bg-purple-400 transition-all cursor-pointer relative group" 
                              style={{ height: `${nightHeight}px` }}
                              title={`Night Shift: ${item.nightShift} scans`}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-purple-600 inline-block"></span>
                        Day Shift
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-purple-300 inline-block"></span>
                        Night Shift
                      </span>
                    </div>
                    <span className="font-medium text-slate-700">Total Scans: 1,428</span>
                  </div>
                </div>
              </div>

              {/* Machine Status & Recent Inspections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Machine Fleet Status */}
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-purple-600" />
                      Machine Fleet Status
                    </h3>
                    <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                      10 Monitored Units
                    </span>
                  </div>

                  {/* Profile A Status */}
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Metal Cutters (Profile A)</span>
                      <span className="text-purple-600">4 Active Assets</span>
                    </div>
                    <p className="text-xs text-slate-500">2D CNN Tool-Wear Degradation Tracker</p>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-purple-100">
                        <span className="block text-emerald-600 font-bold text-sm">3</span>
                        <span className="text-[10px] text-slate-400">Fresh / Base</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-purple-100">
                        <span className="block text-amber-500 font-bold text-sm">1</span>
                        <span className="text-[10px] text-slate-400">Moderate</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-purple-100">
                        <span className="block text-rose-500 font-bold text-sm">0</span>
                        <span className="text-[10px] text-slate-400">Broken</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile B Status */}
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Industrial Pumps (Profile B)</span>
                      <span className="text-purple-600">6 Monitored Assets</span>
                    </div>
                    <p className="text-xs text-slate-500">Isolation Forest Acoustic Anomaly Detector (MIMII id_00)</p>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-purple-100">
                        <span className="block text-emerald-600 font-bold text-sm">5 Normal</span>
                        <span className="text-[10px] text-slate-400">Baseline Noise -6 to 6dB</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-purple-100">
                        <span className="block text-rose-500 font-bold text-sm">1 Flagged</span>
                        <span className="text-[10px] text-slate-400">Cavitation Anomaly</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Run New Acoustic Inspection
                  </button>
                </div>

                {/* Recent Inspections Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        Recent Inspections
                      </h3>
                      <p className="text-xs text-slate-500">Latest acoustic diagnostic runs and technician review states</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('reports')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                      View All Reports →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-purple-100 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="pb-3 font-semibold">Inspection ID</th>
                          <th className="pb-3 font-semibold">Profile & Machine</th>
                          <th className="pb-3 font-semibold">Detection Status</th>
                          <th className="pb-3 font-semibold">Score / Conf</th>
                          <th className="pb-3 font-semibold">Review</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-50">
                        {inspections.slice(0, 5).map((row) => (
                          <tr key={row.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-3 font-mono font-medium text-slate-800">{row.id}</td>
                            <td className="py-3">
                              <div className="font-semibold text-slate-900">{row.machineId}</div>
                              <div className="text-[11px] text-slate-500 capitalize">
                                {row.machineProfile.replace('-', ' ')}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                row.resultStatus.includes('Normal') || row.resultStatus.includes('Fresh') || row.resultStatus.includes('Base')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : row.resultStatus.includes('Moderate')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {row.resultStatus}
                              </span>
                            </td>
                            <td className="py-3 font-mono font-medium text-slate-700">
                              {row.confidence}%
                            </td>
                            <td className="py-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                row.reviewStatus === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.reviewStatus === 'Pending Review'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {row.reviewStatus}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedProfile(row.machineProfile);
                                  setCurrentTab('results');
                                }}
                                className="text-purple-600 hover:text-purple-800 font-semibold"
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. UPLOAD AUDIO SCREEN */}
          {currentTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-bold text-slate-900">Acoustic Audio Upload & Machine Profile</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a standard 16-bit uncompressed .WAV recording from factory machinery for acoustic analysis and wear monitoring.
                  </p>
                </div>
              </div>

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                  <button onClick={() => setUploadError(null)} className="text-rose-600 font-bold hover:underline">Dismiss</button>
                </div>
              )}

              {/* Machine Profile Selection Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Step 1: Select Target Machine Profile
                  </label>
                  <span className="text-xs text-purple-600 font-medium">Dual-Profile Architecture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Profile A: Metal Cutter */}
                  <div
                    onClick={() => setSelectedProfile('metal-cutter')}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedProfile === 'metal-cutter'
                        ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-600/20'
                        : 'border-purple-100 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                        }`}>
                          <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2 py-0.5 rounded">
                            Profile A
                          </span>
                          <h4 className="font-bold text-base text-slate-900 mt-0.5">Metal Cutter</h4>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProfile === 'metal-cutter' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                      }`}>
                        {selectedProfile === 'metal-cutter' && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">ML Model Architecture:</span>
                        <span className="font-semibold text-slate-800">2D CNN (PyTorch)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">Diagnostic Task:</span>
                        <span className="font-semibold text-slate-800">Tool-Wear Classification</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">Feature Extraction:</span>
                        <span className="font-semibold text-slate-800">128-bin Log-Mel Spectrogram</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-slate-500 block mb-1">Target Degradation Classes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Fresh', 'Moderate', 'Broken', 'Base'].map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900 text-[11px] font-mono">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile B: Industrial Pump */}
                  <div
                    onClick={() => setSelectedProfile('industrial-pump')}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedProfile === 'industrial-pump'
                        ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-600/20'
                        : 'border-purple-100 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                        }`}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2 py-0.5 rounded">
                            Profile B
                          </span>
                          <h4 className="font-bold text-base text-slate-900 mt-0.5">Industrial Pump</h4>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProfile === 'industrial-pump' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                      }`}>
                        {selectedProfile === 'industrial-pump' && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">ML Model Architecture:</span>
                        <span className="font-semibold text-slate-800">Isolation Forest (Scikit-Learn)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">Diagnostic Task:</span>
                        <span className="font-semibold text-slate-800">Acoustic Anomaly Detection</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-purple-100/60">
                        <span className="text-slate-500">Feature Extraction:</span>
                        <span className="font-semibold text-slate-800">1D MFCC Tabular Vectors</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-slate-500 block mb-1">Target Anomaly Classes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Normal Operation', 'Anomalous Sound'].map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900 text-[11px] font-mono">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drag and Drop Upload Area */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Step 2: Upload Machine Audio (.WAV)
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`p-10 rounded-2xl border-2 border-dashed text-center transition-all ${
                    isDragging
                      ? 'border-purple-600 bg-purple-100/60 scale-[1.005]'
                      : 'border-purple-200 bg-white hover:border-purple-400'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <FileAudio className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Drag and drop your machine .WAV audio recording here
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Standard 16-bit PCM WAV audio recordings supported (16 kHz resampled automatically)
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <label className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-colors">
                      Browse WAV Files
                      <input
                        type="file"
                        accept=".wav,audio/wav,audio/x-wav"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile({
                          name: selectedProfile === 'metal-cutter' 
                            ? 'cutting_tool_speed2_sample07.wav' 
                            : 'pump_id00_normal_0dB_001.wav',
                          size: '1.84 MB',
                          duration: '4.2s',
                          sampleRate: '16,000 Hz',
                          format: 'WAV (PCM 16-bit)',
                          channels: '1 (Mono)'
                        });
                        setUploadError(null);
                      }}
                      className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition-colors border border-purple-200"
                    >
                      Load Sample WAV
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Audio File Card */}
              {audioFile && (
                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{audioFile.name}</h4>
                        <p className="text-xs text-slate-400">{audioFile.format} • {audioFile.channels}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                      WAV Validated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">File Size</span>
                      <span className="font-medium text-slate-800">{audioFile.size}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                      <span className="font-medium text-slate-800">{audioFile.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sampling Target</span>
                      <span className="font-medium text-purple-700">{audioFile.sampleRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Profile</span>
                      <span className="font-medium text-slate-800 capitalize">{selectedProfile.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Start Inspection Action Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      No client-side fake inferences. Audio stream prepared for ML pipeline.
                    </div>
                    <button
                      onClick={handleStartInspection}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Zap className="w-4 h-4" /> Start Acoustic Inspection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. PROCESSING STATUS SCREEN */}
          {currentTab === 'status' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Pipeline Execution
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">Audio: {audioFile?.name || 'sample.wav'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Acoustic Processing Status</h3>
                  <p className="text-xs text-slate-500">
                    Five-stage industrial acoustic anomaly and wear monitoring pipeline execution
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Elapsed Time</span>
                    <span className="text-sm font-mono font-bold text-purple-700">{elapsedTime}</span>
                  </div>
                  <button
                    onClick={handleStartInspection}
                    className="p-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                    title="Restart Pipeline Simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
                        Processing Stage {activeStepIndex + 1} of 5...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Pipeline Processing Completed
                      </>
                    )}
                  </span>
                  <span className="font-mono text-purple-700">{processingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>

              {/* 5 Processing Stages Breakdown */}
              <div className="space-y-3">
                {processingSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      step.status === 'in-progress'
                        ? 'bg-purple-50/70 border-purple-300 shadow-md ring-1 ring-purple-400/30'
                        : step.status === 'completed'
                        ? 'bg-white border-purple-100 shadow-sm'
                        : 'bg-white/60 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          step.status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : step.status === 'in-progress'
                            ? 'bg-purple-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            step.id
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{step.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              step.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : step.status === 'in-progress'
                                ? 'bg-purple-100 text-purple-700 animate-pulse'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'Running' : 'Queued'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{step.description}</p>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs text-slate-400">
                        <span>Latency: {step.latency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Navigation After Processing */}
              <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Ready to inspect extracted acoustic spectrograms or view the ML classification report.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setCurrentTab('analysis')}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-purple-300 text-purple-700 font-semibold text-xs hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Waveform className="w-4 h-4" /> View Audio Analysis
                  </button>
                  <button
                    onClick={() => setCurrentTab('results')}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> View Detection Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. AUDIO ANALYSIS SCREEN */}
          {currentTab === 'analysis' && (
            <div className="space-y-6">
              {/* Header and profile switcher */}
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Acoustic Signal & Feature Analysis</h3>
                  <p className="text-xs text-slate-500">
                    Dual acoustic representations: Log-Mel Spectrogram for Metal Cutter & MFCC features for Industrial Pump
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Visualization Focus:</span>
                  <button
                    onClick={() => setSelectedProfile('metal-cutter')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedProfile === 'metal-cutter'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                    }`}
                  >
                    Log-Mel Spectrogram
                  </button>
                  <button
                    onClick={() => setSelectedProfile('industrial-pump')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedProfile === 'industrial-pump'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                    }`}
                  >
                    MFCC Features
                  </button>
                </div>
              </div>

              {/* Audio Waveform Visualization & Playback Controls */}
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Waveform className="w-4 h-4 text-purple-600" />
                      Time-Domain Audio Waveform (16,000 Hz Resampled)
                    </h4>
                    <p className="text-xs text-slate-400">File: {audioFile?.name || 'sample.wav'} • Duration: 4.2s</p>
                  </div>
                  <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                    {(playbackProgress * 0.042).toFixed(2)}s / 4.20s
                  </span>
                </div>

                {/* Waveform Canvas Simulation */}
                <div className="h-32 bg-[#0d1326] rounded-xl p-4 flex items-center justify-between gap-1 relative overflow-hidden">
                  {/* Playhead line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-purple-400 shadow-[0_0_8px_#a855f7] z-10 transition-all duration-100 pointer-events-none"
                    style={{ left: `${playbackProgress}%` }}
                  />

                  {/* Render simulated waveform bars */}
                  {Array.from({ length: 64 }).map((_, i) => {
                    const seed = (Math.sin(i * 0.4) + Math.cos(i * 0.7) * 0.5 + 1.5) / 3;
                    const height = Math.max(12, Math.round(seed * 90));
                    const isPassed = (i / 64) * 100 <= playbackProgress;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors ${
                          isPassed ? 'bg-purple-400 shadow-[0_0_4px_#c084fc]' : 'bg-slate-700'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>

                {/* Audio Playback Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition-transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setPlaybackProgress(0);
                      }}
                      className="p-2.5 rounded-xl border border-purple-200 text-slate-600 hover:bg-purple-50 transition-colors"
                      title="Reset Playback"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-slate-500">
                      Rate: 1.0x (16 kHz Standard)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-28 accent-purple-600 h-1.5 bg-purple-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500 w-8">{volume}%</span>
                  </div>
                </div>
              </div>

              {/* Machine-Specific Feature Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Log-Mel Spectrogram (Metal Cutter Feature) */}
                <div className={`bg-white p-6 rounded-2xl border shadow-sm transition-all ${
                  selectedProfile === 'metal-cutter' ? 'border-purple-500 ring-2 ring-purple-400/20' : 'border-purple-100 opacity-90'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Metal Cutter Feature
                        </span>
                        {selectedProfile === 'metal-cutter' && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active Profile
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">128-bin Log-Mel Spectrogram</h4>
                      <p className="text-xs text-slate-400">Time-Frequency acoustic energy representation (0–8,000 Hz)</p>
                    </div>
                    <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      PyTorch 2D CNN Input
                    </span>
                  </div>

                  {/* Spectrogram Grid Visualizer */}
                  <div className="h-56 bg-[#0a0f1d] rounded-xl p-3 flex flex-col justify-between overflow-hidden relative">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono border-b border-slate-800 pb-1">
                      <span>8 kHz (Nyquist)</span>
                      <span>Log-Mel Energy (dB)</span>
                    </div>

                    {/* Heatmap Matrix Simulation */}
                    <div className="grid grid-cols-16 gap-1 h-36 my-auto">
                      {Array.from({ length: 16 }).map((_, col) => (
                        <div key={col} className="flex flex-col gap-1 h-full">
                          {Array.from({ length: 8 }).map((_, row) => {
                            // Compute realistic tool-wear acoustic heat pattern
                            const intensity = (Math.sin(col * 0.6 + row * 0.8) + Math.cos(col * 0.4) + 2) / 4;
                            const isHot = intensity > 0.65;
                            const isWarm = intensity > 0.4;
                            return (
                              <div
                                key={row}
                                className={`flex-1 rounded-sm ${
                                  isHot
                                    ? 'bg-amber-400'
                                    : isWarm
                                    ? 'bg-purple-600'
                                    : 'bg-indigo-950/80'
                                }`}
                                title={`Bin: ${8 - row}, Time: ${col * 0.25}s, Int: ${(intensity * 100).toFixed(0)}%`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-1">
                      <span>0.0s</span>
                      <span>Time Axis</span>
                      <span>4.2s</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    Acoustic harmonics highlight friction peaks in the 2.5 kHz - 4.5 kHz band corresponding to tool flank contact.
                  </p>
                </div>

                {/* 2. MFCC Features (Industrial Pump Feature) */}
                <div className={`bg-white p-6 rounded-2xl border shadow-sm transition-all ${
                  selectedProfile === 'industrial-pump' ? 'border-purple-500 ring-2 ring-purple-400/20' : 'border-purple-100 opacity-90'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Industrial Pump Feature
                        </span>
                        {selectedProfile === 'industrial-pump' && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active Profile
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">MFCC Feature Distribution</h4>
                      <p className="text-xs text-slate-400">13 Mel-Frequency Cepstral Coefficients over pump operation</p>
                    </div>
                    <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      Isolation Forest Input
                    </span>
                  </div>

                  {/* MFCC Coefficient Bar Simulation */}
                  <div className="h-56 bg-white rounded-xl p-4 border border-purple-100 flex flex-col justify-between">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Coefficients 1 to 13</span>
                      <span className="font-mono text-purple-700">MIMII id_00 baseline</span>
                    </div>

                    <div className="flex items-end justify-between gap-2 h-36 pt-2">
                      {[
                        { coeff: 'C1', val: 78, normal: 72 },
                        { coeff: 'C2', val: 65, normal: 60 },
                        { coeff: 'C3', val: 84, normal: 52 }, // anomaly spike
                        { coeff: 'C4', val: 70, normal: 68 },
                        { coeff: 'C5', val: 45, normal: 42 },
                        { coeff: 'C6', val: 92, normal: 55 }, // anomaly spike
                        { coeff: 'C7', val: 38, normal: 36 },
                        { coeff: 'C8', val: 50, normal: 48 },
                        { coeff: 'C9', val: 32, normal: 30 },
                        { coeff: 'C10', val: 28, normal: 25 },
                        { coeff: 'C11', val: 24, normal: 22 },
                        { coeff: 'C12', val: 20, normal: 19 },
                        { coeff: 'C13', val: 15, normal: 15 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex items-end justify-center gap-0.5 h-28">
                            <div
                              className={`w-2.5 rounded-t-sm ${
                                Math.abs(item.val - item.normal) > 20 ? 'bg-rose-500' : 'bg-purple-600'
                              }`}
                              style={{ height: `${item.val}%` }}
                              title={`Current: ${item.val}`}
                            />
                            <div
                              className="w-1.5 bg-slate-300 rounded-t-sm"
                              style={{ height: `${item.normal}%` }}
                              title={`Normal Baseline: ${item.normal}`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{item.coeff}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span> Current MFCC
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> Normal Baseline
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Deviation Spikes
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    Coefficients C3 and C6 deviate by &gt;28% from the noise-resilient baseline (-6 dB, 0 dB, 6 dB), triggering the anomaly flag.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. DETECTION RESULTS SCREEN */}
          {currentTab === 'results' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Inference Report
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Inspection ID: INSP-2026-9841</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Acoustic Diagnostic Results</h3>
                  <p className="text-xs text-slate-500">
                    Dual-tier machine model inference results & human-in-the-loop technician review
                  </p>
                </div>

                {/* Profile Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Viewing Results For:</span>
                  <div className="bg-purple-50 p-1 rounded-xl border border-purple-200">
                    <button
                      onClick={() => setSelectedProfile('metal-cutter')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedProfile === 'metal-cutter' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900'
                      }`}
                    >
                      Metal Cutter
                    </button>
                    <button
                      onClick={() => setSelectedProfile('industrial-pump')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedProfile === 'industrial-pump' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900'
                      }`}
                    >
                      Industrial Pump
                    </button>
                  </div>
                </div>
              </div>

              {/* PROFILE SPECIFIC RESULTS CARD */}
              {selectedProfile === 'metal-cutter' ? (
                /* METAL CUTTER RESULTS (Tool-Wear Classification) */
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100">
                    <div>
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                        PyTorch 2D CNN • Kaggle Cutting Tool Dataset
                      </span>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">
                        Predicted Tool-Wear Class:{' '}
                        <span className={`inline-block px-3 py-0.5 rounded-lg ${
                          cutterClass === 'Fresh'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cutterClass === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : cutterClass === 'Broken'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {cutterClass}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Degradation classification based on 128-bin Log-Mel Spectrogram features.
                      </p>
                    </div>

                    {/* Interactive class switcher for demo testing */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                      <span className="text-[10px] text-slate-400 px-2 font-semibold uppercase">Demo Class:</span>
                      {(['Fresh', 'Moderate', 'Broken', 'Base'] as ToolWearClass[]).map((cls) => (
                        <button
                          key={cls}
                          onClick={() => setCutterClass(cls)}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            cutterClass === cls ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-700'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Scores Distribution */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-slate-800">Model Confidence Scores Across Wear Classes</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Fresh', score: cutterClass === 'Fresh' ? 94.2 : 4.1, color: 'emerald' },
                        { name: 'Moderate', score: cutterClass === 'Moderate' ? 88.4 : 6.3, color: 'amber' },
                        { name: 'Broken', score: cutterClass === 'Broken' ? 95.1 : 3.8, color: 'rose' },
                        { name: 'Base', score: cutterClass === 'Base' ? 92.0 : 2.5, color: 'purple' },
                      ].map((item) => (
                        <div key={item.name} className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{item.name} Blade</span>
                            <span className="font-mono text-purple-700">{item.score}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.name === cutterClass ? 'bg-purple-600' : 'bg-slate-400'
                              }`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block text-right">Softmax probability</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Degradation Metrics & Triage Recommendation */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Acoustic Tool-Wear Triage Alert:</p>
                      <p className="mt-0.5 text-amber-800">
                        {cutterClass === 'Moderate'
                          ? 'Tool blade has reached 68% estimated wear threshold. Flank friction harmonics detected at 3.2 kHz. Resharpen or plan replacement within 20 operating hours.'
                          : cutterClass === 'Broken'
                          ? 'CRITICAL ALERT: Micro-fracture or chipped cutter tooth acoustic impulse detected. Halt spindle immediately to prevent ruined material batches.'
                          : cutterClass === 'Fresh'
                          ? 'Blade in pristine operational condition. Acoustic emission conforms strictly to factory baseline.'
                          : 'Standard baseline tool operation confirmed. No abnormal acoustic wear harmonics.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* INDUSTRIAL PUMP RESULTS (Acoustic Anomaly Detection) */
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100">
                    <div>
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                        Scikit-Learn Isolation Forest • Zenodo MIMII Dataset (id_00)
                      </span>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                        Machine Status:{' '}
                        <span className={`inline-block px-3 py-0.5 rounded-lg text-sm ${
                          pumpStatus === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {pumpStatus === 'Normal' ? 'NORMAL OPERATION' : 'ANOMALOUS SOUND DETECTED'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Unsupervised outlier evaluation against multi-SNR baseline (-6 dB, 0 dB, 6 dB).
                      </p>
                    </div>

                    {/* Interactive Status Switcher for Demo */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                      <span className="text-[10px] text-slate-400 px-2 font-semibold uppercase">Demo Status:</span>
                      <button
                        onClick={() => {
                          setPumpStatus('Normal');
                          setPumpAnomalyScore(0.18);
                        }}
                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                          pumpStatus === 'Normal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        Normal (+0.18)
                      </button>
                      <button
                        onClick={() => {
                          setPumpStatus('Anomalous');
                          setPumpAnomalyScore(-0.28);
                        }}
                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                          pumpStatus === 'Anomalous' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        Anomalous (-0.28)
                      </button>
                    </div>
                  </div>

                  {/* Anomaly Score Evaluation Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Calculated Anomaly Score</span>
                      <p className={`text-3xl font-mono font-extrabold ${pumpAnomalyScore < -0.05 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {pumpAnomalyScore > 0 ? `+${pumpAnomalyScore.toFixed(2)}` : pumpAnomalyScore.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Isolation Forest decision function (Threshold: -0.05)
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">SNR Operating Baseline</span>
                      <p className="text-2xl font-mono font-extrabold text-slate-900">0 dB SNR</p>
                      <p className="text-[11px] text-slate-500">
                        Tested across -6 dB, 0 dB, and +6 dB factory background noise.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Detection Confidence</span>
                      <p className="text-2xl font-mono font-extrabold text-purple-700">96.4%</p>
                      <p className="text-[11px] text-slate-500">
                        ROC-AUC threshold verification: 0.941
                      </p>
                    </div>
                  </div>

                  {/* Anomaly Detection Summary */}
                  <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                    pumpStatus === 'Anomalous'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  }`}>
                    {pumpStatus === 'Anomalous' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">Acoustic Anomaly Detection Summary:</p>
                      <p className="mt-0.5">
                        {pumpStatus === 'Anomalous'
                          ? 'Acoustic deviation exceeds normal operating threshold (-0.28 vs -0.05). MFCC temporal coefficients reveal cavitation pulses and suction friction in fluid pump chamber id_00.'
                          : 'Acoustic waveform is fully aligned with normal industrial pump operating sound. No cavitation, suction anomalies, or impeller friction identified.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MAINTENANCE REVIEW SECTION (Human-In-The-Loop) */}
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Technician Maintenance Review & Sign-Off
                    </h4>
                    <p className="text-xs text-slate-500">
                      Standardized human-in-the-loop audit for predictive maintenance triage
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Auditor: Eng. Umm-e-Kalsoom
                  </span>
                </div>

                {reviewSubmitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Review successfully logged to audit history! Status: {reviewDecision}
                    </span>
                    <button onClick={() => setReviewSubmitted(false)} className="underline text-emerald-700">Edit</button>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                      Review Decision
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'Approved', label: 'Approve Normal Operation', desc: 'Clear for production use' },
                        { id: 'Secondary Audit', label: 'Request Secondary Audit', desc: 'Repeat acoustic scan in 2 hrs' },
                        { id: 'Flagged Maintenance', label: 'Flag for Maintenance', desc: 'Schedule blade swap / pump overhaul' },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setReviewDecision(opt.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            reviewDecision === opt.id
                              ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600'
                              : 'border-slate-200 bg-white hover:border-purple-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              reviewDecision === opt.id ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                            }`}>
                              {reviewDecision === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Technician Audit Remarks & Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="Add diagnostic notes, blade inspection visual checks, or hydraulic pressure comments..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Timestamp: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => setReviewSubmitted(true)}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Submit Maintenance Sign-Off
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. REPORTS & HISTORY SCREEN */}
          {currentTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Acoustic Inspection Reports & Audit History</h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive log of past machine acoustic scans, wear assessments, and technician reviews
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Export sample CSV
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "InspectionID,MachineProfile,MachineID,Timestamp,Status,Confidence,Review\n"
                      + inspections.map(e => `${e.id},${e.machineProfile},${e.machineId},"${e.timestamp}",${e.resultStatus},${e.confidence}%,${e.reviewStatus}`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `factory_ear_inspections_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center gap-2 transition-colors self-start md:self-auto"
                >
                  <Download className="w-4 h-4" /> Export CSV Report
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search ID, machine, or operator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  {/* Machine Profile Filter */}
                  <div>
                    <select
                      value={filterProfile}
                      onChange={(e) => setFilterProfile(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      <option value="all">All Machine Profiles</option>
                      <option value="metal-cutter">Metal Cutter (2D CNN)</option>
                      <option value="industrial-pump">Industrial Pump (Isolation Forest)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      <option value="all">All Detection Statuses</option>
                      <option value="normal">Normal / Fresh / Base</option>
                      <option value="anomaly">Anomalies & Wear Alerts</option>
                    </select>
                  </div>

                  {/* Technician Review Filter */}
                  <div>
                    <select
                      value={filterReview}
                      onChange={(e) => setFilterReview(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    >
                      <option value="all">All Review States</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Flagged">Flagged Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Filter statistics counter */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-purple-50">
                  <span>
                    Showing filtered records matching current criteria
                  </span>
                  <span className="font-semibold text-purple-700">
                    {inspections.filter((item) => {
                      const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.operator.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesProfile = filterProfile === 'all' || item.machineProfile === filterProfile;
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'normal' ? !item.isAnomaly : item.isAnomaly);
                      const matchesReview = filterReview === 'all' || item.reviewStatus === filterReview;
                      return matchesSearch && matchesProfile && matchesStatus && matchesReview;
                    }).length} inspections listed
                  </span>
                </div>
              </div>

              {/* Inspections History Table */}
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-50/50 border-b border-purple-100 text-slate-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Inspection ID</th>
                        <th className="py-3.5 px-4 font-semibold">Profile & Machine</th>
                        <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                        <th className="py-3.5 px-4 font-semibold">Detection Status</th>
                        <th className="py-3.5 px-4 font-semibold">Confidence</th>
                        <th className="py-3.5 px-4 font-semibold">Review Status</th>
                        <th className="py-3.5 px-4 font-semibold">Technician</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {inspections
                        .filter((item) => {
                          const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.operator.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesProfile = filterProfile === 'all' || item.machineProfile === filterProfile;
                          const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'normal' ? !item.isAnomaly : item.isAnomaly);
                          const matchesReview = filterReview === 'all' || item.reviewStatus === filterReview;
                          return matchesSearch && matchesProfile && matchesStatus && matchesReview;
                        })
                        .map((row) => (
                          <tr key={row.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{row.id}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-900 block">{row.machineId}</span>
                              <span className="text-[11px] text-slate-400 capitalize">
                                {row.machineProfile.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">{row.timestamp}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                row.resultStatus.includes('Normal') || row.resultStatus.includes('Fresh') || row.resultStatus.includes('Base')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : row.resultStatus.includes('Moderate')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {row.resultStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{row.confidence}%</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                                row.reviewStatus === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.reviewStatus === 'Pending Review'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {row.reviewStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{row.operator}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedProfile(row.machineProfile);
                                  setCurrentTab('results');
                                }}
                                className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. SETTINGS SCREEN */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">System & Diagnostics Settings</h3>
                  <p className="text-xs text-slate-500">
                    Configure interface preferences, acoustic sampling parameters, and technician profile
                  </p>
                </div>
                {settingsSaved && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Settings saved successfully!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interface & DSP Parameters */}
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-purple-100">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    Acoustic Engine Parameters
                  </h4>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Default Startup Machine Profile
                      </label>
                      <select
                        value={defaultProfile}
                        onChange={(e) => setDefaultProfile(e.target.value as MachineProfile)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      >
                        <option value="metal-cutter">Profile A: Metal Cutter (2D CNN Tool-Wear)</option>
                        <option value="industrial-pump">Profile B: Industrial Pump (Isolation Forest Anomaly)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Audio Resampling Frequency Target
                      </label>
                      <input
                        type="text"
                        disabled
                        value="16,000 Hz (Standard Nyquist for Kaggle / MIMII DSP)"
                        className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Fixed target per Project Proposal requirements.</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700">
                          Anomaly Decision Threshold
                        </label>
                        <span className="font-mono text-purple-700 font-semibold">{anomalyThreshold.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-0.50"
                        max="0.00"
                        step="0.01"
                        value={anomalyThreshold}
                        onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                        className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Strict (-0.50)</span>
                        <span>Baseline (-0.05)</span>
                        <span>Sensitive (0.00)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Profile Information */}
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-5">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-purple-100">
                    <User className="w-4 h-4 text-purple-600" />
                    Auditor & Facility Profile
                  </h4>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Technician / Engineer Name</label>
                      <input
                        type="text"
                        defaultValue="Umm-e-Kalsoom"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Role / Designation</label>
                      <input
                        type="text"
                        defaultValue="Lead Reliability & Acoustic Diagnostics Engineer"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Manufacturing Plant & Facility</label>
                      <input
                        type="text"
                        defaultValue="Precision Machining Bay 04, East Industrial Hub"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">FastAPI Backend API Gateway URL</label>
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                        placeholder="http://localhost:8000/api/v1"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Configured for FastAPI routing during backend phase.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save System Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
