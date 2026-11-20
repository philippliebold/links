export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname;
        const url = await env.LINKS.get(path);

        if (url != null) {
            return Response.redirect(url, 302);
        }

        return new Response("Not found", {status: 404});
    }
}