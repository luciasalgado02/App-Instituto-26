import React from 'react';

export const FullPageLoader: React.FC = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
        <span className="sr-only">Cargando...</span>
    </div>
);

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-bg-tertiary rounded animate-pulse ${className}`}></div>
);

export const CardLoader: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
    <div className="bg-card-bg rounded-lg shadow-md p-4 sm:p-6 space-y-4">
        <SkeletonLoader className="h-6 w-1/3" />
        {Array.from({ length: lines }).map((_, i) => (
             <SkeletonLoader key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
        ))}
    </div>
);

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Ocurrió un error</p>
        <p>{message}</p>
        {onRetry && (
            <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Intentar de nuevo
            </button>
        )}
    </div>
);
