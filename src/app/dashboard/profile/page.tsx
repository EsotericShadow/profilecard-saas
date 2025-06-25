'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileCard from '@/components/blocks/ProfileCard/ProfileCard';

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    handle: '',
    status: '',
    contactText: '',
    avatarUrl: '',
    iconUrl: '',
    grainUrl: '',
    miniAvatarUrl: '',
    behindGradient: '',
    innerGradient: '',
    showBehindGradient: true,
    enableTilt: true,
    showUserInfo: true,
    cardRadius: 30,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (session) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || 'Javi A. Torres',
          title: data.title || 'Software Engineer',
          handle: data.handle || 'javicodes',
          status: data.status || 'Online',
          contactText: data.contactText || 'Contact',
          avatarUrl: data.avatarUrl || '/avatar.png',
          iconUrl: data.iconUrl || '/icon.png',
          grainUrl: data.grainUrl || '/grain.png',
          miniAvatarUrl: data.miniAvatarUrl || '/avatar.png',
          behindGradient: data.behindGradient || 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%)',
          innerGradient: data.innerGradient || 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)',
          showBehindGradient: data.showBehindGradient ?? true,
          enableTilt: data.enableTilt ?? true,
          showUserInfo: data.showUserInfo ?? true,
          cardRadius: data.cardRadius ?? 30,
        }))
        .catch(() => setMessage('Failed to load profile data'));
    }
  }, [session]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.handle.trim()) newErrors.handle = 'Handle is required';
    if (!formData.status.trim()) newErrors.status = 'Status is required';
    if (!formData.contactText.trim()) newErrors.contactText = 'Contact text is required';
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) newErrors.avatarUrl = 'Invalid URL';
    if (formData.iconUrl && !isValidUrl(formData.iconUrl)) newErrors.iconUrl = 'Invalid URL';
    if (formData.grainUrl && !isValidUrl(formData.grainUrl)) newErrors.grainUrl = 'Invalid URL';
    if (formData.miniAvatarUrl && !isValidUrl(formData.miniAvatarUrl)) newErrors.miniAvatarUrl = 'Invalid URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('Please fix form errors');
      return;
    }
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cardRadius: Number(formData.cardRadius) }),
      });
      if (res.ok) {
        setMessage('Profile saved successfully');
      } else {
        setMessage('Error saving profile');
      }
    } catch {
      setMessage('Error saving profile');
    }
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e]">
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-white">Profile Card Settings</h2>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Javi A. Torres"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Handle</label>
                <input
                  name="handle"
                  value={formData.handle}
                  onChange={handleChange}
                  placeholder="@javicodes"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.handle && <p className="text-red-500 text-sm mt-1">{errors.handle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Status</label>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Online"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Contact Text</label>
                <input
                  name="contactText"
                  value={formData.contactText}
                  onChange={handleChange}
                  placeholder="Contact"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.contactText && <p className="text-red-500 text-sm mt-1">{errors.contactText}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Avatar URL</label>
                <input
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="/avatar.png"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.avatarUrl && <p className="text-red-500 text-sm mt-1">{errors.avatarUrl}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Icon URL</label>
                <input
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleChange}
                  placeholder="/icon.png"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.iconUrl && <p className="text-red-500 text-sm mt-1">{errors.iconUrl}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Grain URL</label>
                <input
                  name="grainUrl"
                  value={formData.grainUrl}
                  onChange={handleChange}
                  placeholder="/grain.png"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.grainUrl && <p className="text-red-500 text-sm mt-1">{errors.grainUrl}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Mini Avatar URL</label>
                <input
                  name="miniAvatarUrl"
                  value={formData.miniAvatarUrl}
                  onChange={handleChange}
                  placeholder="/avatar.png"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
                {errors.miniAvatarUrl && <p className="text-red-500 text-sm mt-1">{errors.miniAvatarUrl}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Behind Gradient</label>
                <textarea
                  name="behindGradient"
                  value={formData.behindGradient}
                  onChange={handleChange}
                  placeholder="radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%)"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Inner Gradient</label>
                <textarea
                  name="innerGradient"
                  value={formData.innerGradient}
                  onChange={handleChange}
                  placeholder="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Card Radius (px)</label>
                <input
                  type="number"
                  name="cardRadius"
                  value={formData.cardRadius}
                  onChange={handleChange}
                  placeholder="30"
                  className="p-2 rounded border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  min="0"
                  max="50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  name="showBehindGradient"
                  checked={formData.showBehindGradient}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                Show Behind Gradient
              </label>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  name="enableTilt"
                  checked={formData.enableTilt}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                Enable Tilt Effect
              </label>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  name="showUserInfo"
                  checked={formData.showUserInfo}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                Show User Info
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-500"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            {message && <p className="mt-2 text-sm text-white">{message}</p>}
          </form>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4 text-white">Live Preview</h3>
        <div className="w-full max-w-sm">
          <ProfileCard
            {...formData}
            onContactClick={() => console.log('Contact clicked')}
            className="custom-profile-card"
          />
        </div>
      </div>
    </div>
  );
}