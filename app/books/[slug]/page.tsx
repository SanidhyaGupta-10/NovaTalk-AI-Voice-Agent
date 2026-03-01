import { getBookBySlug } from '@/lib/actions/book.actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { IBook } from '@/types';
import VapiControls from '@/components/VapiControls';
import { auth } from '@clerk/nextjs/server';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BookDetailsPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const { slug } = await params;
    const response = await getBookBySlug(slug);

    if (!response.success || !response.data) {
        redirect('/');
    }

    const book = response.data as IBook;

    return (
        <div className="book-page-container">
            <Link href="/" className="back-btn-floating">
                <ArrowLeft className="size-6 text-[#212a3b]" />
            </Link>

            <div className="vapi-main-container space-y-8">
                {/* Header card */}


                {/* Transcript area */}
                <VapiControls book={book} />
            </div>
        </div>
    );
}
