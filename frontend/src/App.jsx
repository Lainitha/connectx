import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { baseUrl } from "./constant/url";


function App() {
	const { data: authUser, isLoading, error } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				console.log("Making request to:", `${baseUrl}/api/auth/me`);
				const res = await fetch(`${baseUrl}/api/auth/me`,{
					method : "GET",
					credentials : "include",
					headers : {
						"Content-Type": "application/json"
					}
				});
				console.log("Response status:", res.status);
				const data = await res.json();
				console.log("Response data:", data);
				if (data.error) return null;
				if (!res.ok) {
					// For 401 (Unauthorized), return null instead of throwing error
					if (res.status === 401) {
						return null;
					}
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				console.error("Error in auth query:", error);
				throw new Error(error);
			}
		},
		retry: false,
	});

	console.log("Auth state:", { authUser, isLoading, error });

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<div className='text-center'>
					<h2 className='text-xl font-bold text-red-600 mb-4'>Connection Error</h2>
					<p className='text-gray-600 mb-4'>Unable to connect to the server.</p>
					<p className='text-sm text-gray-500'>Error: {error.message}</p>
					<button 
						onClick={() => window.location.reload()} 
						className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;
