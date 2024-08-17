export const reflectMeta = (pack: Pack): Minecraft.DataPack => ({
  pack: {
    pack_format: pack.format,
    description: pack.description,
    ...(pack.supports ? { supported_formats: pack.supports } : {}),
  },
})
