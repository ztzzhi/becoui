import {
  ComputedRef, computed, onMounted, Ref, ref, unref, onUnmounted,
} from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

/**
 * toggle show
 * @param state init value (default `false`) 菜单栏展开
 */
export function useShow(
  state = false,
): {
    show: Ref<boolean>
    toggleShow: () => void
  } {
  const show = ref(state)

  function toggleShow() {
    show.value = !show.value
  }

  return {
    show,
    toggleShow,
  }
}

export function useResize(callback: () => void): void {
  onMounted(() => {
    callback()
    window.addEventListener('resize', callback)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', callback)
  })
}

/** Gets the responsive breakpoint of the current screen */
type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function useScreenSize(): Ref<ScreenSize> {
  const size = ref<ScreenSize>('xl')

  function getScreenSize() {
    const width = document.body.clientWidth

    if (width >= 1920) {
      size.value = 'xl'
    } else if (width >= 1200) {
      size.value = 'lg'
    } else if (width >= 992) {
      size.value = 'md'
    } else if (width >= 768) {
      size.value = 'sm'
    } else {
      size.value = 'xs'
    }
  }

  useResize(getScreenSize)

  return size
}

/**
 * Filter out router with `meta.hidden` values
 * @param router router list
 */
export function filterRouterByHidden(router: RouteRecordRaw[]): RouteRecordRaw[] {
  return router.filter(item => {
    if (Array.isArray(item.children)) {
      filterRouterByHidden(item.children)
    }
    return !item.meta?.hidden
  })
}

/**
 * Find an array of all router parents where the path is located
 * @param router router list
 * @param path route path
 */
export function findRouterItemListByPath(router: RouteRecordRaw[], path: string): RouteRecordRaw[] {
  let $router: RouteRecordRaw[] = []
  for (let i = 0; i < router.length; i++) {
    const item = router[i]
    if (item.path === path) {
      $router = [item]
      break
    } else if (item?.children?.length) {
      const childrenRouter = findRouterItemListByPath(item.children, path)
      if (childrenRouter.length) {
        $router = [item, ...childrenRouter]
        break
      }
    }
  }
  return $router
}

/**
 * 如果没有传值，将自动从 vue-router 中获取路由并排除 meta: { hidden: true } 的路由
 * @param routes router list
 */
export function useCurrentRoutes(
  routes: RouteRecordRaw[] | Ref<RouteRecordRaw[]>,
  router: Router,
): ComputedRef<RouteRecordRaw[]> {
  const $routes = unref(routes)

  return computed(() => {
    if ($routes?.length) {
      return $routes
    }

    const $$routes = router.options.routes as RouteRecordRaw[]

    return filterRouterByHidden($$routes)
  })
}
