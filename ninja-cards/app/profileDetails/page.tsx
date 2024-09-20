// // File: pages/profileDetails/index.tsx

// import { GetServerSideProps } from 'next';

// export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
//   const { id } = query;

//   if (id) {
//     res.writeHead(302, {
//       Location: `/profileDetails/${id}`,  // Redirect to /profileDetails/1
//     });
//     res.end();
//   }

//   return { props: {} }; // This is required to prevent errors
// };

// const ProfileDetailsRedirect = () => {
//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <p>Redirecting...</p>
//     </div>
//   );
// };

// export default ProfileDetailsRedirect;
