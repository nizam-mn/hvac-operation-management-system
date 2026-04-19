import { pgTable, uuid, text, timestamp, numeric, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").unique().notNull(),
	password: text("password").notNull(),
	role: text("role").default("sales"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
	id: uuid("id").primaryKey(),

	title: text("title").notNull(), // Project / Lead Name
	clientName: text("client_name").notNull(),

	phone: text("phone"),
	email: text("email"),

	source: text("source"), // Social Media, Referral, etc
	status: text("status").default("new"),

	estimatedValue: text("estimated_value"), // ₹ amount

	assignedTo: uuid("assigned_to"),

	siteVisitDate: timestamp("site_visit_date"),

	notes: text("notes"),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotations = pgTable("quotations", {
	id: uuid("id").primaryKey(),

	leadId: uuid("lead_id"), // relation to leads

	title: text("title"), // "AC Installation - Villa"

	status: text("status").default("draft"),

	totalAmount: numeric("total_amount"), // calculated

	createdBy: uuid("created_by"),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotationItems = pgTable("quotation_items", {
	id: uuid("id").primaryKey(),

	quotationId: uuid("quotation_id"),

	itemName: text("item_name"),

	quantity: numeric("quantity"),
	unitPrice: numeric("unit_price"),
	total: numeric("total"), // quantity × unitPrice

	createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
	id: uuid("id").primaryKey(),

	quotationId: uuid("quotation_id"),
	leadId: uuid("lead_id"),

	name: text("name"),

	status: text("status").default("initiated"),

	assignedTo: uuid("assigned_to"), // project engineer

	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),

	budget: numeric("budget"), // from quotation

	notes: text("notes"), // project remarks
    createdBy: uuid("created_by"),

	createdAt: timestamp("created_at").defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
  id: uuid("id").primaryKey(),

  projectId: uuid("project_id"),

  title: text("title"),

  status: text("status").default("not_started"),

  position: integer("position"), // ✅ IMPORTANT

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey(),

  projectId: uuid("project_id"),

  amount: numeric("amount"),

  totalPaid: numeric("total_paid").default("0"), 

  status: text("status").default("pending"),

  dueDate: timestamp("due_date"),

  paidAt: timestamp("paid_at"), 

  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey(),

  invoiceId: uuid("invoice_id"),

  amount: numeric("amount"),

  type: text("type"), // advance | partial | final

  status: text("status").default("paid"), // usually paid directly

//   dueDate: timestamp("due_date"), // optional
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow(),
});