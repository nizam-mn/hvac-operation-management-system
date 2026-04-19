import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../utils/index.js";
import {
	createInvoice,
	getInvoices,
	updateInvoice,
} from "./invoices.repository.js";
import { getProjectById } from "../projects/projects.repository.js";
import { getInvoiceByProjectId } from "./invoices.repository.js";

export const createInvoiceService = async (data) => {
	const { projectId, amount, dueDate } = data;

	const project = await getProjectById(projectId);

	if (!projectId || !amount) {
		throw new ApiError(400, "Project and amount required");
	}

	if (!project) {
		throw new ApiError(404, "Project not found");
	}

	const existing = await getInvoiceByProjectId(projectId);

	if (existing) {
		throw new ApiError(400, "Invoice already exists for this project");
	}

	return createInvoice({
		id: uuidv4(),
		projectId,
		amount: String(amount),
		status: "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
	});
};

export const getInvoicesService = async () => {
	return getInvoices();
};

export const updateInvoiceService = async (id, data) => {
	const allowed = ["pending", "paid", "overdue"];

	if (data.status && !allowed.includes(data.status)) {
		throw new ApiError(400, "Invalid status");
	}

	// 🔥 auto set payment date
	if (data.status === "paid") {
		data.paidAt = new Date();
	}

	return updateInvoice(id, data);
};
