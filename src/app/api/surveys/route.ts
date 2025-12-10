import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Survey from '@/models/Survey';

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";


export async function GET(request: Request) {
    try {
        await dbConnect();
        const surveys = await Survey.find({}).populate('userId', 'name').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: surveys });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch surveys' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const survey = await Survey.create({ ...body, userId: session.user.id as any });
        return NextResponse.json({ success: true, data: survey }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create survey' }, { status: 400 });
    }
}
