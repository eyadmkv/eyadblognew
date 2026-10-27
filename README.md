# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Password-protected posts

Add these fields to a published post's frontmatter to require a password:

```yaml
locked: true
passwordEnv: POST_PASSWORD_PRIVATE_POST
```

Set `POST_PASSWORD_PRIVATE_POST` as an environment variable for local production builds and in the Vercel project's Environment Variables. Keep the password out of Markdown files and source control. A locked post must have its password variable set at build time; otherwise, the build fails rather than publishing an unreadable post.

The build encrypts the Markdown body with AES-GCM and a key derived from that password. Readers enter it in the post page to decrypt and render the article in their browser. Locked posts stay at their `/post/{id}` URL and remain in the archive with a password-protected label, but are omitted from RSS and the sitemap and use `noindex`. The title, excerpt, and date remain visible in page metadata, so keep confidential details out of those fields. Use a strong password: as with client-side encrypted content, someone who obtains the ciphertext can attempt offline password guesses.

For a local build in PowerShell, set the variable for that shell before running `npm run build`:

```powershell
$env:POST_PASSWORD_PRIVATE_POST = "use-a-strong-password"
npm run build
```
