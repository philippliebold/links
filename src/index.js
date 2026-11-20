export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname;
        const links = {
            "/drive": "https://drive.google.com",
            "/github": "https://github.com",
        };
        
        if (path in links) {
            return Response.redirect(links[path], 302);
        }

        return new Response("Not found", {status: 404});
    }
}