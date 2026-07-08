export function Footer() {
  return (
    <footer className="mt-12 border-t border-outline-variant bg-surface-lowest py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold text-primary">Routo</span>
          <p className="font-geist text-xs font-medium text-on-surface-variant">
            © 2026 Routo Logistics. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-5 font-geist text-xs font-medium text-on-surface-variant">
          <a className="hover:text-primary hover:underline" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary hover:underline" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary hover:underline" href="#">
            Contact Support
          </a>
          <a className="hover:text-primary hover:underline" href="#">
            About Us
          </a>
        </div>
      </div>
    </footer>
  );
}
