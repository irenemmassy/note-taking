import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../config/firebase';
import { getNotes, deleteNote, Note, summarizeNote } from '../../services/api';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import toast from 'react-hot-toast';



interface NoteSummary {
  [key: string]: string;
}

export default function NoteDashboard() {
  useDocumentTitle('My Notes');

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summaries, setSummaries] = useState<NoteSummary>({});
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, [currentUser]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      setError('');
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch {
      setError('Failed to log out');
      toast.error('Failed to log out');
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/notes/${noteId}/edit`);
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter(note => note._id !== noteId));
        toast.success('Note deleted successfully');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const handleSummarize = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (summaries[noteId]) {
      // If summary exists, remove it
      const newSummaries = { ...summaries };
      delete newSummaries[noteId];
      setSummaries(newSummaries);
      return;
    }

    try {
      setSummarizing(noteId);
      const result = await summarizeNote(noteId);
      setSummaries(prev => ({
        ...prev,
        [noteId]: result.summary
      }));
      toast.success('Note summarized successfully');
    } catch (error) {
      console.error('Error summarizing note:', error);
      toast.error('Failed to summarize note');
    } finally {
      setSummarizing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div className="h-10 w-48 bg-[#E0E5EC] rounded-xl animate-pulse shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)]"></div>
              <div className="space-x-4 flex">
                <div className="h-10 w-24 bg-[#E0E5EC] rounded-xl animate-pulse shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)]"></div>
                <div className="h-10 w-24 bg-[#E0E5EC] rounded-xl animate-pulse shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)]"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((placeholder) => (
                <div
                  key={placeholder}
                  className="bg-[#E0E5EC] overflow-hidden rounded-xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] h-[280px] flex flex-col animate-pulse"
                >
                  <div className="px-6 py-5 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-6 w-3/4 bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                      <div className="h-8 w-8 bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                      <div className="h-4 w-5/6 bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                      <div className="h-4 w-4/6 bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-[#E0E5EC] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.4)] mt-auto">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-[#E0E5EC] rounded-full shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                      <div className="h-4 w-32 bg-[#E0E5EC] rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.6)]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-ink">My Notes</h1>
            <div className="space-x-4">
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 rounded-xl bg-[#E0E5EC] text-ink font-semibold shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] transition-all duration-300"
              >
                New Note
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[#E0E5EC] text-gray-600 font-semibold shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] transition-all duration-300"
              >
                Log Out
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4 p-4 rounded-xl bg-[#E0E5EC] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="group bg-[#E0E5EC] overflow-hidden rounded-xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] cursor-pointer hover:shadow-[7px_7px_15px_rgba(163,177,198,0.7),-7px_-7px_15px_rgba(255,255,255,0.9)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col h-[280px]"
                onClick={() => handleEditNote(note._id)}
              >
                <div className="px-6 py-5 flex-grow overflow-y-auto scrollbar-thin">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-ink truncate group-hover:text-primary-600 transition-colors duration-300">
                      {note.title}
                    </h3>
                    <div className="flex space-x-2 ml-2 shrink-0">
                      <button
                        onClick={(e) => handleSummarize(note._id, e)}
                        className={`p-2 rounded-lg text-primary-600 hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all duration-300 hover:bg-primary-50 ${
                          summaries[note._id] ? 'bg-primary-50 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]' : ''
                        }`}
                        title={summaries[note._id] ? "Hide summary" : "Show summary"}
                      >
                        {summarizing === note._id ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(note._id, e)}
                        className="p-2 rounded-lg text-red-600 hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all duration-300 hover:bg-red-50"
                        title="Delete note"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className={`text-gray-600 ${summaries[note._id] ? 'line-clamp-2' : 'line-clamp-4'}`}>
                      {note.content}
                    </p>
                    {summaries[note._id] && (
                      <div className="mt-2 p-3 bg-[#E0E5EC] rounded-lg shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-primary-600">Summary</span>
                          <button
                            onClick={(e) => handleSummarize(note._id, e)}
                            className="text-xs text-gray-500 hover:text-primary-600 transition-colors duration-300"
                          >
                            Hide
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{summaries[note._id]}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-[#E0E5EC] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.3),inset_-5px_-5px_10px_rgba(255,255,255,0.4)] mt-auto shrink-0">
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {new Date(note.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] transform hover:scale-[1.02] transition-all duration-300">
              <p className="text-ink text-lg">No notes yet. Create your first note!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 