'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
    id: string;
    type: string;
    title: string;
    options: string[];
    required: boolean;
}

export default function CreateSurvey() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: crypto.randomUUID(),
                type: 'text',
                title: '',
                options: [],
                required: false,
            },
        ]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, questions }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('Failed to create survey');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Create New Survey</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="Survey Title"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Survey Description"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Questions</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add Question
                        </button>
                    </div>

                    {questions.map((q, qIndex) => (
                        <div key={q.id} className="p-4 border rounded bg-white shadow-sm space-y-3">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">Question {qIndex + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={q.title}
                                    onChange={(e) => updateQuestion(qIndex, 'title', e.target.value)}
                                    placeholder="Question Title"
                                    className="p-2 border rounded w-full"
                                    required
                                />

                                <select
                                    value={q.type}
                                    onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                    className="p-2 border rounded w-full"
                                >
                                    <option value="text">Text Input</option>
                                    <option value="radio">Multiple Choice (Radio)</option>
                                    <option value="checkbox">Checkboxes</option>
                                </select>
                            </div>

                            {(q.type === 'radio' || q.type === 'checkbox') && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Options (comma separated)</label>
                                    <input
                                        type="text"
                                        value={q.options.join(', ')}
                                        onChange={(e) =>
                                            updateQuestion(
                                                qIndex,
                                                'options',
                                                e.target.value.split(',').map((o) => o.trim())
                                            )
                                        }
                                        placeholder="Option 1, Option 2, Option 3"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={q.required}
                                    onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                                    id={`req-${q.id}`}
                                />
                                <label htmlFor={`req-${q.id}`}>Required</label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700"
                    >
                        Create Survey
                    </button>
                </div>
            </form>
        </div>
    );
}
