function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded-md text-[0.95em]">
      {children}
    </code>
  );
}

export { InlineCode };
