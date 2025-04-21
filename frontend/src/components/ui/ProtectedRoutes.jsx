'use client'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounting, setMounting] = useState(true);

  // Define public routes that don't need protection
  const publicRoutes = ['/loginPage', '/signupPage', '/registerPage'];
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Only perform redirects after initial mount to prevent flashes
    if (mounting) {
      setMounting(false);
      return;
    }

    // If user is not logged in and trying to access a protected route
    if (!user && !isPublicRoute) {
      router.replace('/loginPage');
    }

    // If user is logged in and visits a public route (login/signup), redirect to home
    if (user && isPublicRoute) {
      router.replace('/home');
    }
  }, [user, pathname, mounting]);

  // During initial mount, show a minimal loading state if needed
  if (mounting) {
    return children; // Return children during mounting to prevent flash
  }

  // For all other cases, just render children
  return children;
};

export default ProtectedRoutes;
