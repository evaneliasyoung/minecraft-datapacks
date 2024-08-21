declare namespace Minecraft {
  type Advancement = {
    parent?: string
    display: Advancement.Display
    criteria: Record<string, Advancement.Criteria>
    requirements?: string[]
    rewards?: Advancement.Rewards
    sends_telemetry_event?: boolean
  }

  namespace Advancement {
    type Display = {
      icon: {
        id: string
        count?: number
        components?: object
      }
      title: Minecraft.TextComponent
      description: Minecraft.TextComponent
      frame?: string
      background?: string
      show_toast?: boolean
      announce_to_chat?: boolean
      hidden?: boolean
    }

    type Criteria = {
      trigger: string
      conditions?: object
    }

    type Rewards = {
      experience: number
      recipes: string[]
      loot: string[]
      function: string
    }
  }
}
