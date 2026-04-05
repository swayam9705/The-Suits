import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import "./App.css"
import MainLayout from "./components/layout/MainLayout"
import Home from "./pages/Home"
import AccessFiles from "./pages/AccessFiles"

import "./App.css"
import CreateConference from "./pages/CreateConference"
import JoinConference from "./pages/JoinConference"
import ConferenceRoom from "./pages/ConferenceRoom"

function App() {

	return (
		<div className='app'>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="/createConference" element={<CreateConference />} />
					<Route path="/joinConference" element={<JoinConference />} />
					<Route path="/conferenceRoom/:conf_id" element={<ConferenceRoom />} />
					<Route path="/accessFiles" element={<AccessFiles />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Route>
			</Routes>
		</div>
	)
}

export default App