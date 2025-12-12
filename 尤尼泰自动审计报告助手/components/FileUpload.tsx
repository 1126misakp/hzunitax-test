import React, { useCallback, useState } from 'react';
import { UploadCloud, FileWarning, FileText } from 'lucide-react';
import { FileData, FileMapping } from '../types';

interface FileUploadProps {
  onFileSelect: (file: FileData) => void;
  onError: (msg: string) => void;
  mappings: FileMapping[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onError, mappings }) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File) => {
    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError("文件大小超过 10MB 限制");
      return false;
    }

    // Check filename against mappings
    const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
    const simpleName = file.name.split('.')[0];
    
    // Find if the uploaded name matches any configured uploadName
    // We check both the full name without extension and the simple split
    const matchedMapping = mappings.find(m => 
      m.uploadName === fileNameWithoutExt || m.uploadName === simpleName
    );
    
    if (!matchedMapping) {
      const allowedNames = mappings.map(m => `"${m.uploadName}"`).join(' 或 ');
      onError(`文件名称错误：请上传文件名为 ${allowedNames} 的文档`);
      return false;
    }

    return matchedMapping.uploadName; // Return the matched simple name key
  };

  const processFile = (file: File) => {
    const matchedName = validateFile(file);
    if (matchedName) {
      onFileSelect({
          name: file.name,
          size: file.size,
          type: file.type,
          simpleName: matchedName as string
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect, onError, mappings]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative group w-full max-w-2xl mx-auto rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
        ${isDragging 
            ? 'border-brand-500 bg-brand-50 shadow-xl scale-[1.01]' 
            : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-gray-50 hover:shadow-lg'
        }
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        onChange={handleFileInput}
      />
      
      <div className="px-10 py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? 'bg-brand-100' : 'bg-gray-100 group-hover:bg-brand-50'}`}>
          <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            点击或拖拽文件到此处
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            支持 PDF, Word, Excel 等任意格式
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
          <span className="flex items-center"><FileWarning className="w-3 h-3 mr-1" /> 最大 10MB</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> 自动识别</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;