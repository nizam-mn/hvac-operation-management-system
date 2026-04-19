import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import leadsRoutes from "./modules/leads/leads.routes.js";
import quotationRoutes from "./modules/quotations/quotations.routes.js";
import projectRoutes from "./modules/projects/projects.routes.js";
import invoiceRoutes from "./modules/invoices/invoices.routes.js";
import paymentsRoutes from "./modules/payments/payments.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

// Performance & Parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check
app.get('/', (req, res) => {
  res.send('HVAC API Running');
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/leads", leadsRoutes);
app.use("/api/v1/quotations", quotationRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/payments", paymentsRoutes);

// Global Error Handler (Must be last)
app.use(errorMiddleware);

export default app;