import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../constants';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={onLogoClick} title="点击配置审计规则">
          <div className="bg-brand-600 p-2 rounded-lg group-hover:bg-brand-700 transition-colors shadow-sm">
             <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors">{APP_NAME}</h1>
            <p className="text-xs text-gray-500 font-medium">企业级财税数字化解决方案</p>
          </div>
        </div>
        <div className="flex items-center">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">
                {APP_VERSION}
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;