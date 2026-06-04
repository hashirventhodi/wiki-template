# Templates

Copy-paste skeletons for new wiki content. These files live outside `content/`, so they
don't render as pages.

| Template | Use for | Copy to |
|----------|---------|---------|
| `page.mdx` | A normal wiki page | `content/<domain>/<kebab-name>.mdx` |
| `adr.mdx` | An architecture decision record | `content/decisions/NNNN-short-title.mdx` |

After copying:

1. Replace the placeholder title, description, and body.
2. For ADRs, set `NNNN` (zero-padded, next free number) and the `date`.
3. Add the new page to the folder's `_meta.ts` for sidebar order.
4. Run `pnpm build` to validate.

See `content/operations/authoring.mdx` for the full workflow and `AGENTS.md` for agent
guidance.
