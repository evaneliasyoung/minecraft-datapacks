declare type PackID = `@${string}/${string}` | `@${string}/${string}/${string}`

declare type PackConfig = {
  id: PackID
  version: string
  title: string
  description: Minecraft.TextComponent
  icon: {
    id: string
    components?: object
  }
  engine: Minecraft.Version | Minecraft.Version.Tag
  supports?: Minecraft.DataPack.FormatRange
}

declare type Pack = {
  root: string
  assets?: string
  group?: string
  namespace: string
  codename: string
  title: string
  description: Minecraft.TextComponent
  icon: {
    id: string
    components?: object
  }
  format: Minecraft.DataPack.Format
  supports?: Minecraft.DataPack.FormatRange
}
