export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname;
        const url = await env.LINKS.get(path);

        if (url != null) {
            return Response.redirect(url, 302);
        }

        if (path === "/admin") {
            const list = await env.LINKS.list();
            let rows = "";

            for (const key of list.keys) {
                const destination = await env.LINKS.get(key.name);
                console.log(key.name, destination);
                rows += `<tr><td>${key.name}</td><td><a href="${destination}">${destination}</a></td></tr>`;
            }

            const adminPage = `<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>Admin</title>
  </head>
  <body>
    <h1>My Links</h1>
    <table>
        <tr>
            <th>Short path</th>
            <th>Destination</th>
        </tr>
        ${rows}
    </table>
    <form>
        <label for="path">Path:</label><br>
        <input type="text" id="path" name="path"><br>
        <label for="destination">Destination:</label><br>
        <input type="text" id="destination" name="destination"><br>
        <input type="submit" value="Submit">
    </form>
  </body>
</html>`;

            return new Response(adminPage, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }

        return new Response("Not found", { status: 404 });
    }
}