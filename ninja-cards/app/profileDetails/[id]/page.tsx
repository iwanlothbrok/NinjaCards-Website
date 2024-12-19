import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BASE_API_URL } from '@/utils/constants';

// Lazy load ProfileDetailsContent
const ProfileDetailsContent = dynamic(() => import('../ProfileDetailsContent'), { suspense: true });

type User = {
    id: string;
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/allUsers`);

        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.statusText}`);
        }

        const users: User[] = await res.json();

        if (!Array.isArray(users)) {
            throw new Error("Expected an array of users, but got something else.");
        }

        // Ensure we handle an empty users array and properly convert ids to strings
        return users.map((user) => ({
            id: user.id.toString(),
        }));
    } catch (error) {
        console.error("Error in generateStaticParams:", error);
        return [];  // Return an empty array to handle errors gracefully
    }
}

const ProfileDetailsPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;

    console.log('id is ' + id);
    if (!id) return notFound();
    // Handle 404 if no id is provided

    return (
        <Suspense fallback={<div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>}>
            <ProfileDetailsContent userId={id} />  {/* Pass id as a prop */}
        </Suspense >
    );
};

export default ProfileDetailsPage;