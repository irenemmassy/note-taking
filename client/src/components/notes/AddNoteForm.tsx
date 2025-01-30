import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createNote } from '../../services/api';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function AddNoteForm() {
  useDocumentTitle('New Note');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await createNote({ title, content });
      toast.success('Note created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note');
      toast.error('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-ink">Create New Note</h1>
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
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-[#E0E5EC] text-ink font-semibold shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 