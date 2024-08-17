declare type PackID = `@${string}/${string}`

declare type PackConfig = {
  id: PackID
  version: string
  title: string
  description: Minecraft.TextComponent
  icon: {
    item: string
    nbt?: string
  }
  engine: Minecraft.Version | Minecraft.Version.Tag
  supports?: Minecraft.DataPack.FormatRange
}

declare type Pack = {
  root: string
  assets?: string
  namespace: string
  codename: string
  title: string
  description: Minecraft.TextComponent
  icon: {
    item: string
    nbt?: string
  }
  format: Minecraft.DataPack.Format
  supports?: Minecraft.DataPack.FormatRange
}
