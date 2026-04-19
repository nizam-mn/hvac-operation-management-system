import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_OPTIONS = ["not_started", "initiated", "in_progress", "completed"];

export default function ProjectTasks({ projectId, onClose }) {
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [insertAfter, setInsertAfter] = useState(null);

	const fetchTasks = async () => {
		const res = await api.get(`/projects/${projectId}/tasks`);
		setTasks(res.data.data);
	};

	useEffect(() => {
		fetchTasks();
	}, [projectId]);

	// 🔥 Update task status
	const handleStatusChange = async (taskId, status) => {
		await api.patch(`/projects/tasks/${taskId}`, { status });
		fetchTasks();
	};

	// 🔥 Add new task (with position)
	const handleAddTask = async () => {
		if (!newTaskTitle) return alert("Enter task name");

		let position = 1;

		if (insertAfter) {
			const selected = tasks.find((t) => t.id === insertAfter);
			position = selected.position + 1;
		}

		await api.post(`/projects/${projectId}/tasks`, {
			title: newTaskTitle,
			position,
		});

		setNewTaskTitle("");
		setInsertAfter(null);
		fetchTasks();
	};

	return (
		<div className="fixed inset-0 z-50 p-4 flex">
			<div
				onClick={onClose}
				className=" absolute inset-0 bg-black/40 backdrop-blur-sm"
			/>
			<div className="bg-white p-5 z-50 rounded-xl mx-auto shadow mt-6">
				<h3 className="font-semibold mb-4 text-gray-800">Execution Tasks</h3>

				{/* TASK LIST */}
				<div className="space-y-3">
					{tasks.map((task) => (
						<div
							key={task.id}
							className="flex items-center justify-between border p-3 rounded-lg"
						>
							<div>
								<p className="font-medium text-gray-800">
									{task.position}. {task.title}
								</p>
							</div>

							<select
								value={task.status}
								onChange={(e) => handleStatusChange(task.id, e.target.value)}
								className="border px-2 py-1 rounded text-sm"
							>
								{STATUS_OPTIONS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
					))}
				</div>

				{/* ADD TASK */}
				<div className="mt-5 border-t pt-4">
					<h4 className="font-medium mb-2 text-gray-700">Add Task</h4>

					<input
						type="text"
						placeholder="Task title"
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						className="w-full border p-2 rounded mb-2"
					/>

					{/* INSERT POSITION */}
					<select
						value={insertAfter || ""}
						onChange={(e) => setInsertAfter(e.target.value)}
						className="w-full border p-2 rounded mb-2"
					>
						<option value="">Add at beginning</option>

						{tasks.map((t) => (
							<option key={t.id} value={t.id}>
								After {t.title}
							</option>
						))}
					</select>

					<button
						onClick={handleAddTask}
						className="bg-blue-600 text-white px-3 py-2 rounded w-full"
					>
						Add Task
					</button>
				</div>
			</div>
		</div>
	);
}
