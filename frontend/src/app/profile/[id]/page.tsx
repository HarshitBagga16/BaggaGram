import React from 'react'
import Profile from '../../../components/ui/Profile'
import LeftSideBar from '@/components/ui/LeftSideBar'

const page = async ({ params }) => {
  // Await params before using
  const awaitedParams = await params;
  return (
    <div>
      <LeftSideBar />
      <Profile userId={awaitedParams.id} />
    </div>
  );
};


export default page
