import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Question {
    id: string;
    type: string; // 'text', 'radio', 'checkbox', etc.
    title: string;
    options?: string[];
    required?: boolean;
}

export interface ISurvey extends Document {
    title: string;
    description?: string;
    questions: Question[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const QuestionSchema = new Schema<Question>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    options: { type: [String], default: [] },
    required: { type: Boolean, default: false },
}, { _id: false });

const SurveySchema = new Schema<ISurvey>({
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [QuestionSchema], default: [] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Survey: Model<ISurvey> = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);

export default Survey;
