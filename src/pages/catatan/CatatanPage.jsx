import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Edit3, Trash2, Search, X } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Button, Input, TextArea, Modal, ConfirmModal } from '../../components/ui';
import { useNotesStore } from '../../store';
import { formatDate } from '../../utils/helpers';

export function CatatanPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setErrors({});
  };
  
  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };
  
  const handleOpenEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
    setErrors({});
  };
  
  const handleClose = () => {
    setShowAddModal(false);
    setEditingNote(null);
    resetForm();
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!content.trim()) newErrors.content = 'Isi catatan wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    if (editingNote) {
      updateNote(editingNote.id, title.trim(), content.trim());
    } else {
      addNote(title.trim(), content.trim());
    }
    
    handleClose();
  };
  
  const handleDelete = () => {
    if (deleteConfirm) {
      deleteNote(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="page-wrapper">
      <Header 
        title="Catatan Proyek" 
        subtitle={`${notes.length} catatan`}
        rightAction={
          <Button size="icon" onClick={handleOpenAdd}>
            <Plus size={20} />
          </Button>
        }
      />
      
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Search */}
          {notes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 transition-colors text-slate-800 placeholder:text-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Empty State */}
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-amber-500" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Belum Ada Catatan</h3>
              <p className="text-slate-500 text-sm mb-4">
                Mulai catat progres atau kebutuhan proyek Anda
              </p>
              <Button onClick={handleOpenAdd}>
                <Plus size={18} />
                Buat Catatan Pertama
              </Button>
            </motion.div>
          )}
          
          {/* Notes List */}
          {filteredNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredNotes.map((note, index) => (
                <motion.div 
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{note.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{note.content}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(note)}
                          className="p-2 rounded-lg active:bg-slate-100 transition-colors"
                        >
                          <Edit3 size={18} className="text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(note)}
                          className="p-2 rounded-lg active:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* No Search Results */}
          {notes.length > 0 && filteredNotes.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-slate-500">Tidak ada catatan yang cocok dengan "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || !!editingNote}
        onClose={handleClose}
        title={editingNote ? 'Edit Catatan' : 'Catatan Baru'}
        actions={
          <>
            <Button variant="secondary" onClick={handleClose} fullWidth>
              Batal
            </Button>
            <Button onClick={handleSave} fullWidth>
              {editingNote ? 'Simpan' : 'Tambah'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Judul"
            placeholder="Contoh: Beli semen tambahan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
          <TextArea
            label="Isi Catatan"
            placeholder="Tulis detail catatan di sini..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={errors.content}
          />
        </div>
      </Modal>
      
      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Catatan"
        message={`Yakin ingin menghapus "${deleteConfirm?.title}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
