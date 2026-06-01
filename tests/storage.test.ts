import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/lib/storage';
import { ArcherProfile, Session, FormAnalysis } from '../src/types';

// In-Memory localStorage mock for node-runner environment
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(key => delete store[key]); },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Local Storage Cache Engine', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save and retrieve archer profile correctly', () => {
    const mockProfile: ArcherProfile = {
      id: 'archer-1',
      name: 'Robin Hood',
      experience_level: 'advanced',
      bow_type: 'traditional',
      draw_weight: 45,
      height: 180,
      wingspan: 177.8,
      draw_length: 28,
      arrow_spine: 500,
      joined_date: Date.now()
    };

    storage.saveProfile(mockProfile);
    const retrieved = storage.getProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Robin Hood');
    expect(retrieved?.bow_type).toBe('traditional');
  });

  it("should return null when profile doesn't exist", () => {
    const retrieved = storage.getProfile();
    expect(retrieved).toBeNull();
  });

  it('should save and list multiple sessions correctly', () => {
    const mockSession1: Session = {
      id: 'session-123',
      name: 'Morning Field practice',
      date: '2026-06-01T00:00:00.000Z',
      archer_id: 'archer-1',
      distance: 30,
      target_type: 'wa_80',
      shots: [
        { id: 'shot-1', score: 9, is_x: false, distance: 30, x: 10, y: 5, timestamp: Date.now() },
        { id: 'shot-2', score: 10, is_x: true, distance: 30, x: 0, y: 0, timestamp: Date.now() }
      ]
    };

    const mockSession2: Session = {
      id: 'session-456',
      name: 'Evening Indoor drill',
      date: '2026-06-01T12:00:00.000Z',
      archer_id: 'archer-1',
      distance: 18,
      target_type: 'indoor_40',
      shots: [
        { id: 'shot-3', score: 8, is_x: false, distance: 18, x: 20, y: -15, timestamp: Date.now() }
      ]
    };

    storage.saveSession(mockSession1);
    storage.saveSession(mockSession2);

    const sessions = storage.getSessions();
    expect(sessions).toHaveLength(2);
    expect(sessions[0].name).toBe('Morning Field practice');
    expect(sessions[1].name).toBe('Evening Indoor drill');
  });

  it('should update sessions if saved with matching ID', () => {
    const mockSession: Session = {
      id: 'session-same',
      name: 'Initial Shot Practice',
      date: '2026-06-01T00:00:00.000Z',
      archer_id: 'archer-1',
      distance: 30,
      target_type: 'wa_80',
      shots: []
    };

    storage.saveSession(mockSession);

    // Update session
    const updatedSession: Session = { ...mockSession, name: 'Optimized Shot Practice', distance: 50 };
    storage.saveSession(updatedSession);

    const sessions = storage.getSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].name).toBe('Optimized Shot Practice');
    expect(sessions[0].distance).toBe(50);
  });

  it('should delete a session by its unique ID', () => {
    const mockSession1: Session = {
      id: 'session-to-del',
      name: 'Unstable Practice',
      date: '2026-06-01T00:00:00.000Z',
      archer_id: 'archer-1',
      distance: 30,
      target_type: 'wa_80',
      shots: []
    };

    const mockSession2: Session = {
      id: 'session-to-keep',
      name: 'Good Practice',
      date: '2026-06-01T01:00:00.000Z',
      archer_id: 'archer-1',
      distance: 30,
      target_type: 'wa_80',
      shots: []
    };

    storage.saveSession(mockSession1);
    storage.saveSession(mockSession2);

    expect(storage.getSessions()).toHaveLength(2);

    storage.deleteSession('session-to-del');

    const sessions = storage.getSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe('session-to-keep');
  });

  it('should save and fetch form analysis diagnostics info', () => {
    const analysis: FormAnalysis = {
      id: 'analysis-999',
      timestamp: Date.now(),
      image_url: 'data:image/png;base64,...',
      raw_analysis: 'Perfect alignment, shoulders squared.',
      issues: [],
      recommendations: ['Maintain standard release tension']
    };

    storage.saveAnalysis(analysis);
    const list = storage.getAnalyses();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('analysis-999');
    expect(list[0].recommendations[0]).toBe('Maintain standard release tension');
  });

  it('should save and load agent config rules and tone preferences correctly', () => {
    // Check initial defaults
    const defaultConfig = storage.getAgentConfig();
    expect(defaultConfig.tone).toBe('analytical');
    expect(defaultConfig.rules.length).toBeGreaterThan(0);

    // Save custom settings
    storage.saveAgentConfig({
      tone: 'supportive',
      rules: ['Praise clean alignments', 'Remind user to relax shoulders']
    });

    const retrieved = storage.getAgentConfig();
    expect(retrieved.tone).toBe('supportive');
    expect(retrieved.rules[0]).toBe('Praise clean alignments');
  });
});

