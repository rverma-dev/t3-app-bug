import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

const defaultVideoSelect = {
  id: true,
  title: true,
  url: true,
  thumbnail: true,
  updatedAt: true,
} satisfies Prisma.VideoSelect

enum STATUS {
    PENDING = 'PENDING',
    READY = 'READY',
    ERROR = 'ERROR',
}

export const VideoDAO = z.object({
  id: z.string().length(11),
  title: z.string().min(4).max(32),
  uploadId: z.string(),
  url: z.string(),
  status: z.nativeEnum(STATUS),
})

export const videoRouter = createTRPCRouter({
  add: protectedProcedure.input(VideoDAO).mutation(async ({ ctx, input }) => {
    const post = await ctx.db.video.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
      select: defaultVideoSelect,
    })
    return post
  }),
  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.video.findFirst({
      orderBy: { createdAt: 'desc' },
      where: { userId: ctx.session.user.id  },
    })
  }),
})
