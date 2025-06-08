const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex dark:bg-mountain-950 overflow-hidden">
      <div className="-z-10 fixed inset-0 bg-gradient-to-t from-indigo-200 via-indigo-100 to-purple-50 dark:bg-gradient-to-b dark:from-mountain-900 dark:via-mountain-950 dark:to-mountain-1000" />
      {children}
    </div>
  );
};

export default RootLayout;
