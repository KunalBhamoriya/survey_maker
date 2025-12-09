import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResponse extends Document {
    surveyId: mongoose.Types.ObjectId;
    answers: Record<string, any>; // questionId -> answer value
    submittedAt: Date;
}

const ResponseSchema = new Schema<IResponse>({
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    answers: { type: Schema.Types.Mixed, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const Response: Model<IResponse> = mongoose.models.Response || mongoose.model<IResponse>('Response', ResponseSchema);

export default Response;
