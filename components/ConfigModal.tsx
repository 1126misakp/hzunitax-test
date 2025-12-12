import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Settings } from 'lucide-react';
import { FileMapping } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: FileMapping[];
  onSave: (newMappings: FileMapping[]) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, mappings, onSave }) => {
  const [localMappings, setLocalMappings] = useState<FileMapping[]>(mappings);
  const [newUploadName, setNewUploadName] = useState('');
  const [newDownloadName, setNewDownloadName] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');

  // Sync props to local state when modal opens
  React.useEffect(() => {
    setLocalMappings(mappings);
  }, [mappings, isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newUploadName || !newDownloadName || !newDownloadUrl) return;
    
    const newMapping: FileMapping = {
      id: Date.now().toString(),
      uploadName: newUploadName,
      downloadName: newDownloadName.endsWith('.pdf') ? newDownloadName : `${newDownloadName}.pdf`,
      downloadUrl: newDownloadUrl
    };

    setLocalMappings([...localMappings, newMapping]);
    setNewUploadName('');
    setNewDownloadName('');
    setNewDownloadUrl('');
  };

  const handleDelete = (id: string) => {
    setLocalMappings(localMappings.filter(m => m.id !== id));
  };

  const handleSave = () => {
    onSave(localMappings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
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
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Add New Section */}
          <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-100">
            <h4 className="text-sm font-semibold text-brand-800 mb-3 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> 添加新规则
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="上传文件名 (如: 测试1)"
                className="px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={newUploadName}
                onChange={e => setNewUploadName(e.target.value)}
              />
              <input
                type="text"
                placeholder="下载文件名 (如: 报告1.pdf)"
                className="px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={newDownloadName}
                onChange={e => setNewDownloadName(e.target.value)}
              />
              <input
                type="text"
                placeholder="下载链接 URL"
                className="px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={newDownloadUrl}
                onChange={e => setNewDownloadUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newUploadName || !newDownloadName || !newDownloadUrl}
              className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加规则
            </button>
          </div>

          {/* List Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">上传名称</div>
              <div className="col-span-3">下载名称</div>
              <div className="col-span-6">下载链接</div>
              <div className="col-span-1 text-right">操作</div>
            </div>
            
            {localMappings.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                暂无配置规则
              </div>
            ) : (
              localMappings.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="col-span-2 font-medium text-gray-900 truncate" title={item.uploadName}>
                    {item.uploadName}
                  </div>
                  <div className="col-span-3 text-gray-600 truncate" title={item.downloadName}>
                    {item.downloadName}
                  </div>
                  <div className="col-span-6 text-gray-400 text-xs truncate font-mono bg-gray-50 px-2 py-1 rounded" title={item.downloadUrl}>
                    {item.downloadUrl}
                  </div>
                  <div className="col-span-1 text-right">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
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