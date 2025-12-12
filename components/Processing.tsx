import React, { useEffect, useState, useRef } from 'react';
import { Loader2, CheckCircle2, BrainCircuit } from 'lucide-react';
import { ProcessStep } from '../types';

interface ProcessingProps {
  onComplete: (duration: number) => void;
}

const Processing: React.FC<ProcessingProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState<ProcessStep[]>([
    { id: 1, label: '上传文件至安全沙箱', status: 'active' },
    { id: 2, label: '解析文档结构与OCR识别', status: 'pending' },
    { id: 3, label: '纳税调整事项智能分析', status: 'pending' },
    { id: 4, label: '生成审计底稿与报告', status: 'pending' },
  ]);

  const startTimeRef = useRef<number>(Date.now());
  const totalDurationRef = useRef<number>(0);

  useEffect(() => {
    // Random duration between 8000ms and 10000ms
    const randomDuration = Math.floor(Math.random() * 2000) + 8000;
    totalDurationRef.current = randomDuration;

    // Distribute time across 4 steps roughly
    // We will use a sequence of timeouts to manage the state transitions
    
    const stepTime = randomDuration / 4;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Step 1 is already active on mount.
    // Schedule Step 1 -> Completed, Step 2 -> Active
    timeouts.push(setTimeout(() => {
      setSteps(prev => prev.map(s => 
        s.id === 1 ? { ...s, status: 'completed' } : 
        s.id === 2 ? { ...s, status: 'active' } : s
      ));
    }, stepTime));

    // Schedule Step 2 -> Completed, Step 3 -> Active
    timeouts.push(setTimeout(() => {
      setSteps(prev => prev.map(s => 
        s.id === 2 ? { ...s, status: 'completed' } : 
        s.id === 3 ? { ...s, status: 'active' } : s
      ));
    }, stepTime * 2));

    // Schedule Step 3 -> Completed, Step 4 -> Active
    timeouts.push(setTimeout(() => {
      setSteps(prev => prev.map(s => 
        s.id === 3 ? { ...s, status: 'completed' } : 
        s.id === 4 ? { ...s, status: 'active' } : s
      ));
    }, stepTime * 3));

    // Schedule Step 4 -> Completed, Finish
    timeouts.push(setTimeout(() => {
      setSteps(prev => prev.map(s => 
        s.id === 4 ? { ...s, status: 'completed' } : s
      ));
      
      // Small buffer after visual completion before firing onComplete callback
      setTimeout(() => {
        onComplete(randomDuration);
      }, 500);

    }, randomDuration));

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-xl mb-4">
          <BrainCircuit className="w-8 h-8 text-brand-600 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">正在生成报告...</h3>
        <p className="text-gray-500 mt-2">尤尼泰智能审计引擎正在分析您的数据</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-center">
             {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className={`absolute left-3.5 top-8 w-0.5 h-full -mb-3 
                ${step.status === 'completed' ? 'bg-brand-500' : 'bg-gray-100'}`} 
              />
            )}

            <div className={`
              relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500
              ${step.status === 'completed' 
                ? 'bg-brand-500 border-brand-500 text-white' 
                : step.status === 'active'
                  ? 'bg-white border-brand-500 text-brand-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]'
                  : 'bg-white border-gray-200 text-gray-300'}
            `}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : step.status === 'active' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                 <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>

            <span className={`ml-4 text-base font-medium transition-colors duration-300
              ${step.status === 'active' ? 'text-brand-700' : 
                step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'}
            `}>
              {step.label}
            </span>
            
            {step.status === 'active' && (
              <span className="ml-auto text-xs font-semibold text-brand-600 animate-pulse">处理中...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Processing;