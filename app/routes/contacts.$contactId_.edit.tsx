import {type ActionFunctionArgs, type LoaderFunctionArgs, redirect} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import invariant from "tiny-invariant";

import {DiContext} from "~/middleware/di/di.server";
import {updateContactValidator} from "@domain/contacts/validation";
import type {Contact} from "@domain/contacts/Contact";

export const loader = async ({params, context}: LoaderFunctionArgs) => {
	const contactQueryService = context.get(DiContext).contactQueryService;

	invariant(params.contactId, "Missing contactId param");

	const contact = await contactQueryService.getContact(params.contactId);

	if (contact.error) {
		throw new Response(contact.error.message, {status: 404});
	}

	return json({contact});
};

export const action = async ({params, request, context}: ActionFunctionArgs) => {
	const contactActionService = context.get(DiContext).contactActionService;

	invariant(params.contactId, "Missing contactId param");
	const formData = await request.formData();
	console.log('formData: ', formData)
	const updates = updateContactValidator(Object.fromEntries(formData));

	if (updates.error) {
		throw new Response(updates.error.message, {status: 404});
	}

	const updatedUser = await contactActionService.updateContact(params.contactId, updates as Contact);

	if (updatedUser.error) {
		throw new Response(updatedUser.error.message, {status: 404});
	}

	return redirect(`/contacts/${updatedUser.id}`);
}

export default function EditContact() {
	const {contact} = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	return (
		<Form key={contact.id} id="contact-form" method="post">
			<p>
				<span>Name</span>
				<input
					defaultValue={contact.first}
					aria-label="First name"
					name="first"
					type="text"
					placeholder="First"
				/>
				<input
					aria-label="Last name"
					defaultValue={contact.last}
					name="last"
					placeholder="Last"
					type="text"
				/>
			</p>
			<label>
				<span>Twitter</span>
				<input
					defaultValue={contact.twitter}
					name="twitter"
					placeholder="@jack"
					type="text"
				/>
			</label>
			<label>
				<span>Avatar URL</span>
				<input
					aria-label="Avatar URL"
					defaultValue={contact.avatar}
					name="avatar"
					placeholder="https://example.com/avatar.jpg"
					type="text"
				/>
			</label>
			<label>
				<span>Notes</span>
				<textarea
					defaultValue={contact.notes}
					name="notes"
					rows={6}
				/>
			</label>
			<p>
				<button type="submit">Save</button>
				<button type="button" onClick={() => navigate(-1)}>Cancel</button>
			</p>
		</Form>
	);
}
