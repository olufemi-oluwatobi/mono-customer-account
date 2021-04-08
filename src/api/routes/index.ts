import { Router, Request, Response } from "express";
import { resolveContent } from "nodemailer/lib/shared";
import account from "./accounts";
import transaction from "./transactions";



const routes = Router();


routes.use("/account", account);
routes.use("/transaction", transaction);




export default routes;
