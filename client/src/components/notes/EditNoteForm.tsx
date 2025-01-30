import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNote, updateNote } from '../../services/api';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditNoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const note = await getNote(noteId!);
      setTitle(note.title);
      setContent(note.content);
      setError('');
    } catch (error) {
      console.error('Error fetching note:', error);
      setError('Failed to load note');
      toast.error('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setError('');
      setSaving(true);
      await updateNote(noteId!, { title, content });
      toast.success('Note updated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note');
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-ink">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-ink">Edit Note</h1>
          </div>

          {error && (
            <div className="text-red-500 text-center p-4 rounded-xl bg-[#E0E5EC] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className="block text-ink font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#E0E5EC] text-ink shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-shadow duration-300"
                placeholder="Note title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-ink font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#E0E5EC] text-ink shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-shadow duration-300 resize-none"
                placeholder="Write your note here..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 rounded-xl bg-[#E0E5EC] text-gray-600 font-semibold shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-[#E0E5EC] text-ink font-semibold shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 