import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../utils/index.js";
import {
	createLead,
	getLeadsByUser,
	getLeadsWithFilters,
	updateLeadById,
} from "./leads.repository.js";

export const createLeadService = async (data, user) => {
	const { title, clientName, siteVisitDate } = data;

	if (!title || !clientName) {
		throw new ApiError(400, "Title and client name are required");
	}

	//   return createLead({
	//     id: uuidv4(),
	//     ...data,
	//     assignedTo: user.id,
	//   }); 

	return createLead({
		id: uuidv4(),
		...data,
		siteVisitDate: new Date(siteVisitDate), // ✅ FIX HERE
		//   : null,
		createdBy: user.id,
	});
};

export const getLeadsService = async (user, query) => {
	const { role, id } = user;

	let filters = {};

	// 🔥 TEMPORARY FIX: disable admin-only lead scoping so non-admin roles can see leads too
	// if (role !== "admin") {
	// 	filters.assignedTo = id;
	// }

	return getLeadsWithFilters(filters, query);
};

// export const updateLeadService = async (id, data) => {
//   const updated = await updateLeadById(id, {
//     ...data,
//     updatedAt: new Date(),
//   });

//   if (!updated) {
//     throw new ApiError(404, "Lead not found");
//   }

//   return updated;
// };

export const updateLeadService = async (id, data, user) => {
	const status = data.status;

	// 🔥 Marketing restriction
	if (
		["won", "lost", "site_visited", "quoted"].includes(status) &&
		user.role === "marketing"
	) {
		throw new ApiError(403, "Not allowed");
	}

	// 🔥 Sales restriction
	if (
		["new", "contacted", "qualified"].includes(status) &&
		user.role === "sales"
	) {
		throw new ApiError(403, "Sales cannot modify early stages");
	}

	const updated = await updateLeadById(id, {
		...data,
		updatedAt: new Date(),
	});

	if (!updated) {
		throw new ApiError(404, "Lead not found");
	}

	return updated;
};
