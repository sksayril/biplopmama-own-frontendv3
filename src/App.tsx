// import React, { useState, useEffect } from 'react';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import CreditAlert from './components/CreditAlert';
// import LandingPage from './components/Landingpage';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showAuth, setShowAuth] = useState(false);
//   const [user, setUser] = useState<{ userName: string; credits: number } | null>(null);
//   const [showCreditAlert, setShowCreditAlert] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
//     if (token && userData) {
//       setIsLoggedIn(true);
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   useEffect(() => {
//     if (user && user.credits < 50) {
//       setShowCreditAlert(true);
//     }
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUser(null);
//     setShowAuth(false);
//   };

//   // Show landing page if not authenticated and not showing auth forms
//   if (!isLoggedIn && !showAuth) {
//     return <LandingPage onGetStarted={() => setShowAuth(true)} />;
//   }

//   // Show auth forms
//   if (!isLoggedIn && showAuth) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           {showSignup ? (
//             <SignUp onSuccess={() => setShowSignup(false)} />
//           ) : (
//             <Login 
//               onSuccess={(userData) => {
//                 setIsLoggedIn(true);
//                 setUser(userData);
//               }}
//               onSignupClick={() => setShowSignup(true)}
//             />
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Show dashboard for authenticated users
//   return (
//     <>
//       {showCreditAlert && <CreditAlert onClose={() => setShowCreditAlert(false)} />}
//       <Dashboard user={user!} onLogout={handleLogout} />
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreditAlert from './components/CreditAlert';
// Import removed: import LandingPage from './components/Landingpage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  // This state is no longer needed since we're going directly to login
  // const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ userName: string; credits: number } | null>(null);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user && user.credits < 50) {
      setShowCreditAlert(true);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    // This is no longer needed
    // setShowAuth(false);
  };

  // Show auth forms if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showSignup ? (
            <SignUp onSuccess={() => setShowSignup(false)} />
          ) : (
            <Login
              onSuccess={(userData) => {
                setIsLoggedIn(true);
                setUser(userData);
              }}
              onSignupClick={() => setShowSignup(true)}
            />
          )}
        </div>
      </div>
    );
  }

  // Show dashboard for authenticated users
  return (
    <>
      {showCreditAlert && <CreditAlert onClose={() => setShowCreditAlert(false)} />}
      <Dashboard user={user!} onLogout={handleLogout} />
    </>
  );
}

export default App;