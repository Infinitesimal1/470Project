import { useEffect } from 'react';

const useAuthRole = (allowedRoles = []) => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !allowedRoles.includes(user.role)) {
      alert('Access denied.');
      window.location.href = '/';
    }
  }, [allowedRoles]);
};

export default useAuthRole;
