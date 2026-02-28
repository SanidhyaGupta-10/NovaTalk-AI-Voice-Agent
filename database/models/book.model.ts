import { Schema, model, models } from 'mongoose';

const BookSchema = new Schema({
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    persona: { type: String },
    fileURL: { type: String, required: true },
    fileBlobKey: { type: String, required: true },
    coverURL: { type: String, required: true },
    coverBlobKey: { type: String },
    fileSize: { type: Number, required: true },
    totalSegments: { type: Number, default: 0 },
}, { timestamps: true });

const Book = models?.Book || model('Book', BookSchema);

export default Book;
