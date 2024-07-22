import {type ActionFunctionArgs, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {DiContext} from "~/middleware/di/di.server";

export const action = async ({params, context}: ActionFunctionArgs) => {
	const contactActionService = context.get(DiContext).contactActionService;
	invariant(params.contactId, "Missing contactId param");
	await contactActionService.deleteContact(params.contactId);
	return redirect("/");
}
