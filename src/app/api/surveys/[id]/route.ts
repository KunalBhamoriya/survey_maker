import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Survey from '@/models/Survey';
import Response from '@/models/Response';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

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

        return NextResponse.json({ success: true, data: survey });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch survey' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const survey = await Survey.findById(id);

        if (!survey) {
            return NextResponse.json({ success: false, error: 'Survey not found' }, { status: 404 });
        }

        if (survey.userId.toString() !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await Survey.findByIdAndDelete(id);

        // Clean up associated responses
        await Response.deleteMany({ surveyId: id });

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete survey' }, { status: 400 });
    }
}
