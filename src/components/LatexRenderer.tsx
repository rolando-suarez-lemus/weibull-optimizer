import { useEffect, useRef, memo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface LatexRendererProps {
  formula: string
  displayMode?: boolean
  className?: string
}

const LatexRenderer = memo((props: LatexRendererProps) => {
  const { formula, displayMode = false, className } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false,
        trust: true,
      })
    } catch (error) {
      containerRef.current.innerHTML = `<span style="color: #ff6b6b;">LaTeX Error</span>`
      console.error('KaTeX render error:', error)
    }
  }, [formula, displayMode])

  return <div ref={containerRef} className={className} />
}, (prevProps, nextProps) => {
  return (
    prevProps.formula === nextProps.formula &&
    prevProps.displayMode === nextProps.displayMode &&
    prevProps.className === nextProps.className
  )
})

LatexRenderer.displayName = 'LatexRenderer'
export default LatexRenderer
