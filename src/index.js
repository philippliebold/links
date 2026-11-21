export default {
    async fetch(request, env, ctx) {
        const path = new URL(request.url).pathname;
        const url = await env.LINKS.get(path);

        if (url != null) {
            return Response.redirect(url, 302);
        }

        if (path === "/admin") {
            if (request.method === "POST") {
                const data = await request.formData();

                if (data.get("action") === "delete") {
                    await env.LINKS.delete(data.get("path"));
                } else {
                    const path = data.get("path");
                    const destination = data.get("destination");

                    if (!path.startsWith("/")) {
                        return new Response("Path must start with /", {status: 400})
                    }

                    if (!destination.startsWith("https://")) {
                        return new Response("Destination must start with https://", {status: 400})
                    }

                    await env.LINKS.put(path, destination);
                }
                
                return Response.redirect(request.url, 303);
            }

            const list = await env.LINKS.list();
            let rows = "";

            for (const key of list.keys) {
                const destination = await env.LINKS.get(key.name);
                console.log(key.name, destination);
                rows += `
                <tr>
                  <td>
                    ${key.name}
                  </td>
                  <td>
                    <a href="${destination}">
                      ${destination}
                    </a>
                  </td>
                  <td>
                    <form method="POST">
                      <input type="hidden" name="path" value="${key.name}">
                      <input type="hidden" name="action" value="delete">
                      <input type="submit" value="Delete">
                    </form>
                  </td>
                </tr>`;
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
            <th>Action</th>
        </tr>
        ${rows}
    </table>
    <form method="POST">
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

        return new Response("Not found", {status: 404 });
    }
}