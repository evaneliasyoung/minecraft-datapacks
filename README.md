# minecraft-datapacks

My personal collection of [Vanilla Tweaks](https://vanillatweaks.net/)-esce datapacks. Currently, the datapacks are only what they would label as "Crafting Tweaks," which "are a kind of data pack that adds new recipes, changing how items are crafted and what items can be crafted."

## Datapacks

Datapacks are separated into categories derived from their purpose:

- Craftables; things that you should be able to craft, but can't.
- QoL; quality-of-life crafting recipes.
- Smeltables; things that you should be able to smelt, but can't.
- Unpackables; things that you should be able to uncraft, but can't.

## Scripts

- `bun run build` run `prepare`, `sync`, and the actual build script (`index.ts`).
- `bun run clean` removes compiled datapacks and the version manifest.
- `bun run gen` generates a new datapack.
- `bun run prepare` downloads the create the version manifest.
- `bun run sync` syncs `pack.cts` content into the corresponding `pack.mcmeta` file.
