import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Appointment,
  Doctor,
  Service,
  ClinicSettings,
  ContactMessage,
  NotificationLog,
  AppointmentStatus
} from '../types';
import {
  Shield,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  LogOut,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Bell,
  Check,
  RefreshCw,
  Phone,
  Eye,
  Sliders
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  onLoginSuccess: (token: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  isAuthenticated,
  onLoginSuccess
}) => {
  // Login State
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('durga123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings' | 'doctors' | 'services' | 'messages' | 'notifications' | 'supabase'>('appointments');

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    projectUrl: string;
    projectId: string;
    tableExists: boolean;
    count?: number;
    error?: string;
    sqlSchema: string;
  } | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(false);
  const [syncingAll, setSyncingAll] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    total: number;
    synced: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Core Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Appointment Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('10:00 AM');
  const [newDoctorId, setNewDoctorId] = useState<string>('');

  // Doctor Edit Modal
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isNewDoc, setIsNewDoc] = useState<boolean>(false);

  // Service Edit Modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState<boolean>(false);

  // Settings Save State
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);

  // New blocked date input
  const [newBlockedDate, setNewBlockedDate] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [apts, docs, svcs, sets, msgs, notifs] = await Promise.all([
        api.getAppointments(),
        api.getDoctors(),
        api.getServices(),
        api.getSettings(),
        api.getContactMessages(),
        api.getNotifications()
      ]);
      setAppointments(apts);
      setDoctors(docs);
      setServices(svcs);
      setSettings(sets);
      setMessages(msgs);
      setNotifications(notifs);
      fetchSupabaseStatus();
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseStatus = async () => {
    try {
      setSupabaseLoading(true);
      const status = await api.getSupabaseStatus();
      setSupabaseStatus(status);
    } catch (err) {
      console.error('Failed to fetch Supabase status:', err);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    try {
      setSyncingAll(true);
      const res = await api.syncAllToSupabase();
      setSyncResult(res);
      await fetchSupabaseStatus();
    } catch (err: any) {
      alert(err.message || 'Sync failed');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await api.login(username, password);
      if (res.success && res.token) {
        localStorage.setItem('durga_admin_token', res.token);
        onLoginSuccess(res.token);
      } else {
        setLoginError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      // Refresh notifications to show sent confirmation
      const newNotifs = await api.getNotifications();
      setNotifications(newNotifs);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newTime) return;

    try {
      const res = await api.rescheduleAppointment(
        rescheduleApt.id,
        newDate,
        newTime,
        newDoctorId || rescheduleApt.doctorId
      );
      setAppointments((prev) => prev.map((a) => (a.id === res.id ? res : a)));
      setRescheduleApt(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSavingSettings(true);
      const res = await api.updateSettings(settings);
      setSettings(res.settings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate || !settings) return;
    if (settings.blockedDates.includes(newBlockedDate)) return;
    const updated = {
      ...settings,
      blockedDates: [...settings.blockedDates, newBlockedDate]
    };
    setSettings(updated);
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    if (!settings) return;
    const updated = {
      ...settings,
      blockedDates: settings.blockedDates.filter((d) => d !== dateToRemove)
    };
    setSettings(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold text-xl">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Hospital Staff Login</h2>
            <p className="text-xs text-slate-500">
              Access the management portal for appointments, doctor schedules, and hospital settings.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              <p>Demo Credentials:</p>
              <p className="font-mono text-slate-800">User: <strong>admin</strong> | Pass: <strong>durga123</strong></p>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Metric Computations
  const todayIso = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayIso);
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDoctor = doctorFilter === 'All' || a.doctorId === doctorFilter;
    const matchesDate = !dateFilter || a.appointmentDate === dateFilter;
    const matchesSearch =
      !searchQuery ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDoctor && matchesDate && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Hospital Management Suite
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
              Live Production
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Durga Dental Hospital Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holalkere Road, Chitradurga · Dr. Govardhan S N & Dr. Shilpa Govardhan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Refresh All Records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Schedule
            </span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {todayAppointments.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled for today</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Requests
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-900 tabular-nums">
            {pendingAppointments.length}
          </p>
          <span className="text-[11px] text-amber-700 mt-1 block">Requires staff review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Confirmed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {confirmedAppointments.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Slot locked & notified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {completedAppointments.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Past consultations</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Clinic Working Hours & Blocks
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'doctors'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Doctors ({doctors.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'services'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Inquiries ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Notification Logs ({notifications.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('supabase');
            fetchSupabaseStatus();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'supabase'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              supabaseStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span>Supabase Cloud DB</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search patient, phone, ref (#DURG), service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none"
              />

              {(searchQuery || statusFilter !== 'All' || doctorFilter !== 'All' || dateFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setDoctorFilter('All');
                    setDateFilter('');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Reference & Patient</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                    <th className="px-6 py-4 font-semibold">Treatment & Doctor</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900 block text-[11px]">
                          {apt.referenceNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm block mt-0.5">
                          {apt.patientName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {apt.isNewPatient ? 'New Patient' : 'Existing Patient'}
                        </span>
                      </td>

                      <td className="px-6 py-4 space-y-0.5">
                        <a href={`tel:${apt.phone}`} className="font-semibold text-slate-800 hover:underline block">
                          {apt.phone}
                        </a>
                        {apt.email && <span className="text-slate-400 text-[11px] block">{apt.email}</span>}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 block">
                          {apt.appointmentDate}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px] block">
                          {apt.appointmentTime}
                        </span>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <span className="font-semibold text-slate-900 block truncate">
                          {apt.serviceName}
                        </span>
                        <span className="text-teal-700 text-[11px] block">
                          {apt.doctorName}
                        </span>
                        {apt.reason && (
                          <span className="text-slate-400 text-[10px] block line-clamp-1 mt-0.5">
                            Note: {apt.reason}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              apt.status === 'Pending'
                                ? 'bg-amber-500'
                                : apt.status === 'Confirmed'
                                ? 'bg-emerald-500'
                                : apt.status === 'Completed'
                                ? 'bg-blue-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span>{apt.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
                              title="Confirm appointment"
                            >
                              Confirm
                            </button>
                          )}

                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Completed')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
                              title="Mark treatment completed"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setRescheduleApt(apt);
                              setNewDate(apt.appointmentDate);
                              setNewTime(apt.appointmentTime);
                              setNewDoctorId(apt.doctorId);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                            title="Reschedule slot"
                          >
                            Reschedule
                          </button>

                          {apt.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Cancel Request"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 p-4 text-slate-400">
                  No appointments match the selected criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLINIC WORKING HOURS & BLOCKS (Section 12 of prompt) */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Clinic Working Hours & Operational Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Editable schedule for morning & evening consultation sessions. Changes take effect on the booking calendar immediately.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Working hours and settings saved successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Morning Session */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Morning Session
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={settings.morningSession.start}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          morningSession: { ...settings.morningSession, start: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={settings.morningSession.end}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          morningSession: { ...settings.morningSession, end: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Evening Session */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Evening Session
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={settings.eveningSession.start}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          eveningSession: { ...settings.eveningSession, start: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={settings.eveningSession.end}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          eveningSession: { ...settings.eveningSession, end: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sunday Open Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">Sunday Clinic Schedule</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Currently configured as closed according to official directory listings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, sundayOpen: !settings.sundayOpen })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  settings.sundayOpen
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {settings.sundayOpen ? 'Sunday Open' : 'Sunday Closed'}
              </button>
            </div>

            {/* Blocked Dates Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Block Dates (Holidays / Maintenance)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Patients will not be permitted to book appointments on blocked dates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddBlockedDate}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 cursor-pointer"
                >
                  Block This Date
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {settings.blockedDates.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs"
                  >
                    <span>{d}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedDate(d)}
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {settings.blockedDates.length === 0 && (
                  <span className="text-xs text-slate-400">No blocked holiday dates active.</span>
                )}
              </div>
            </div>

            {/* Hospital Contact Info in Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Clinic Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Clinic Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs sm:text-sm hover:bg-slate-800 cursor-pointer"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Hospital Doctors List</h2>
              <p className="text-xs text-slate-500">
                Verified doctor profiles displayed across the website and booking engine.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDoctor({
                  id: '',
                  name: '',
                  qualification: 'BDS',
                  specialization: 'Dental Surgeon',
                  bio: '',
                  photo: '/src/assets/images/doctor_govardhan_sn_1790342727377.jpg',
                  daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  morningStart: '09:30',
                  morningEnd: '13:30',
                  eveningStart: '16:30',
                  eveningEnd: '20:30',
                  isActive: true
                });
                setIsNewDoc(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                    <p className="text-xs font-semibold text-teal-700">{doc.qualification}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.specialization}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2">{doc.bio}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingDoctor(doc);
                      setIsNewDoc(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Hospital Dental Services</h2>
              <p className="text-xs text-slate-500">
                Services catalog available for appointment booking and treatment detail pages.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingService({
                  id: '',
                  slug: '',
                  name: '',
                  category: 'General Dentistry',
                  shortDescription: '',
                  whoNeedsIt: '',
                  whatItInvolves: ['Initial examination', 'Procedure execution', 'Post-op care'],
                  benefits: ['Relief from symptoms', 'Preserves oral health'],
                  faqs: [],
                  isFeatured: false,
                  iconName: 'Stethoscope',
                  durationMinutes: 30
                });
                setIsNewService(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    {svc.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{svc.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5">
                    {svc.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{svc.durationMinutes} min</span>
                  <button
                    onClick={() => {
                      setEditingService(svc);
                      setIsNewService(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Patient Inquiries</h2>
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                  <span className="text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-4">
                  <span>Phone: <strong className="text-slate-800">{m.phone}</strong></span>
                  {m.email && <span>Email: {m.email}</span>}
                  <span>Subject: <strong className="text-slate-800">{m.subject}</strong></span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                  {m.message}
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                No patient contact messages received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS LOGS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Notification Dispatch Logs</h2>
            <p className="text-xs text-slate-500">
              Simulated & dispatched notifications for new bookings, admin alerts, and patient confirmation communications.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        n.recipientType === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {n.recipientType}
                    </span>
                    <span className="font-bold text-slate-900">{n.subject}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {n.content}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Recipient: {n.recipient}</span>
                  <span className="text-emerald-700 font-medium">Status: {n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SUPABASE CLOUD DATABASE INTEGRATION */}
      {activeTab === 'supabase' && (
        <div className="space-y-6 max-w-5xl">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Cloud Database Connected
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Supabase Backend Integration
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Appointments booked on Durga Dental Hospital are configured to automatically stream and sync into your Supabase database in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSupabaseStatus}
                  disabled={supabaseLoading}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseLoading ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingAll}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {syncingAll ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      <span>Sync All to Supabase</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sync Feedback Message */}
            {syncResult && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
                  syncResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border border-amber-200 text-amber-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-bold">Sync Completed</p>
                  <p className="mt-0.5">
                    Synced {syncResult.synced} of {syncResult.total} appointments to Supabase.
                    {syncResult.failed > 0 && ` (${syncResult.failed} failed: ${syncResult.errors.join(', ')})`}
                  </p>
                </div>
              </div>
            )}

            {/* Credentials & Connection Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Project ID
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 break-all">
                  ilyrmcrzotewmmckkbku
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Supabase URL
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 break-all">
                  https://ilyrmcrzotewmmckkbku.supabase.co
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Table Status
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseStatus?.tableExists ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {supabaseStatus?.tableExists
                      ? `Active (${supabaseStatus.count ?? 0} entries)`
                      : 'Pending Table Creation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status notice if table not yet created */}
            {supabaseStatus && !supabaseStatus.tableExists && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Action Needed in Supabase Console</span>
                </p>
                <p>
                  Your project connected successfully! However, the <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">appointments</code> table has not been created yet in your Supabase database. Please copy the SQL below, go to your Supabase dashboard &gt; <strong>SQL Editor</strong>, and paste it to run.
                </p>
              </div>
            )}

            {/* SQL Migration Script Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Supabase Table &amp; RLS Schema (SQL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (supabaseStatus?.sqlSchema) {
                      navigator.clipboard.writeText(supabaseStatus.sqlSchema);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800">
                <pre>{supabaseStatus?.sqlSchema || `-- Loading schema...`}</pre>
              </div>
            </div>

            {/* How it works */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-100 text-xs text-teal-950 space-y-2">
              <h4 className="font-bold text-sm">How Real-Time Sync Works</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>When any patient submits an appointment on the website, it is immediately inserted into your Supabase <code className="bg-white px-1 py-0.5 rounded font-mono">appointments</code> table.</li>
                <li>Status updates (Confirmed, Completed, Rescheduled) initiated by hospital staff are also synced to Supabase.</li>
                <li>Contact inquiries submitted on the contact page are saved to your <code className="bg-white px-1 py-0.5 rounded font-mono">contact_messages</code> table.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{rescheduleApt.patientName}</strong> ({rescheduleApt.referenceNumber})
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  min={todayIso}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Time Slot
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  {[
                    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM',
                    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Doctor
                </label>
                <select
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Edit Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isNewDoc ? 'Add New Doctor' : `Edit ${editingDoctor.name}`}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={editingDoctor.qualification}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, qualification: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingDoctor.specialization}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, specialization: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Bio / Introduction</label>
                <textarea
                  rows={3}
                  value={editingDoctor.bio}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.saveDoctor(editingDoctor, isNewDoc ? undefined : editingDoctor.id);
                    await loadAllData();
                    setEditingDoctor(null);
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {isNewService ? 'Add Dental Treatment' : `Edit ${editingService.name}`}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Treatment Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                      slug: editingService.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={editingService.category}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      category: e.target.value as Service['category']
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  {[
                    'General Dentistry',
                    'Root Canal & Restorative Dentistry',
                    'Orthodontics',
                    'Dental Implants & Tooth Replacement',
                    'Cosmetic Dentistry',
                    'Gum & Periodontal Care',
                    'Children\'s Dentistry',
                    'Oral Surgery'
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Who Needs It</label>
                <textarea
                  rows={2}
                  value={editingService.whoNeedsIt}
                  onChange={(e) =>
                    setEditingService({ ...editingService, whoNeedsIt: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.saveService(editingService, isNewService ? undefined : editingService.id);
                    await loadAllData();
                    setEditingService(null);
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
