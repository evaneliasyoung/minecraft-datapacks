declare namespace Minecraft {
  type TextComponent = string | TextComponent.TextObject | TextComponent.TextComponent[]

  namespace TextComponent {
    type PlainTextObject = {
      type?: "text"
      text: string
    }

    type TranslateTextObject = {
      type?: "translatable"
      translate: string
      with: TextComponent[]
    }

    type ScoreTextObject = {
      type?: "score"
      score: {
        name: string
        objective: string
        value: string | number | boolean
      }
    }

    type SelectorTextObject = {
      type?: "selector"
      selector: `@[${string}]`
      separator?: TextComponent
    }

    type KeybindTextObject = {
      type?: "keybind"
      keybind: string
    }

    type NBTTextObject = {
      type?: "nbt"
      nbt: string
      interpret?: boolean
      separator?: TextComponent
    } & (
      | {
          source?: "block"
          block: string
        }
      | {
          source?: "entity"
          entity: string
        }
      | {
          source?: "storage"
          storage: string
        }
    )

    type TextFormatting = Partial<{
      color:
        | `#${string}`
        | "black"
        | "dark_blue"
        | "dark_green"
        | "dark_aqua"
        | "dark_red"
        | "dark_purple"
        | "gold"
        | "gray"
        | "dark_gray"
        | "blue"
        | "green"
        | "aqua"
        | "red"
        | "light_purple"
        | "yellow"
        | "white"
        | "reset"
      font: string
      bold: boolean
      italic: boolean
      underlined: boolean
      strikethrough: boolean
      obfuscated: boolean
    }>

    type TextInteractivity = Partial<{
      insertion: string
      clickEvent: {
        action: "open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard"
        value: string
      }
      hoverEvent:
        | {
            action: "show_text"
            contents: TextComponent
          }
        | {
            action: "show_item"
            contents: {
              id: string
              count?: number
              tag?: string
            }
          }
        | {
            action: "show_entity"
            contents: {
              name?: string
              type: string
              id: string | number[]
            }
          }
    }>

    type TextObject = (
      | PlainTextObject
      | TranslateTextObject
      | ScoreTextObject
      | SelectorTextObject
      | KeybindTextObject
      | NBTTextObject
    ) &
      TextFormatting &
      TextInteractivity
  }
}
