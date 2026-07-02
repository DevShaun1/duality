import { devComponentAttrs } from '@/lib/devtools';

type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10" {...devComponentAttrs('PageContainer')}>
      {children}
    </main>
  );
}
