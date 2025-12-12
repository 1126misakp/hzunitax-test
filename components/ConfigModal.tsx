import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Settings, Link as LinkIcon, FileOutput, ArrowRight } from 'lucide-react';
import { FileMapping, DownloadConfig } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: FileMapping[];
  onSave: (newMappings: FileMapping[]) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, mappings, onSave }) => {
  const [localMappings, setLocalMappings] = useState<FileMapping[]>(mappings);
  
  // State for new entry
  const [newUploadName, setNewUploadName] = useState('');
  const [newDownloads, setNewDownloads] = useState<DownloadConfig[]>([
    { name: '', url: '' }
  ]);

  // Sync props to local state when modal opens
  React.useEffect(() => {
    setLocalMappings(mappings);
  }, [mappings, isOpen]);

  if (!isOpen) return null;

  const handleAddDownloadRow = () => {
    if (newDownloads.length < 3) {
      setNewDownloads([...newDownloads, { name: '', url: '' }]);
    }
  };

  const handleRemoveDownloadRow = (index: number) => {
    if (newDownloads.length > 1) {
      setNewDownloads(newDownloads.filter((_, i) => i !== index));
    }
  };

  const handleDownloadChange = (index: number, field: keyof DownloadConfig, value: string) => {
    const updated = [...newDownloads];
    updated[index] = { ...updated[index], [field]: value };
    setNewDownloads(updated);
  };

  const handleAddRule = () => {
    // Validate
    if (!newUploadName) return;
    const validDownloads = newDownloads.filter(d => d.name && d.url);
    if (validDownloads.length === 0) return;

    // Ensure .doc or .docx extension for names
    const finalDownloads = validDownloads.map(d => ({
      name: (d.name.endsWith('.doc') || d.name.endsWith('.docx')) ? d.name : `${d.name}.doc`,
      url: d.url
    }));

    const newMapping: FileMapping = {
      id: Date.now().toString(),
      uploadName: newUploadName,
      downloads: finalDownloads
    };

    setLocalMappings([...localMappings, newMapping]);
    
    // Reset form
    setNewUploadName('');
    setNewDownloads([{ name: '', url: '' }]);
  };

  const handleDeleteRule = (id: string) => {
    setLocalMappings(localMappings.filter(m => m.id !== id));
  };

  const handleSave = () => {
    onSave(localMappings);
    onClose();
  };

  const isFormValid = newUploadName && newDownloads.some(d => d.name && d.url);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2 text-gray-800">
            <Settings className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-lg">审计对应关系配置</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
          
          {/* Add New Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-brand-100 mb-6">
            <h4 className="text-sm font-semibold text-brand-800 mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> 添加新规则
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Upload Input */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">上传文件关键字</label>
                <input
                  type="text"
                  placeholder="如: 测试1"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  value={newUploadName}
                  onChange={e => setNewUploadName(e.target.value)}
                />
              </div>

              {/* Arrow Icon */}
              <div className="hidden md:flex md:col-span-1 items-center justify-center pt-6 text-gray-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Download Inputs */}
              <div className="md:col-span-8 space-y-3">
                 <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                   生成报告文件 (最多3个)
                 </label>
                 
                 {newDownloads.map((item, index) => (
                   <div key={index} className="flex space-x-2 items-start animate-fade-in">
                      <div className="flex-1 space-y-2 md:space-y-0 md:flex md:space-x-2">
                         <div className="relative flex-1">
                            <FileOutput className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="文件名 (如: 报告1.doc)"
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                              value={item.name}
                              onChange={e => handleDownloadChange(index, 'name', e.target.value)}
                            />
                         </div>
                         <div className="relative flex-[1.5]">
                            <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="下载链接 URL"
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono text-xs"
                              value={item.url}
                              onChange={e => handleDownloadChange(index, 'url', e.target.value)}
                            />
                         </div>
                      </div>
                      
                      {/* Controls for each row */}
                      <div className="flex-shrink-0 pt-1">
                        {newDownloads.length > 1 && (
                          <button 
                            onClick={() => handleRemoveDownloadRow(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="删除此输出文件"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                   </div>
                 ))}

                 {newDownloads.length < 3 && (
                   <button 
                     onClick={handleAddDownloadRow}
                     className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center mt-1 ml-1"
                   >
                     <Plus className="w-3 h-3 mr-1" /> 添加另一个输出文件
                   </button>
                 )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
               <button
                  onClick={handleAddRule}
                  disabled={!isFormValid}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  添加规则
                </button>
            </div>
          </div>

          {/* List Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 px-1">已配置规则</h4>
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">上传文件名</div>
              <div className="col-span-8">输出文件配置</div>
              <div className="col-span-1 text-right">操作</div>
            </div>
            
            {localMappings.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                暂无配置规则
              </div>
            ) : (
              localMappings.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="col-span-3 flex items-start pt-2">
                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm truncate w-full" title={item.uploadName}>
                      {item.uploadName}
                    </span>
                  </div>
                  
                  <div className="col-span-8 space-y-2">
                    {item.downloads.map((dl, idx) => (
                      <div key={idx} className="flex items-center text-sm border-l-2 border-brand-200 pl-3">
                        <span className="font-medium text-gray-700 w-1/3 truncate pr-2" title={dl.name}>{dl.name}</span>
                        <span className="text-gray-400 font-mono text-xs w-2/3 truncate bg-gray-50 px-2 py-0.5 rounded" title={dl.url}>{dl.url}</span>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-1 text-right pt-2">
                    <button 
                      onClick={() => handleDeleteRule(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="删除规则"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;