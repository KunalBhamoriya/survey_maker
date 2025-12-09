'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Survey {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Home() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch('/api/surveys');
        const data = await res.json();
        if (data.success) {
          setSurveys(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setSurveys(surveys.filter((survey) => survey._id !== id));
      } else {
        alert('Failed to delete survey');
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      alert('Error deleting survey');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Survey Dashboard</h1>
          <Link
            href="/create"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Create New Survey
          </Link>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No surveys yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating your first survey.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {survey.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">
                  {survey.description || 'No description'}
                </p>
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href={`/survey/${survey._id}`}
                    className="w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                  >
                    Take Survey
                  </Link>
                  <Link
                    href={`/survey/${survey._id}/results`}
                    className="w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    View Results
                  </Link>
                  <button
                    onClick={() => handleDelete(survey._id)}
                    className="w-full text-center px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
                  >
                    Delete Survey
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main >
  );
}
