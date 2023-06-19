interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <main className="flex flex-col items-center justify-center gap-12 px-4 py-16">{children}</main>
  );
}

export default Layout;
