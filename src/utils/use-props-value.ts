import { SetStateAction, useRef } from 'react'
import { useMemoizedFn, useUpdate } from 'ahooks'

type Options<T> = {
  value?: T
  defaultValue: T
  onChange?: (v: T) => void
}

// 处理设置 value  的 hook，类似于 setValue，但是包含了默认值处理
export function usePropsValue<T>(options: Options<T>) {
  const { value, defaultValue, onChange } = options

  const update = useUpdate() // 返回一个函数，调用该函数会强制组件重新渲染

  const stateRef = useRef<T>(value !== undefined ? value : defaultValue)
  if (value !== undefined) {
    stateRef.current = value
  }

  // useMemoizedFn 可以省略第二个参数 deps，同时保证函数地址永远不会变化
  const setState = useMemoizedFn(
    (v: SetStateAction<T>, forceTrigger: boolean = false) => {
      // `forceTrigger` means trigger `onChange` even if `v` is the same as `stateRef.current`
      const nextValue =
        typeof v === 'function'
          ? (v as (prevState: T) => T)(stateRef.current)
          : v
      if (!forceTrigger && nextValue === stateRef.current) return
      stateRef.current = nextValue
      update()
      return onChange?.(nextValue)
    }
  )
  return [stateRef.current, setState] as const
}
