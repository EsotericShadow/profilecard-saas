'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LinkItem {
  id: string;
  url: string;
  type: string;
  order: number;
}

export default function LinksPage() {
  const { data: session } = useSession();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [formData, setFormData] = useState({ url: '', type: '', order: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchLinks();
    }
  }, [session]);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      } else {
        setError('Failed to fetch links');
      }
    } catch {
      setError('Error fetching links');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ url: '', type: '', order: 0 });
        fetchLinks();
      } else {
        setError('Failed to add link');
      }
    } catch {
      setError('Error adding link');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchLinks();
      } else {
        setError('Failed to delete link');
      }
    } catch {
      setError('Error deleting link');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white">Manage Links</h2>
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-white mb-1">URL</label>
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Type</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Social, Website, etc."
              className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
              className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Link'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <h3 className="text-xl font-bold mb-4 text-white">Your Links</h3>
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-white">No links added yet.</p>
        ) : (
          <ul className="space-y-4">
            {links.map(link => (
              <li key={link.id} className="flex justify-between items-center bg-gray-800 p-4 rounded border border-gray-600">
                <div>
                  <p className="text-white">{link.url}</p>
                  <p className="text-gray-400 text-sm">Type: {link.type}, Order: {link.order}</p>
                </div>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}