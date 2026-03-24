export async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<T[]> {
  if (limit < 1) {
    throw new Error('Concurrency limit must be at least 1')
  }

  const results: T[] = new Array(tasks.length)
  let nextTaskIndex = 0

  async function worker() {
    while (nextTaskIndex < tasks.length) {
      const currentIndex = nextTaskIndex
      nextTaskIndex += 1
      results[currentIndex] = await tasks[currentIndex]()
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  )

  await Promise.all(workers)

  return results
}
