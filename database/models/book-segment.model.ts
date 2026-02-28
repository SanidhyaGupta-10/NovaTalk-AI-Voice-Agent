import { Schema, model, models } from 'mongoose';

const BookSegmentSchema = new Schema({
    clerkId: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true },
    pageNumber: { type: Number },
    wordCount: { type: Number, required: true },
}, { timestamps: true });

// Create text index for search
BookSegmentSchema.index({ content: 'text' });

const BookSegment = models?.BookSegment || model('BookSegment', BookSegmentSchema);

export default BookSegment;
