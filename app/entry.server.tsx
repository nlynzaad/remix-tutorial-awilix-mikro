import {PassThrough} from "node:stream";

import type {AppLoadContext, EntryContext} from "@remix-run/node";
import {createReadableStreamFromReadable} from "@remix-run/node";
import {RemixServer} from "@remix-run/react";
import * as isBotModule from "isbot";
import {renderToPipeableStream} from "react-dom/server";
import {createExpressApp} from "remix-create-express-app";
import type {ServerContext} from "remix-create-express-app/context";
import compression from "compression";
import 'reflect-metadata';
import {DbConnector} from "@infrastructure/database/db";
import {RequestContext} from "@mikro-orm/core";

declare module '@remix-run/node' {
	interface AppLoadContext extends ServerContext {
	}
}

console.log('connecting to db')
await DbConnector.init();
console.log('connected to db')

export const server = createExpressApp({
	configure: app => {
		app.use(compression({
			filter: (req, res) => {
				if (req.is('text/event-stream')) {
					return false
				}

				return compression.filter(req, res)
			}
		}))
		app.disable('x-powered-by')
		app.use((req, res, next) => {
			RequestContext.create(DbConnector.orm.em, next);
		})
	},
	unstable_middleware: true
})

const ABORT_DELAY = 5_000;

// noinspection JSUnusedLocalSymbols
export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	// This is ignored, so we can keep it in the template for visibility.  Feel
	// free to delete this parameter in your app if you're not using it!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loadContext: AppLoadContext
) {
	const prohibitOutOfOrderStreaming =
		isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;

	return prohibitOutOfOrderStreaming
		? handleBotRequest(
			request,
			responseStatusCode,
			responseHeaders,
			remixContext
		)
		: handleBrowserRequest(
			request,
			responseStatusCode,
			responseHeaders,
			remixContext
		);
}

// We have some Remix apps in the wild already running with isbot@3 so we need
// to maintain backwards compatibility even though we want new apps to use
// isbot@4.  That way, we can ship this as a minor Semver update to @remix-run/dev.
function isBotRequest(userAgent: string | null) {
	if (!userAgent) {
		return false;
	}

	// isbot >= 3.8.0, >4
	if ("isbot" in isBotModule && typeof isBotModule.isbot === "function") {
		return isBotModule.isbot(userAgent);
	}

	// isbot < 3.8.0
	if ("default" in isBotModule && typeof isBotModule.default === "function") {
		return isBotModule.default(userAgent);
	}

	return false;
}

function handleBotRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const {pipe, abort} = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				onAllReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			}
		);

		setTimeout(abort, ABORT_DELAY);
	});
}

function handleBrowserRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const {pipe, abort} = renderToPipeableStream(
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>,
			{
				onShellReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			}
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
