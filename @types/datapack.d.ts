declare namespace Minecraft {
  type DataPack = {
    pack: {
      description: TextComponent
      pack_format: DataPack.Format
      supported_formats?: DataPack.FormatRange
    }
    filter?: {
      block: {
        namespace?: string
        path?: string
      }[]
    }
    overlays?: {
      entries: {
        formats: DataPack.FormatRange
        directory: string
      }[]
    }
  }

  namespace DataPack {
    type Format = IntRange<4, 50>

    type FormatRange = Format | [Format, Format] | { min_inclusive: Format; max_inclusive: Format }
  }
}
