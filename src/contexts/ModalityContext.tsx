'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import modalitiesData from '@/data/modalities.json';

interface ExamMode {
  id: string;
  name: string;
  description: string;
  route: string;
}

interface Modality {
  id: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  icon: string;
  color: string;
  gradient: string;
  enabled: boolean;
  questionCount: number;
  examModes: ExamMode[];
}

interface ModalityContextType {
  currentModality: Modality | null;
  allModalities: Modality[];
  switchModality: (id: string) => void;
  loadQuestions: () => Promise<any>;
  loadStudyCategories: () => Promise<any>;
  loadStudyContent: () => Promise<any>;
  loadMetadata: () => Promise<any>;
}

const ModalityContext = createContext<ModalityContextType | undefined>(undefined);

const STORAGE_KEY = 'sonopass_selected_modality';

export function ModalityProvider({ children }: { children: ReactNode }) {
  const [currentModality, setCurrentModality] = useState<Modality | null>(null);
  const [allModalities] = useState<Modality[]>(modalitiesData.modalities as Modality[]);

  // Initialize modality from localStorage or default to first enabled modality
  useEffect(() => {
    const savedModalityId = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;

    let initialModality: Modality | undefined;

    if (savedModalityId) {
      initialModality = allModalities.find(m => m.id === savedModalityId && m.enabled);
    }

    if (!initialModality) {
      initialModality = allModalities.find(m => m.enabled);
    }

    if (initialModality) {
      setCurrentModality(initialModality);
    }
  }, [allModalities]);

  const switchModality = (id: string) => {
    const modality = allModalities.find(m => m.id === id && m.enabled);
    if (modality) {
      setCurrentModality(modality);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, id);
      }
    }
  };

  const loadQuestions = async (): Promise<any> => {
    if (!currentModality) {
      throw new Error('No modality selected');
    }

    try {
      // Dynamic import based on modality ID
      const questionsModule = await import(`@/data/${currentModality.id}/questions.json`);
      return questionsModule.default || questionsModule;
    } catch (error) {
      console.error(`Failed to load questions for ${currentModality.id}:`, error);
      throw error;
    }
  };

  const loadStudyCategories = async (): Promise<any> => {
    if (!currentModality) {
      throw new Error('No modality selected');
    }

    try {
      const response = await fetch(`/study-guides/${currentModality.id}/categories.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch study categories: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to load study categories for ${currentModality.id}:`, error);
      throw error;
    }
  };

  const loadStudyContent = async (): Promise<any> => {
    if (!currentModality) {
      throw new Error('No modality selected');
    }

    try {
      const response = await fetch(`/study-guides/${currentModality.id}/content.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch study content: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to load study content for ${currentModality.id}:`, error);
      throw error;
    }
  };

  const loadMetadata = async (): Promise<any> => {
    if (!currentModality) {
      throw new Error('No modality selected');
    }

    try {
      const metadataModule = await import(`@/data/${currentModality.id}/metadata.json`);
      return metadataModule.default || metadataModule;
    } catch (error) {
      console.error(`Failed to load metadata for ${currentModality.id}:`, error);
      throw error;
    }
  };

  return (
    <ModalityContext.Provider
      value={{
        currentModality,
        allModalities,
        switchModality,
        loadQuestions,
        loadStudyCategories,
        loadStudyContent,
        loadMetadata,
      }}
    >
      {children}
    </ModalityContext.Provider>
  );
}

export function useModality() {
  const context = useContext(ModalityContext);
  if (context === undefined) {
    throw new Error('useModality must be used within a ModalityProvider');
  }
  return context;
}
