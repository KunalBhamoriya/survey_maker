'use client';

import { useEffect, useState, use } from 'react';

interface Question {
    id: string;
    type: string;
    title: string;
    options: string[];
}

interface Survey {
    _id: string;
    title: string;
    questions: Question[];
}

interface Response {
    answers: Record<string, any>;
    submittedAt: string;
}

export default function SurveyResults({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<{ survey: Survey; responses: Response[]; totalResponses: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const { id } = use(params);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`/api/surveys/${id}/results`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Results not found</div>;

    const { survey, responses, totalResponses } = data;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Results: {survey.title}</h1>
            <p className="text-xl mb-8">Total Responses: {totalResponses}</p>

            <div className="space-y-8">
                {survey.questions.map((q) => (
                    <div key={q.id} className="p-6 bg-white border rounded shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">{q.title}</h3>

                        {q.type === 'text' && (
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {responses.map((r, i) => (
                                    <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                                        {r.answers[q.id] || <span className="text-gray-400 italic">No answer</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {(q.type === 'radio' || q.type === 'checkbox') && (
                            <div className="space-y-2">
                                {q.options.map((option) => {
                                    const count = responses.reduce((acc, r) => {
                                        const answer = r.answers[q.id];
                                        if (Array.isArray(answer)) {
                                            return acc + (answer.includes(option) ? 1 : 0);
                                        }
                                        return acc + (answer === option ? 1 : 0);
                                    }, 0);
                                    const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : '0';

                                    return (
                                        <div key={option}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{option}</span>
                                                <span>{count} ({percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
