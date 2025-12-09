import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Survey from '@/models/Survey';

export async function GET() {
    try {
        await dbConnect();
        const surveys = await Survey.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: surveys });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch surveys' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const survey = await Survey.create(body);
        return NextResponse.json({ success: true, data: survey }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create survey' }, { status: 400 });
    }
}
