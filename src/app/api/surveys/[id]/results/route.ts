import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Response from '@/models/Response';
import Survey from '@/models/Survey';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const survey = await Survey.findById(id);
        if (!survey) {
            return NextResponse.json({ success: false, error: 'Survey not found' }, { status: 404 });
        }

        const responses = await Response.find({ surveyId: id });

        return NextResponse.json({
            success: true,
            data: {
                survey,
                responses,
                totalResponses: responses.length,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 400 });
    }
}
