import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await getSession();
      if (!session) {
        navigate('/admin/login', { replace: true });
        return;
      }
      await loadContacts();
    };

    checkAuthAndLoad();
  }, [navigate]);

  const loadContacts = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      if (fetchError.message.includes('JWT') || fetchError.code === 'PGRST301') {
        await signOut();
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to load contact submissions');
    } else {
      setContacts(data ?? []);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    const { error: deleteError } = await supabase.from('contacts').delete().eq('id', id);

    if (deleteError) {
      if (deleteError.message.includes('JWT') || deleteError.code === 'PGRST301') {
        await signOut();
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to delete submission');
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }

    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <header className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">IOCA Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Contact Submissions</h2>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-brand-navy/60">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-brand-navy/60">No contact submissions yet.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-brand-navy/10 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-navy/10 bg-brand-gray">
                  <th className="px-4 py-3 font-bold text-brand-navy">Name</th>
                  <th className="px-4 py-3 font-bold text-brand-navy">Email</th>
                  <th className="px-4 py-3 font-bold text-brand-navy">Subject</th>
                  <th className="px-4 py-3 font-bold text-brand-navy">Message</th>
                  <th className="px-4 py-3 font-bold text-brand-navy">Date</th>
                  <th className="px-4 py-3 font-bold text-brand-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-brand-navy/5 hover:bg-brand-gray/50">
                    <td className="px-4 py-3 text-brand-navy">{contact.name}</td>
                    <td className="px-4 py-3 text-brand-navy">{contact.email}</td>
                    <td className="px-4 py-3 text-brand-navy">—</td>
                    <td className="px-4 py-3 text-brand-navy max-w-xs truncate">{contact.message}</td>
                    <td className="px-4 py-3 text-brand-navy/70 whitespace-nowrap">{formatDate(contact.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={deletingId === contact.id}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingId === contact.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
