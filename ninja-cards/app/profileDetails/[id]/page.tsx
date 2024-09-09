
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BASE_API_URL } from '@/utils/constants';

// Lazy load ProfileDetailsContent
const ProfileDetailsContent = dynamic(() => import('../ProfileDetailsContent'), { suspense: true });

export async function generateStaticParams() {
    const res = await fetch(`${BASE_API_URL}/api/profile/allUsers`);  // Use the correct API to get all users
    const users = await res.json();



    if (!Array.isArray(users)) {
        throw new Error("Expected an array of users, but got something else.");
    }

    // Return the paths to pre-render based on the user ids

    return users.map((user: { id: string }) => ({
        id: user.id.toString(),  // Ensure id is a string
    }));
}

const ProfileDetailsPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;

    console.log('id is ' + id);
    if (!id) return notFound();  // Handle 404 if no id is provided

    return (
        <Suspense fallback={<div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>}>
            <ProfileDetailsContent userId={id} />  {/* Pass id as a prop */}
        </Suspense >
    );
};

export default ProfileDetailsPage;