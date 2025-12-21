'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Item {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
}

interface BoardViewProps {
  boardId: string;
}

export default function BoardView({ boardId }: BoardViewProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns] = useState(['todo', 'in-progress', 'review', 'completed']);

  useEffect(() => {
    fetchItems();
  }, [boardId]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items', {
        params: { board_id: boardId },
      });
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemsByStatus = (status: string) => {
    return items.filter((item) => item.status === status);
  };

  if (loading) {
    return <div className="p-8">Loading board...</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns.map((column) => (
        <div key={column} className="flex-shrink-0 w-64">
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-4 capitalize">
              {column.replace('-', ' ')} ({getItemsByStatus(column).length})
            </h3>
            <div className="space-y-3">
              {getItemsByStatus(column).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  {item.due_date && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

