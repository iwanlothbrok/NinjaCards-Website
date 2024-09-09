import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProfileDetailsRedirect = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // If the `id` exists in the query, redirect to the dynamic route
      router.push(`/profileDetails/${id}`);
    }
  }, [id, router]);

  // You can return a loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default ProfileDetailsRedirect;
