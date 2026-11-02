'use client'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function InView({
  children,
  variants,
  transition,
  viewOptions,
  as: Component = 'div',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)
  const MotionComponent = motion[Component] || motion.div

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionComponent>
  )
}
