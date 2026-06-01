/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  Info, 
  Save, 
  PlusCircle, 
  Calendar, 
  TrendingUp, 
  X, 
  Maximize2 
} from 'lucide-react';
import { SightSetting } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface SightSettingsManagerProps {
  sightSettings: SightSetting[];
  onSave: (setting: Omit<SightSetting, 'id' | 'archer_id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function SightSettingsManager({ sightSettings, onSave, onDelete }: SightSettingsManagerProps) {
  const { theme } = useTheme();
  const [filterDistance, setFilterDistance] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form State
  const [inputs, setInputs] = useState({
    distance: 50,
    elevation: 4.5,
    windage: 0,
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepare chart data (sorted by distance)
  const chartData = [...sightSettings]
    .sort((a, b) => a.distance - b.distance)
    .map(setting => ({
      distance: setting.distance,
      elevation: setting.elevation,
      windage: setting.windage,
      rawDate: new Date(setting.date).toLocaleDateString(),
      notes: setting.notes || 'No comments'
    }));

  const handleEditClick = (setting: SightSetting) => {
    setInputs({
      distance: setting.distance,
      elevation: setting.elevation,
      windage: setting.windage,
      notes: setting.notes || ''
    });
    setEditingId(setting.id);
    setIsEditing(true);
    setError(null);
  };

  const handleAddNewClick = () => {
    setInputs({
      distance: 30,
      elevation: 5.0,
      windage: 0,
      notes: ''
    });
    setEditingId(undefined);
    setIsEditing(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.distance <= 0) {
      setError('Distance must be a positive number');
      return;
    }
    if (inputs.elevation < 0 || inputs.elevation > 15) {
      setError('Typical archery sight settings are between 0 and 15 (check standard apertures)');
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        id: editingId,
        distance: Number(inputs.distance),
        elevation: Number(inputs.elevation),
        windage: Number(inputs.windage),
        notes: inputs.notes,
        date: new Date().toISOString()
      });
      setIsEditing(false);
      setEditingId(undefined);
    } catch (err: any) {
      setError(err?.message || 'Failed to save sight setting');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
    } catch (err) {
      setError('Failed to delete setting.');
    }
  };

  // Filter listings
  const filteredSettings = sightSettings.filter(s => {
    if (!filterDistance) return true;
    return s.distance.toString().includes(filterDistance);
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sight Registry</h1>
          <p className="text-[var(--muted)] font-mono text-[10px] uppercase tracking-widest mt-1">
            Store & Regress Vertical and Lateral Sight Marks
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNewClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-mono text-xs uppercase tracking-widest font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Plus size={16} />
            <span>Add Mark</span>
          </button>
        )}
      </header>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Registry list and Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Elevation vs Distance Curve Visualization */}
          {sightSettings.length > 1 && (
            <div className="bg-[var(--card-bg)] border border-[var(--line)] p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold">Ballistic Elevation curve</h3>
                  <p className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
                    Elevation drop plotted against shooting distances
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase bg-[var(--line)] px-2.5 py-1 rounded">
                    <TrendingUp size={12} className="text-[var(--accent)]" />
                    <span>Ballistic Trend</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
                      vertical={false} 
                    />
                    <XAxis 
                      dataKey="distance" 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      unit="m"
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1b1e' : '#ffffff',
                        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: '12px',
                        color: theme === 'dark' ? '#ffffff' : '#000000'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="elevation" 
                      stroke={theme === 'dark' ? '#dcfc44' : '#2c3e50'} 
                      strokeWidth={3}
                      dot={{ r: 6, fill: theme === 'dark' ? '#dcfc44' : '#2c3e50' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Settings List */}
          <div className="bg-[var(--card-bg)] border border-[var(--line)] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--line)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold">Saved Sight Marks</h3>
                <p className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
                  List of verified ranges and apertures
                </p>
              </div>
              
              {/* Search Filter input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter by distance..." 
                  value={filterDistance}
                  onChange={(e) => setFilterDistance(e.target.value)}
                  className="px-4 py-2 bg-[var(--line)] border border-transparent rounded-xl text-xs font-mono w-full md:w-48 placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/30 transition-colors"
                />
                {filterDistance && (
                  <button 
                    onClick={() => setFilterDistance('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--ink)]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-[var(--line)]">
              {filteredSettings.length === 0 ? (
                <div className="p-16 text-center text-[var(--muted)] font-mono text-xs uppercase tracking-widest">
                  {sightSettings.length === 0 ? 'No Sight Settings Logged Yet' : 'No Matching Distances Found'}
                </div>
              ) : (
                filteredSettings.map(setting => (
                  <div 
                    key={setting.id} 
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--line)]/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Distance CircleBadge */}
                      <div className="w-16 h-16 rounded-2xl bg-[var(--line)] border border-transparent flex flex-col items-center justify-center font-mono shrink-0 transition-colors">
                        <span className="text-xl font-black text-[var(--accent)]">{setting.distance}</span>
                        <span className="text-[8px] uppercase tracking-wider text-[var(--muted)]">meters</span>
                      </div>
                      
                      <div>
                        <div className="flex items-baseline gap-4">
                          <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">Elev</span>
                          <span className="text-lg font-black">{setting.elevation}</span>
                          <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-2">Wind</span>
                          <span className={`text-sm font-bold ${setting.windage !== 0 ? 'text-blue-400' : ''}`}>
                            {setting.windage > 0 ? `L ${setting.windage}` : setting.windage < 0 ? `R ${Math.abs(setting.windage)}` : '0 (Center)'}
                          </span>
                        </div>
                        {setting.notes && (
                          <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-1 italic">
                            "{setting.notes}"
                          </p>
                        )}
                        <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--muted)] flex items-center gap-1 mt-1 text-gray-500">
                          <Calendar size={10} />
                          {new Date(setting.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {deleteConfirmId === setting.id ? (
                        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                          <span className="text-[10px] font-mono text-xs text-red-500 uppercase font-semibold mr-1">Sure?</span>
                          <button
                            onClick={() => handleDelete(setting.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-mono text-[9px] px-2 py-1 rounded-md uppercase tracking-wider font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-[var(--line)] hover:bg-[var(--line)]/80 text-[var(--muted)] font-mono text-[9px] px-2 py-1 rounded-md uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEditClick(setting)}
                            className="p-2 hover:bg-[var(--line)] border border-transparent hover:border-[var(--line)] text-[var(--muted)] hover:text-[var(--accent)] rounded-lg transition-colors cursor-pointer"
                            title="Edit Mark"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(setting.id)}
                            className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 text-[var(--muted)] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete Mark"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Form container */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--card-bg)] border border-[var(--accent)]/30 rounded-3xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--line)]">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                    {editingId ? 'Edit Configuration' : 'Record Sight Setting'}
                  </h3>
                  <button 
                    onClick={() => { setIsEditing(false); setEditingId(undefined); }}
                    className="p-1 text-gray-400 hover:text-[var(--ink)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center font-medium">
                      {error}
                    </div>
                  )}

                  {/* Distance (meters) Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-[var(--muted)] flex justify-between">
                      <span>Target Range (m)</span>
                      <span className="text-[var(--accent)] font-bold">{inputs.distance} meters</span>
                    </label>
                    <input 
                      type="number" 
                      value={inputs.distance}
                      onChange={(e) => setInputs({ ...inputs, distance: Number(e.target.value) })}
                      min="5"
                      max="120"
                      className="w-full px-4 py-3 bg-[var(--line)] border border-transparent rounded-xl text-sm font-bold focus:outline-none focus:border-[var(--accent)]/20 transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Elevation Dial input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-[var(--muted)] flex justify-between">
                      <span>Elevation Mark (0-15)</span>
                      <span className="text-[var(--accent)] font-bold">{inputs.elevation}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="0"
                        max="15"
                        step="0.05"
                        value={inputs.elevation}
                        onChange={(e) => setInputs({ ...inputs, elevation: Number(e.target.value) })}
                        className="flex-1 h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                      />
                      <input 
                        type="number"
                        step="0.01"
                        value={inputs.elevation}
                        onChange={(e) => setInputs({ ...inputs, elevation: Number(e.target.value) })}
                        className="w-16 px-2 py-1.5 bg-[var(--line)] text-center rounded-lg text-xs font-mono border border-transparent"
                      />
                    </div>
                  </div>

                  {/* Windage offsets */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-[var(--muted)] flex justify-between">
                      <span>Windage Offset (L / R)</span>
                      <span className="text-[var(--accent)] font-bold">
                        {inputs.windage > 0 ? `L ${inputs.windage}` : inputs.windage < 0 ? `R ${Math.abs(inputs.windage)}` : '0 (Center)'}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={inputs.windage}
                        onChange={(e) => setInputs({ ...inputs, windage: Number(e.target.value) })}
                        className="flex-1 h-1 bg-[var(--line)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <input 
                        type="number"
                        step="0.1"
                        value={inputs.windage}
                        onChange={(e) => setInputs({ ...inputs, windage: Number(e.target.value) })}
                        className="w-16 px-2 py-1.5 bg-[var(--line)] text-center rounded-lg text-xs font-mono border border-transparent"
                      />
                    </div>
                  </div>

                  {/* Custom comments/notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-[var(--muted)]">
                      Strategic notes / Range conditions
                    </label>
                    <textarea 
                      value={inputs.notes}
                      onChange={(e) => setInputs({ ...inputs, notes: e.target.value })}
                      placeholder="e.g. Recurve setup, crosswind at indoor 25m, tight groupings"
                      rows={3}
                      className="w-full px-4 py-3 bg-[var(--line)] border border-transparent rounded-xl text-xs placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Core Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditingId(undefined); }}
                      className="flex-1 py-3 border border-[var(--line)] text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest rounded-xl hover:bg-[var(--line)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                      <Save size={12} />
                      <span>{saving ? 'Saving...' : 'Commit'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-[var(--card-bg)] border border-[var(--line)] rounded-3xl p-6 text-center space-y-4 shadow-sm">
                <Sliders className="w-12 h-12 text-[var(--accent)] opacity-40 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold">Aperture Reference</h4>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Your sight marks will automatically align. Recording accurate marks helps you calculate intermediate sight tapes.
                  </p>
                </div>
                <button
                  onClick={handleAddNewClick}
                  className="w-full py-3 bg-[var(--line)] border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 rounded-xl transition-all"
                >
                  Create registry record
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
