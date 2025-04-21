'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // If user is logged in, redirect to home page
    if (user) {
      router.replace('/home');
    } else {
      // If user is not logged in, redirect to login page
      router.replace('/loginPage');
    }
  }, [user, router]);

  // Return empty div during the redirect to prevent any flashing
  return <div></div>;
}
