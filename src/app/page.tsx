'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface Survey {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  interface SurveyWithCreator extends Survey {
    userId: {
      name: string;
      _id: string; // Ensure we have the ID for comparison
    } | string; // Could be string if not populated, but we expect populated
  }
  const [surveys, setSurveys] = useState<SurveyWithCreator[]>([]);

  useEffect(() => {
    // Fetch surveys regardless of auth status
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
  }, []); // Run once on mount

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
        alert(data.error || 'Failed to delete survey');
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
          <div className="flex gap-4 items-center">
            {status === 'authenticated' ? (
              <>
                <span className="text-gray-600">Welcome, {session.user?.name}</span>
                <Link
                  href="/create"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Create New Survey
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-blue-200 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-x-2 space-y-2 sm:space-x-4 flex flex-col sm:flex-row">
                <Link
                  href="/login"
                  className="px-1 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-1 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Removed unauthenticated blocking message - Shows surveys for all */}

        <>
          {surveys.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">No surveys available</h3>
              <p className="mt-1 text-gray-500">
                {status === 'authenticated' ? 'Get started by creating your first survey.' : 'Login to create a survey.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {surveys.map((survey) => {
                const creatorName = typeof survey.userId === 'object' && survey.userId !== null
                  ? (survey.userId as any).name
                  : 'Unknown';
                const creatorId = typeof survey.userId === 'object' && survey.userId !== null
                  ? (survey.userId as any)._id
                  : survey.userId;

                const isOwner = status === 'authenticated' && session?.user?.id === creatorId;

                return (
                  <div
                    key={survey._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                      {survey.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">Created by: {creatorName}</p>
                    <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
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
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(survey._id)}
                          className="w-full text-center px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
                        >
                          Delete Survey
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      </div>
    </main >
  );
}
