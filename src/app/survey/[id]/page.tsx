'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
    id: string;
    type: string;
    title: string;
    options: string[];
    required: boolean;
}

interface Survey {
    _id: string;
    title: string;
    description: string;
    questions: Question[];
}

export default function TakeSurvey({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    // Unwrap params using React.use()
    const { id } = use(params);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await fetch(`/api/surveys/${id}`);
                const data = await res.json();
                if (data.success) {
                    setSurvey(data.data);
                } else {
                    alert('Failed to load survey');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
        setAnswers((prev) => {
            const current = prev[questionId] || [];
            if (checked) {
                return { ...prev, [questionId]: [...current, option] };
            } else {
                return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/surveys/${id}/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });

            if (res.ok) {
                alert('Thank you for your response!');
                router.push('/');
            } else {
                alert('Failed to submit response');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!survey) return <div className="p-8">Survey not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            <p className="text-gray-600 mb-8">{survey.description}</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {survey.questions.map((q) => (
                    <div key={q.id} className="p-6 bg-white border rounded shadow-sm">
                        <h3 className="text-lg font-semibold mb-3">
                            {q.title} {q.required && <span className="text-red-500">*</span>}
                        </h3>

                        {q.type === 'text' && (
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                required={q.required}
                            />
                        )}

                        {q.type === 'radio' && (
                            <div className="space-y-2">
                                {q.options.map((option) => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={option}
                                            id={`${q.id}-${option}`}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            required={q.required}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`${q.id}-${option}`}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === 'checkbox' && (
                            <div className="space-y-2">
                                {q.options.map((option) => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`${q.id}-${option}`}
                                            onChange={(e) => handleCheckboxChange(q.id, option, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`${q.id}-${option}`}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 block mx-auto"
                >
                    Submit Response
                </button>
            </form>
        </div>
    );
}
