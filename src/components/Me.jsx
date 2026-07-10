import Skills from './Skills';
import About from './About';

const Me = () => {
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center">
      {/* DOM order is Skills → About; on mobile flex-col-reverse puts About on
          top, on desktop md:flex-row keeps Skills left / About right. No JS. */}
      <div className="w-[80%] lg:w-[70%] flex flex-col-reverse md:flex-row justify-between">
        <Skills />
        <About />
      </div>
    </div>
  );
};

export default Me;
