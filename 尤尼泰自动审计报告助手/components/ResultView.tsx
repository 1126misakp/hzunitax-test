import React, { useState, useEffect } from 'react';
import { Download, FileCheck, CheckCircle, RefreshCcw, Loader2, AlertCircle, FileText } from 'lucide-react';
import { FileMapping, DownloadConfig } from '../types';

interface ResultViewProps {
  onReset: () => void;
  processingDuration: number;
  uploadedSimpleName: string;
  mappings: FileMapping[];
}

const ResultView: React.FC<ResultViewProps> = ({ onReset, processingDuration, uploadedSimpleName, mappings }) => {
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [targetMapping, setTargetMapping] = useState<FileMapping | undefined>(undefined);

  useEffect(() => {
    const mapping = mappings.find(m => m.uploadName === uploadedSimpleName);
    setTargetMapping(mapping);
  }, [uploadedSimpleName, mappings]);
  
  const handleDownload = async (file: DownloadConfig) => {
    setDownloadingUrl(file.url);
    try {
      // Fetch the remote file to create a blob for proper naming
      const response = await fetch(file.url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed, opening directly", error);
      // Fallback: open in new tab if blob creation fails (e.g. CORS issues)
      window.open(file.url, '_blank');
    } finally {
      setDownloadingUrl(null);
    }
  };

  // Convert ms to seconds with 1 decimal place
  const timeInSeconds = (processingDuration / 1000).toFixed(1);

  if (!targetMapping) {
    return (
      <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-red-700">配置错误</h3>
          <p className="text-red-600">找不到文件 "{uploadedSimpleName}" 对应的下载配置。</p>
          <button onClick={onReset} className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50">返回</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">报告生成成功</h2>
          <p className="text-emerald-100 text-lg">各项纳税调整指标审核完毕，无重大异常</p>
        </div>

        <div className="p-8 sm:p-10">
          
          <div className="mb-6">
            <h4 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-brand-600" />
              生成结果文档 ({targetMapping.downloads.length})
            </h4>
            
            <div className="space-y-4">
              {targetMapping.downloads.map((file, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto overflow-hidden">
                    <div className="w-10 h-10 flex-shrink-0 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-gray-900 truncate pr-2" title={file.name}>{file.name}</h4>
                      <p className="text-xs text-gray-500">审计报告文件</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(file)}
                    disabled={downloadingUrl !== null}
                    className="w-full md:w-auto flex-shrink-0 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {downloadingUrl === file.url ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {downloadingUrl === file.url ? '下载中...' : '下载文件'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">调整项目</div>
                <div className="text-2xl font-bold text-gray-800">12 <span className="text-sm font-normal text-gray-400">项</span></div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">风险提示</div>
                <div className="text-2xl font-bold text-amber-500">0 <span className="text-sm font-normal text-gray-400">个</span></div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">处理耗时</div>
                <div className="text-2xl font-bold text-brand-600">{timeInSeconds} <span className="text-sm font-normal text-gray-400">秒</span></div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex justify-center">
            <button 
              onClick={onReset}
              className="text-gray-500 hover:text-brand-600 font-medium flex items-center transition-colors group"
            >
              <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              处理下一个文件
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;