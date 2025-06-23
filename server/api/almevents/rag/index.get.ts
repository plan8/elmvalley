import z from 'zod'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const querySchema = z.object({
      query: z.string(),
    })

    const parsed = querySchema.safeParse(query)

    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query parameters',
      })
    }

    const { query: searchQuery } = parsed.data

    const autorag = hubAutoRAG('amledalen-rag') // access AutoRAG instance
    return await autorag.aiSearch({
      rewrite_query: true,
      query: searchQuery,
      max_num_results: 2,
      ranking_options: {
        score_threshold: 0.7,
      },
    })
  }
  catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
