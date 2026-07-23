import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Eye, X } from 'lucide-react';
import Button from '@/components/ui/Button';

const ConflictModal = ({ isOpen, onClose, onRefresh, onViewDetails, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-warning/30 overflow-hidden"
        >
          {/* Top accent glow */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-warning/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-surface flex items-center justify-center text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0 text-warning">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                Concurrency Conflict
              </span>
              <h3 className="text-xl font-display font-bold text-primary mt-2">
                Resource Modified Elsewhere
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-8 bg-surface p-4 rounded-2xl border border-border/40">
            {message ||
              'This product was modified by another administrator. Please refresh to view the latest version before making additional changes.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            {onViewDetails && (
              <Button
                type="button"
                variant="outline"
                onClick={onViewDetails}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            )}
            <Button
              type="button"
              variant="glow"
              onClick={onRefresh}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              Refresh Data
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConflictModal;
