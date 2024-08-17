import type { BunFile } from "bun"

export type Logger = {
  log: (msg: string) => void
}

export const usingLogger = async (file: BunFile, ctx: (logger: Logger) => Promise<void>) => {
  await Bun.write(file, "", { createPath: true })
  const writer = file.writer()
  writer.start()

  await ctx({
    log: (msg: string): void => {
      writer.write(msg + "\n")
      console.log(msg)
    },
  })

  await writer.end()
}
