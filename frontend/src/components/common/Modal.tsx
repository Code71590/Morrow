import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideClose?: boolean;
}

export function Modal({ open, onClose, title, subtitle, children, size = 'md', hideClose }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'relative z-10 w-full bg-white rounded-[16px]',
              'shadow-2xl border border-[#E9E6DE] my-8 overflow-hidden',
              sizes[size]
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E9E6DE]">
                <div>
                  {title && (
                    <h2 className="text-lg font-bold font-heading text-[#192923] leading-tight">{title}</h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-[#858A83] mt-0.5">{subtitle}</p>
                  )}
                </div>
                {!hideClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-[8px] text-[#858A83] hover:text-[#192923] hover:bg-[#F6F4EE] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

