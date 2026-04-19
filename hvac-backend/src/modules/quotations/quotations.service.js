import { v4 as uuidv4 } from "uuid";
import {
	getQuotations,
	getQuotationById,
	getQuotationItems,
	updateQuotationStatus,
} from "./quotations.repository.js";
import { getProjectByQuotationId } from "../projects/projects.repository.js";

import { ApiError } from "../../utils/index.js";
import {
	createQuotation,
	createQuotationItems,
} from "./quotations.repository.js";
import { updateLeadById } from "../leads/leads.repository.js";
import { db } from "../../db/index.js";
import { quotationItems, quotations } from "../../db/schema.js";

// export const createQuotationService = async (data, user) => {
//   const { leadId, title, items } = data;

//   if (!items || items.length === 0) {
//     throw new ApiError(400, "Quotation must have items");
//   }

//   let totalAmount = 0;

//   const quotationId = uuidv4();

//   const processedItems = items.map((item) => {
//     const total = item.quantity * item.unitPrice;
//     totalAmount += total;

//     return {
//       id: uuidv4(),
//       quotationId,
//       itemName: item.itemName,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice,
//       total: total,
//     };
//   });

//   const quotation = await createQuotation({
//     id: quotationId,
//     leadId,
//     title,
//     status: "draft",
//     totalAmount: totalAmount,
//     createdBy: user.id,
//   });

//   await createQuotationItems(processedItems);

//   return {
//     quotation,
//     items: processedItems,
//   };
// };

export const createQuotationService = async (data, user) => {
	return db.transaction(async (tx) => {
		const { leadId, title, items } = data;

		if (!items || items.length === 0) {
			throw new ApiError(400, "Quotation must have items");
		}

		let totalAmount = 0;
		const quotationId = uuidv4();

		const processedItems = items.map((item) => {
			const total = item.quantity * item.unitPrice;
			totalAmount += total;

			return {
				id: uuidv4(),
				quotationId,
				itemName: item.itemName,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				total,
			};
		});

		const [quotation] = await tx
			.insert(quotations)
			.values({
				id: quotationId,
				leadId,
				title,
				status: "draft",
				totalAmount,
				createdBy: user.id,
			})
			.returning();

		await tx.insert(quotationItems).values(processedItems);

		//         await updateLeadById(leadId, {
		//   status: "quoted",
		// });

		return {
			quotation,
			items: processedItems,
		};
	});
};

// list
export const getQuotationsService = async () => {
	return getQuotations();
};

// detail
export const getQuotationDetailService = async (id) => {
	const quotation = await getQuotationById(id);

	if (!quotation) {
		throw new ApiError(404, "Quotation not found");
	}

	const items = await getQuotationItems(id);
	const project = await getProjectByQuotationId(id);

	return { quotation, items, project };
};

// // update status
// export const updateQuotationStatusService = async (id, status) => {
// 	const allowed = ["draft", "approved", "rejected"];

// 	if (!allowed.includes(status)) {
// 		throw new ApiError(400, "Invalid status");
// 	}

// 	if (status === "approved" && user.role !== "admin") {
// 		throw new ApiError(403, "Only admin can approve");
// 	}

// 	if (status === "won" && !["sales", "admin"].includes(user.role)) {
// 		throw new ApiError(403, "Only sales/admin can mark won");
// 	}

// 	if (
// 		status === "negotiation" &&
// 		!["sales", "marketing", "admin"].includes(user.role)
// 	) {
// 		throw new ApiError(403, "Not allowed");
// 	}

// 	return updateQuotationStatus(id, status);
// };

export const updateQuotationStatusService = async (id, status, user) => {
  // ✅ All valid statuses
  const allowedStatuses = [
    "draft",
    "submitted",
    "negotiation",
    "approved",
    "rejected",
    "won",
    "lost",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  // 🔐 ROLE RULES

  // ADMIN → full control
  if (user.role === "admin") {
    return updateQuotationStatus(id, status);
  }

  // SALES RULES
  if (user.role === "sales") {
    if (!["draft", "submitted", "negotiation", "won", "lost"].includes(status)) {
      throw new ApiError(403, "Sales cannot perform this action");
    }
  }

  // MARKETING RULES
  if (user.role === "marketing") {
    if (!["submitted", "negotiation", "lost"].includes(status)) {
      throw new ApiError(403, "Marketing not allowed");
    }
  }

  // 🔥 SPECIAL RULES

  if (status === "approved" && user.role !== "admin") {
    throw new ApiError(403, "Only admin can approve");
  }

  if (status === "won" && !["sales", "admin"].includes(user.role)) {
    throw new ApiError(403, "Only sales/admin can mark won");
  }

  return updateQuotationStatus(id, status);
};
