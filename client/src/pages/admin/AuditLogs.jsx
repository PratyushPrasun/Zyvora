import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  PlusCircle,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  Clock,
  Globe,
  UserCheck,
  ChevronRight,
  RefreshCw,
  FileCode,
} from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

const actionIcons = {
  CREATE: PlusCircle,
  UPDATE: Edit3,
  DELETE: Trash2,
  LOGIN: LogIn,
  LOGOUT: LogOut,
};

const actionColors = {
  CREATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE: 'bg-amber-50 text-amber-700 border-amber-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  LOGIN: 'bg-blue-50 text-blue-700 border-blue-200',
  LOGOUT: 'bg-slate-100 text-slate-600 border-slate-200',
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useAuditLogs({
    search,
    action: actionFilter,
    entityType: entityFilter,
  });

  const logs = data?.logs || [];

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Audit Logs — Admin — Zyvora</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Activity className="w-5 h-5 text-emerald-600" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                Audit Logs
              </h1>
            </div>
            <p className="text-slate-500 mt-2 text-sm">
              Real-time security timeline of admin operations, changes, and access records.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching}
            className="self-start sm:self-auto bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh Timeline
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by action, entity, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Action Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-transparent text-xs focus:outline-none text-slate-900 cursor-pointer"
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOGIN">LOGIN</option>
              </select>
            </div>

            {/* Entity Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="bg-transparent text-xs focus:outline-none text-slate-900 cursor-pointer"
              >
                <option value="">All Entities</option>
                <option value="Product">Product</option>
                <option value="Order">Order</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Timeline Table */}
        {isLoading ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
            <Skeleton.Table rows={5} cols={5} />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : logs.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-2xs">
            <EmptyState
              icon={Activity}
              title="No Audit Logs Found"
              description="Admin actions and security events will automatically record here."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline List */}
            <div className="lg:col-span-2 space-y-4">
              {logs.map((log) => {
                const IconComponent = actionIcons[log.action] || Activity;
                const badgeStyle = actionColors[log.action] || 'bg-slate-100 text-slate-700 border-slate-200';
                const isSelected = selectedLog?._id === log._id;

                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedLog(log)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${badgeStyle}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {log.admin?.name || 'System Admin'}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-mono font-bold text-emerald-700">
                              {log.entityType} #{log.entityId?.slice(-6)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatDate(log.createdAt)}
                            </span>
                            {log.ip && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-slate-400" />
                                {log.ip}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${badgeStyle}`}
                        >
                          {log.action}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Changes Inspector Pane */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h3 className="text-base font-display font-semibold text-slate-900 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    Log Details & Changes
                  </h3>
                </div>

                {selectedLog ? (
                  <div className="space-y-5 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                        Admin User
                      </span>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-slate-900">{selectedLog.admin?.name}</p>
                          <p className="text-slate-500 text-[11px]">{selectedLog.admin?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                        Target Resource
                      </span>
                      <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-mono">
                        {selectedLog.entityType} ID: {selectedLog.entityId}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                        Payload / State Changes
                      </span>
                      <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 shadow-inner">
                        {JSON.stringify(selectedLog.changes, null, 2)}
                      </pre>
                    </div>

                    {selectedLog.userAgent && (
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                          Client User Agent
                        </span>
                        <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] truncate">
                          {selectedLog.userAgent}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Select any log entry on the left to inspect full payload changes and security metadata.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuditLogs;
