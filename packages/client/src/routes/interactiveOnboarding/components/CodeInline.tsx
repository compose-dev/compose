function CodeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-1 py-0.5 rounded-md">
      {children}
    </code>
  );
}

export default CodeInline;
