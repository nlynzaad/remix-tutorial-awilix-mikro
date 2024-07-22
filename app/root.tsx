import {
	Form,
	json,
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData, useNavigation, useSubmit
} from '@remix-run/react';

import {type LinksFunction, type LoaderFunctionArgs, redirect} from '@remix-run/node';

import appStylesHref from './app.css?url';
import {useEffect} from "react";
import { serverOnly$ } from 'vite-env-only/macros';
import {DiContext, diMiddleware} from "~/middleware/di/di.server";

export const middleware = serverOnly$([
	diMiddleware
])

export const links: LinksFunction = () => [{rel: 'stylesheet', href: appStylesHref}];

export const loader = async ({request, context}: LoaderFunctionArgs) => {
	const contactQueryService = context.get(DiContext).contactQueryService;
	const url = new URL(request.url);
	const q = url.searchParams.get("q");
	const contacts = q ? await contactQueryService.searchContact(q) : await contactQueryService.getContacts();

	if (contacts.error) {
		throw new Response(contacts.error.message, { status: 404 });
	}

	return json({contacts, q});
};

export const action = async () => {
	return redirect(`/contacts/new`);
}

export default function App() {
	const {contacts, q} = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const submit = useSubmit();
	const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

	useEffect(() => {
		const searchField = document.getElementById("q");
		if (searchField instanceof HTMLInputElement) {
			searchField.value = q || "";
		}
	}, [q]);

	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8'/>
				<meta name='viewport' content='width=device-width, initial-scale=1'/>
				<Meta/>
				<Links/>
			</head>
			<body>
				<div id='sidebar'>
					<h1>Remix Contacts</h1>
					<div>
						<Form id='search-form' role='search'
							onChange={(event) => {
								const isFirstSearch = q === null;
								submit(event.currentTarget, {replace: !isFirstSearch})
							}}>
							<input
								aria-label="Search contacts"
								className={searching ? "loading" : ""}
								defaultValue={q || ""}
								id="q"
								name="q"
								placeholder="Search"
								type="search"
							/>
							<div
								aria-hidden
								hidden={!searching}
								id="search-spinner"
							/>
						</Form>
						<Form method='post'>
							<button type='submit'>New</button>
						</Form>
					</div>
					<nav>
						{contacts.length ? (
							<ul>
								{contacts.map((contact) => (
									<li key={contact.id}>
										<NavLink className={({isActive, isPending}) => (
											isActive ? 'active' : isPending ? 'pending' : ''
										)}
											to={`/contacts/${contact.id}`}>
											{contact.first || contact.last ? (
												<>
													{contact.first} {contact.last}
												</>
											) : (
												<i>No Name</i>
											)}{' '}
											{contact.favourite ? <span>★</span> : null}
										</NavLink>
									</li>
								))}
							</ul>
						) : (
							<p>
								<i>No contacts</i>
							</p>
						)}
					</nav>
				</div>
				<div id='detail' className={navigation.state === 'loading' && !searching ? 'loading' : ''}>
					<Outlet/>
				</div>
				<ScrollRestoration/>
				<Scripts/>
			</body>
		</html>
	);
}
