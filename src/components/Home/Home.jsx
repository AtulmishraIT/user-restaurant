import React from 'react';
import Sugg from './sugg';
import Image from './Image';
import Cards from './cards';
import usePageRefresh from '../usePageRefresh';

function Home() {
  const hasRefreshed = usePageRefresh();

  if (!hasRefreshed) {
    return null; // Render nothing until the page has been refreshed
  }

  return (
    <>
      <Sugg />
      {/* <Image /> */}
      <Cards />
    </>
  );
}

export default Home;