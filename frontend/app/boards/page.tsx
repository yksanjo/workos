'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

interface Board {
  id: string;
  name: string;
  description: string;
  view_type: string;
  item_count: number;
  created_at: string;
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchBoards();
  }, [isAuthenticated, router]);

  const fetchBoards = async () => {
    try {
      const response = await api.get('/boards');
      setBoards(response.data.boards);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">WorkOS</h1>
          <div className="flex gap-4 items-center">
            <Link href="/workflows" className="text-gray-700 hover:text-gray-900">
              Workflows
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-gray-900">
              Analytics
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Boards</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + New Board
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{board.description || 'No description'}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{board.item_count || 0} items</span>
                <span>{board.view_type}</span>
              </div>
            </Link>
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No boards yet. Create your first board!</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

