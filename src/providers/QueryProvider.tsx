import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

type Props = {
  children: React.ReactNode
}

export default function ({ children }: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
