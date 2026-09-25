import React from 'react';
import { X } from 'lucide-react';
import { BookingWorkflow } from './BookingWorkflow';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
  onGoHome?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedDoctorId,
  onGoHome
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl my-8">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <BookingWorkflow
          preselectedServiceId={preselectedServiceId}
          preselectedDoctorId={preselectedDoctorId}
          onFinished={onClose}
          onGoHome={() => {
            onClose();
            if (onGoHome) onGoHome();
          }}
        />
      </div>
    </div>
  );
};
