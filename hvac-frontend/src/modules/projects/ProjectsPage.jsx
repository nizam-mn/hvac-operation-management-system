import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ProjectForm from "./ProjectForm";
import ProjectDetailModal from "../../components/ProjectDetailModal";
import ProjectList from "../../components/ProjectList";

export default function ProjectsPage() {

	const { user } = useAuth();
	const [selectedProjectForm, setSelectedProjectForm] = useState(null);


	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
			</div>

			{/* Project Grid */}
			<ProjectList
				// fetchProjects={fetchProjects}
				// projects={projects}
				// setSelectedQuotation={setSelectedQuotation}
				// setSelectedProjectForm={setSelectedProjectForm}
			/>


			
		</div>
	);
}
