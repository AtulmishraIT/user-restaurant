import { useEffect, useState } from 'react';

const usePageRefresh = () => {
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('hasRefreshed')) {
      sessionStorage.setItem('hasRefreshed', 'true');
      setHasRefreshed(true);
      window.location.reload();
    } else {
      setHasRefreshed(true);
    }
  }, []);

  return hasRefreshed;
};

export default usePageRefresh;