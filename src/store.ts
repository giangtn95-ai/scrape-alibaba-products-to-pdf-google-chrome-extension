import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ProductItem {
  id: string;
  productName: string;
  supplierName: string;
  supplierYears?: string;
  supplierLocation?: string;
  supplierType?: string;
  isVerified?: boolean;
  isCustomManufacturer?: boolean;
  catalog: string;
  price: string;
  moq: string;
  shipping?: string;
  specs: string[];
  imageUrls: string[];
  imageUrl?: string;
  sourceUrl?: string;
  chatUrl?: string;
  notes?: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  items: ProductItem[];
  createdAt: number;
  updatedAt: number;
}

interface SourcingState {
  projects: Project[];
  currentProjectId: string | null;
  badgeText: string;
  
  createProject: (name: string) => void;
  switchProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProjectName: (id: string, name: string) => void;
  updateBadgeText: (text: string) => void;
  
  // App Personalization
  themeColor: string;
  avatarType: 'animated' | 'image';
  avatarValue: string; // the string face or image URL
  setThemeColor: (color: string) => void;
  setAvatar: (type: 'animated' | 'image', value: string) => void;
  
  addItem: (item: Omit<ProductItem, 'id' | 'createdAt'>) => void;
  updateItem: (itemId: string, data: Partial<ProductItem>) => void;
  removeItem: (itemId: string) => void;
  clearCurrentProject: () => void;
  importProject: (projectData: { projectName: string, items: ProductItem[] }) => void;
}

export const useSourcingStore = create<SourcingState>()(
  persist(
    (set) => ({
      projects: [],
      currentProjectId: null,
      badgeText: 'Pro',

      createProject: (name) => set((state) => {
        const newProj = {
          id: uuidv4(),
          name,
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return {
          projects: [...state.projects, newProj],
          currentProjectId: newProj.id,
        };
      }),

      switchProject: (id) => set({ currentProjectId: id }),

      deleteProject: (id) => set((state) => {
        const newProjects = state.projects.filter(p => p.id !== id);
        return {
          projects: newProjects,
          currentProjectId: state.currentProjectId === id 
            ? (newProjects.length > 0 ? newProjects[0].id : null) 
            : state.currentProjectId
        };
      }),

      updateProjectName: (id, name) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, name, updatedAt: Date.now() } : p)
      })),

      updateBadgeText: (text) => set({ badgeText: text }),

      themeColor: 'blue',
      avatarType: 'animated',
      avatarValue: 'ʕ•ᴥ•ʔ',
      setThemeColor: (color) => set({ themeColor: color }),
      setAvatar: (type, value) => set({ avatarType: type, avatarValue: value }),

      addItem: (item) => set((state) => {
        if (!state.currentProjectId) return state;
        const newItem = { ...item, id: uuidv4(), createdAt: Date.now() };
        return {
          projects: state.projects.map(p => 
            p.id === state.currentProjectId 
              ? { ...p, items: [...p.items, newItem], updatedAt: Date.now() }
              : p
          )
        };
      }),

      updateItem: (itemId, data) => set((state) => {
        if (!state.currentProjectId) return state;
        return {
          projects: state.projects.map(p => 
            p.id === state.currentProjectId
              ? { ...p, items: p.items.map(i => i.id === itemId ? { ...i, ...data } : i), updatedAt: Date.now() }
              : p
          )
        };
      }),

      removeItem: (itemId) => set((state) => {
         if (!state.currentProjectId) return state;
         return {
           projects: state.projects.map(p => 
             p.id === state.currentProjectId
               ? { ...p, items: p.items.filter(i => i.id !== itemId), updatedAt: Date.now() }
               : p
           )
         };
      }),

      clearCurrentProject: () => set((state) => {
        if (!state.currentProjectId) return state;
        return {
          projects: state.projects.map(p => 
            p.id === state.currentProjectId
              ? { ...p, items: [], updatedAt: Date.now() }
              : p
          )
        };
      }),

      importProject: (projectData) => set((state) => {
        const newProjId = uuidv4();
        // ensure backwards compatibility where some items might not have IDs
        const itemsWithIds = projectData.items.map(item => ({
             ...item,
             id: item.id || uuidv4(),
             createdAt: item.createdAt || Date.now()
        }));

        const newProj = {
          id: newProjId,
          name: projectData.projectName || 'Imported Project',
          items: itemsWithIds,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        return {
          projects: [...state.projects, newProj],
          currentProjectId: newProjId, // Switch to the imported project
        };
      })
    }),
    {
      name: 'alibaba-sourcing-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from legacy { projectName, items } schema
        if (version !== 2 || !persistedState.projects) {
          const oldItems = persistedState.items || [];
          const oldName = persistedState.projectName || 'Dự án Mới';
          const newProjId = uuidv4();
          return {
            projects: [{
              id: newProjId,
              name: oldName,
              items: oldItems,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }],
            currentProjectId: newProjId
          };
        }
        return persistedState as SourcingState;
      }
    }
  )
);
