import {Form, json, useFetcher, useLoaderData} from "@remix-run/react";
import {type FunctionComponent} from "react";

import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import invariant from "tiny-invariant";
import {DiContext} from "~/middleware/di/di.server";
import type {IContact} from "~/.server/domain/contacts/Contact";

export const loader = async ({ params, context}: LoaderFunctionArgs) => {
	const contactQueryService = context.get(DiContext).contactQueryService;

	invariant(params.contactId, "Missing contactId parameter");

	const contact = await contactQueryService.getContact(params.contactId);

	if (contact.error) {
		throw new Response(contact.error.message, { status: 404 });
	}

	return json({ contact });
};

export const action = async ({params, request, context}: ActionFunctionArgs) => {
	const contactActionService = context.get(DiContext).contactActionService;

	invariant(params.contactId, "Missing contactId param");

	const formData = await request.formData();

	return contactActionService.toggleFavourite(params.contactId, formData.get("favourite") === "true");
}

export default function Contact() {
	const { contact } = useLoaderData<typeof loader>();

	return (
		<div id="contact">
			<div>
				<img
					alt={`${contact.first} ${contact.last} avatar`}
					key={contact.avatar}
					src={contact.avatar}
				/>
			</div>

			<div>
				<h1>
					{contact.first || contact.last ? (
						<>
							{contact.first} {contact.last}
						</>
					) : (
						<i>No Name</i>
					)}{" "}
					<Favourite contact={contact} />
				</h1>

				{contact.twitter ? (
					<p>
						<a
							href={`https://twitter.com/${contact.twitter}`}
						>
							{contact.twitter}
						</a>
					</p>
				) : null}

				{contact.notes ? <p>{contact.notes}</p> : null}

				<div>
					<Form action="edit">
						<button type="submit">Edit</button>
					</Form>

					<Form
						action="destroy"
						method="post"
						onSubmit={(event) => {
							const response = confirm(
								"Please confirm you want to delete this record."
							);
							if (!response) {
								event.preventDefault();
							}
						}}
					>
						<button type="submit">Delete</button>
					</Form>
				</div>
			</div>
		</div>
	);
}

const Favourite: FunctionComponent<{
	contact: Pick<IContact, "favourite">;
}> = ({ contact }) => {
	const fetcher = useFetcher();
	const favourite = fetcher.formData
		? fetcher.formData.get("favourite") === "true"
		: contact.favourite;

	return (
		<fetcher.Form method="post">
			<button
				aria-label={
					favourite
						? "Remove from favourites"
						: "Add to favourites"
				}
				name="favourite"
				value={favourite ? "false" : "true"}
			>
				{favourite ? "★" : "☆"}
			</button>
		</fetcher.Form>
	);
};
