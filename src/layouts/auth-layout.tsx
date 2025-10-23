import { Outlet } from 'react-router-dom';

const AuthenticationLayout = () => {
  return (
       <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative"> 
        <img src="/img/bg.png" className='absolute w-full h-full object-cover opacity-20 pointer-events-none' alt="Background" />
        <div className="relative z-10 w-full max-w-md">
          <Outlet />
        </div>



    </div>
  );
};
export default AuthenticationLayout;