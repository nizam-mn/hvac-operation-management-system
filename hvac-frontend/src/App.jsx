import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./modules/auth/Login";
import Profile from "./modules/auth/Profile";
import LeadsPage from "./modules/leads/LeadsPage";
import QuotationsPage from "./modules/quotations/QuotationsPage";
import QuotationForm from "./modules/quotations/QuotationForm";
import ProjectsPage from "./modules/projects/ProjectsPage";
import InvoicesPage from "./modules/invoices/InvoicePage";

function App() {
	return (
		<AuthProvider>
			<Navbar />

			<Routes>
				<Route
					path="/login"
					element={
						<ProtectedRoute protect={false}>
							<Login />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/leads"
					element={
						<ProtectedRoute>
							<LeadsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/quotations"
					element={
						<ProtectedRoute>
							<QuotationsPage />
						</ProtectedRoute>
					}
				/>
				
                <Route
					path="/projects"
					element={
						<ProtectedRoute>
							<ProjectsPage />
						</ProtectedRoute>
					}
				/>
                <Route
					path="/invoices"
					element={
						<ProtectedRoute>
							<InvoicesPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/quotations/create/:leadId"
					element={
						<ProtectedRoute>
							<QuotationForm />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
