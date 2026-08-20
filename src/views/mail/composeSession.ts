import { ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type ComposeSourceRoute = Pick<
  RouteLocationNormalizedLoaded,
  'fullPath' | 'name' | 'params' | 'meta'
>

const sourceRoute = ref<ComposeSourceRoute>()

export function rememberComposeSource(route: RouteLocationNormalizedLoaded) {
  sourceRoute.value = {
    fullPath: route.fullPath,
    name: route.name,
    params: { ...route.params },
    meta: { ...route.meta },
  }
}

export function useComposeSource() {
  return sourceRoute
}
