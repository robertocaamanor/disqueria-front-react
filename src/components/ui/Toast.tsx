import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgColors = {
    success: 'bg-slate-900 border-green-500/20',
    error: 'bg-slate-900 border-red-500/20',
    info: 'bg-slate-900 border-blue-500/20',
};

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <div className={`flex items-center gap-3 p-4 mb-3 rounded-lg border shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-right-full ${bgColors[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium text-white">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
