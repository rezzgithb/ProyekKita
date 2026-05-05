import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

// Store untuk navigasi
export const useNavigationStore = create((set) => ({
  currentPage: 'home',
  previousPage: null,
  direction: 1, // 1 = forward, -1 = backward
  setPage: (page) => set((state) => {
    const pages = ['home', 'budget', 'layout', 'catatan', 'tools'];
    const currentIndex = pages.indexOf(state.currentPage);
    const newIndex = pages.indexOf(page);
    return {
      previousPage: state.currentPage,
      currentPage: page,
      direction: newIndex > currentIndex ? 1 : -1
    };
  }),
}));

// Store untuk proyek (dengan persist ke localStorage)
export const useProjectStore = create(
  persist(
    (set, get) => ({
      activeProject: null,
      projects: [],
      
      // Set proyek aktif
      setActiveProject: (project) => set({ activeProject: project }),
      
      // Tambah proyek baru
      addProject: (name) => {
        const newProject = {
          id: generateId(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          activeProject: newProject
        }));
        return newProject;
      },
      
      // Update proyek
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        ),
        activeProject: state.activeProject?.id === id 
          ? { ...state.activeProject, ...updates, updatedAt: new Date().toISOString() }
          : state.activeProject
      })),
      
      // Hapus proyek
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        activeProject: state.activeProject?.id === id ? null : state.activeProject
      })),
    }),
    {
      name: 'proyekkita-projects',
    }
  )
);

// Store untuk catatan proyek
export const useNotesStore = create(
  persist(
    (set) => ({
      notes: [],
      
      // Tambah catatan
      addNote: (title, content) => {
        const newNote = {
          id: generateId(),
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        return newNote;
      },
      
      // Update catatan
      updateNote: (id, title, content) => set((state) => ({
        notes: state.notes.map(n => 
          n.id === id 
            ? { ...n, title, content, updatedAt: new Date().toISOString() } 
            : n
        )
      })),
      
      // Hapus catatan
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
    }),
    {
      name: 'proyekkita-notes',
    }
  )
);

// Store untuk to-do kerjaan
export const useTodoStore = create(
  persist(
    (set) => ({
      todoConfig: {
        jumlahTukang: 0,
        estimasiHari: 0,
      },
      days: [], // Array of { day: 1, tasks: [{id, text, completed}] }
      
      // Set konfigurasi to-do
      setTodoConfig: (config) => set({ todoConfig: config }),
      
      // Generate hari kerja
      generateDays: (estimasiHari) => {
        const days = Array.from({ length: estimasiHari }, (_, i) => ({
          day: i + 1,
          tasks: []
        }));
        set({ days });
      },
      
      // Tambah task ke hari tertentu
      addTask: (dayIndex, text) => set((state) => ({
        days: state.days.map((d, i) => 
          i === dayIndex 
            ? { ...d, tasks: [...d.tasks, { id: generateId(), text, completed: false }] }
            : d
        )
      })),
      
      // Toggle task completed
      toggleTask: (dayIndex, taskId) => set((state) => ({
        days: state.days.map((d, i) => 
          i === dayIndex 
            ? { 
                ...d, 
                tasks: d.tasks.map(t => 
                  t.id === taskId ? { ...t, completed: !t.completed } : t
                ) 
              }
            : d
        )
      })),
      
      // Update task text
      updateTask: (dayIndex, taskId, text) => set((state) => ({
        days: state.days.map((d, i) => 
          i === dayIndex 
            ? { 
                ...d, 
                tasks: d.tasks.map(t => 
                  t.id === taskId ? { ...t, text } : t
                ) 
              }
            : d
        )
      })),
      
      // Hapus task
      deleteTask: (dayIndex, taskId) => set((state) => ({
        days: state.days.map((d, i) => 
          i === dayIndex 
            ? { ...d, tasks: d.tasks.filter(t => t.id !== taskId) }
            : d
        )
      })),
      
      // Reset semua
      resetTodo: () => set({ 
        todoConfig: { jumlahTukang: 0, estimasiHari: 0 },
        days: []
      }),
    }),
    {
      name: 'proyekkita-todo',
    }
  )
);

// Store untuk hasil kalkulasi budget (sementara, tidak persist)
export const useBudgetStore = create((set) => ({
  landInput: {
    panjang: '',
    lebar: '',
    budget: ''
  },
  result: null,
  
  setLandInput: (input) => set({ landInput: input }),
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null, landInput: { panjang: '', lebar: '', budget: '' } }),
}));

// Store untuk layout generator
export const useLayoutStore = create((set) => ({
  layoutInput: {
    panjang: '',
    lebar: '',
    jumlahKamar: 2,
    ukuranRuangTamu: 'sedang'
  },
  layouts: [],
  
  setLayoutInput: (input) => set({ layoutInput: input }),
  setLayouts: (layouts) => set({ layouts }),
  clearLayouts: () => set({ layouts: [], layoutInput: { panjang: '', lebar: '', jumlahKamar: 2, ukuranRuangTamu: 'sedang' } }),
}));
