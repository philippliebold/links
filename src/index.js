export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname;
        if (path === "/drive") {
            return Response.redirect("https://drive.google.com", 302);
        }

        return new Response("Not found", {status: 404});
    }
}