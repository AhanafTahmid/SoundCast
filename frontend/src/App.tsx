import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/Admin/AdminPage";
import CreatePodcast from "./components/podcast/CreatePodcast";
import AllPodCast from "./components/podcast/AllPodCast";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import AllTTS from "./components/textToSpeech/AllTTS";
import CreateTTS from "./components/textToSpeech/CreateTTS";

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallBackPage />} />
				<Route path='/admin' element={<AdminPage />} />

				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/create-podcast' element={<CreatePodcast />} />
					<Route path='/all-podcasts' element={<AllPodCast />} />
					<Route path='/create-tts' element={<CreateTTS />} />
					<Route path='/all-tts' element={<AllTTS />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;