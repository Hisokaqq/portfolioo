import React from 'react';
import Skils from './Skils';
import About from './About';

const Me = () => {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <div className="w-[80%] lg:w-[70%] flex-col md:flex md:flex-row justify-between ">
        {window.innerWidth < 768 ? (
          <>
            <About />
            <Skils />
          </>
        ) : (
          <>
            <Skils />
            <About />
          </>
        )}
      </div>
    </div>
  );
};

export default Me;