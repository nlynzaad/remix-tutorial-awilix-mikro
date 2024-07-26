import {type ActionFunctionArgs, redirect} from "@remix-run/node";
import {Form, useNavigate} from "@remix-run/react";
import {DiContext} from "~/middleware/di/di.server";
import {newContactValidator} from "@domain/contacts/validation";
import type {NewContact} from "@domain/contacts/Contact";

export const action = async ({request, context}: ActionFunctionArgs) => {
	const contactActionService = context.get(DiContext).contactActionService;

	const formData = await request.formData();

	const contactData = newContactValidator(Object.fromEntries(formData) as unknown as NewContact);

	if (contactData.error) {
		throw new Response(contactData.error.message, { status: 404 });
	}

	const newContact = await contactActionService.addContact(contactData);

	if (newContact.error) {
		throw new Response(newContact.error.message, { status: 404 });
	}

	return redirect(`/contacts/${newContact.id}`);
}

export default function NewContact() {
	const navigate = useNavigate();

	return (
		<Form id="contact-form" method="post">
			<p>
				<span>Name</span>
				<input
					defaultValue={''}
					aria-label="First name"
					name="first"
					type="text"
					placeholder="First"
				/>
				<input
					aria-label="Last name"
					defaultValue={''}
					name="last"
					placeholder="Last"
					type="text"
				/>
			</p>
			<label>
				<span>Twitter</span>
				<input
					defaultValue={''}
					name="twitter"
					placeholder="@jack"
					type="text"
				/>
			</label>
			<label>
				<span>Avatar URL</span>
				<input
					aria-label="Avatar URL"
					defaultValue={''}
					name="avatar"
					placeholder="https://example.com/avatar.jpg"
					type="text"
				/>
			</label>
			<label>
				<span>Notes</span>
				<textarea
					defaultValue={''}
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
