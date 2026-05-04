const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center mt-auto">
      <p className="text-slate-500 text-sm">
        Built with AI &middot; CVInsights &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
