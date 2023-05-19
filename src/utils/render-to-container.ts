import { createPortal } from 'react-dom'
import { ReactElement, ReactPortal } from 'react'
import { resolveContainer } from './get-container'
import { canUseDom } from './can-use-dom'

export type GetContainer = HTMLElement | (() => HTMLElement) | null

export function renderToContainer(
  getContainer: GetContainer,
  node: ReactElement
) {
  if (canUseDom && getContainer) {
    const container = resolveContainer(getContainer)

    // createPortal 将子组件渲染到父组件的 DOM 层次结构之外, 用于创建弹出窗口、模态对话框等 UI 组件
    return createPortal(node, container) as ReactPortal
  }
  return node
}
