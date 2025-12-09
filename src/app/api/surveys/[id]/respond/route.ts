import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Response from '@/models/Response';
import Survey from '@/models/Survey';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        // Verify survey exists
        const survey = await Survey.findById(id);
        if (!survey) {
            return NextResponse.json({ success: false, error: 'Survey not found' }, { status: 404 });
        }

        const response = await Response.create({
            surveyId: new mongoose.Types.ObjectId(id),
            answers: body.answers,
        });

        return NextResponse.json({ success: true, data: response }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to submit response' }, { status: 400 });
    }
}
