'use client';
// Nút yêu thích (trái tim) — toggle lưu/bỏ yêu thích, disable nếu chưa đăng nhập

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isFavorited, addFavorite, removeFavorite } from '@/lib/favorites';

export default function FavoriteButton({ documentId, userId }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    isFavorited(userId, documentId).then(setFavorited);
  }, [userId, documentId]);

  if (!userId) {
    return (
      <button
        disabled
        title="Đăng nhập để lưu yêu thích"
        className="text-gray-300 cursor-not-allowed"
      >
        <Heart size={18} />
      </button>
    );
  }

  async function handleToggle() {
    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(userId, documentId);
        setFavorited(false);
      } else {
        await addFavorite(userId, documentId);
        setFavorited(true);
      }
    } catch (err) {
      console.error('Lỗi cập nhật yêu thích:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={favorited ? 'Bỏ yêu thích' : 'Lưu yêu thích'}
      className={`transition-colors ${
        favorited ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-red-400'
      } disabled:opacity-50`}
    >
      <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
    </button>
  );
}
