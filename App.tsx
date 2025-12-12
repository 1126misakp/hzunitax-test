import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Processing from './components/Processing';
import ResultView from './components/ResultView';
import ConfigModal from './components/ConfigModal';
import { AppState, FileData, FileMapping } from './types';
import { AlertCircle, X } from 'lucide-react';
import { REPORT_DOWNLOAD_URL, COPYRIGHT_TEXT } from './constants';

const STORAGE_KEY = 'unitax_audit_mappings';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingDuration, setProcessingDuration] = useState<number>(0);
  const [uploadedSimpleName, setUploadedSimpleName] = useState<string>('');
  
  // Configuration State with LocalStorage Persistence
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const [mappings, setMappings] = useState<FileMapping[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse mappings from local storage', e);
    }
    
    // Default initial state if no storage found
    return [
      {
        id: 'default-1',
        uploadName: '测试1',
        downloads: [
          {
            name: '报告1.doc',
            url: REPORT_DOWNLOAD_URL
          }
        ]
      }
    ];
  });

  // Persist mappings changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  }, [mappings]);

  const handleFileSelect = (file: FileData) => {
    setUploadedSimpleName(file.simpleName);
    setAppState(AppState.UPLOADING);
    // Simulate upload delay briefly before starting processing
    setTimeout(() => {
      setAppState(AppState.PROCESSING);
    }, 1000);
  };

  const handleError = (msg: string) => {
    setErrorMsg(msg);
    // Auto clear error after 5 seconds
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleProcessingComplete = (duration: number) => {
    setProcessingDuration(duration);
    setAppState(AppState.COMPLETED);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setErrorMsg(null);
    setProcessingDuration(0);
    setUploadedSimpleName('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F9]">
      <Header onLogoClick={() => setIsConfigOpen(true)} />
      
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        mappings={mappings} 
        onSave={setMappings} 
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

        {/* Error Toast */}
        {errorMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
             <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg flex items-center max-w-md">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium mr-4">{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto space-y-12 transition-all duration-500">
          
          {appState === AppState.IDLE && (
            <div className="text-center space-y-6 mb-8 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                智能审计，<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">一键生成</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                上传您的企业所得税纳税调整底稿，系统将自动进行合规性分析并生成标准审核报告说明。
              </p>
            </div>
          )}

          <div className="w-full transition-all duration-500 ease-in-out">
            {appState === AppState.IDLE && (
                <div className="animate-fade-in">
                  <FileUpload 
                    onFileSelect={handleFileSelect} 
                    onError={handleError} 
                    mappings={mappings} 
                  />
                </div>
            )}

            {(appState === AppState.UPLOADING || appState === AppState.PROCESSING) && (
               <div className="animate-fade-in">
                 <Processing onComplete={handleProcessingComplete} />
               </div>
            )}

            {appState === AppState.COMPLETED && (
               <ResultView 
                 processingDuration={processingDuration} 
                 onReset={handleReset} 
                 uploadedSimpleName={uploadedSimpleName}
                 mappings={mappings}
               />
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-slate-400 text-sm">
        <p>{COPYRIGHT_TEXT}</p>
      </footer>
    </div>
  );
};

export default App;
