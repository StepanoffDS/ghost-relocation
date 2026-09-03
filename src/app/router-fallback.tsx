export function RouterFallback() {
  return (
    <main
      className='grid min-h-svh place-items-center bg-background text-sm text-muted-foreground'
      aria-busy='true'
    >
      Загружаем приложение…
    </main>
  );
}
