import { motion } from 'motion/react'

type Props = {
  progress: number
}

export function LoadingBar({ progress }: Props) {
  return (
    <div className="w-full h-3 bg-gray-700 rounded-xl overflow-hidden">
      <motion.div
        className="h-full bg-red-500"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
