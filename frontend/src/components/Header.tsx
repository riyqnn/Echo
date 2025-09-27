import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/explore", label: "EXPLORE" },
    { path: "/mint", label: "MINT" },
    { path: "/vouchers", label: "VOUCHERS" },
    { path: "/my-hotspots", label: "MY HOTSPOTS" },
    { path: "/captive", label: "Captive" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black font-mono font-bold shadow-brutal">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3"
          >
            <img className="h-8 w-auto" src={logo} alt="Echo Logo" />
            <span className="text-xl font-black text-black uppercase tracking-wide">
              ECHO
            </span>
          </Link>
          
          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 border-3 border-black font-black uppercase tracking-wide text-bs transition-all duration-150 ${
                  location.pathname === item.path 
                    ? "bg-black text-white" 
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Connect Wallet Button */}
          <div>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-4 py-2 bg-white text-black border-3 border-black font-black uppercase tracking-wide text-bs hover:bg-black hover:text-white transition-all duration-150"
                          >
                            CONNECT
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="px-4 py-2 bg-red-500 text-white border-3 border-black font-black uppercase tracking-wide text-bs hover:bg-red-400 transition-all duration-150"
                          >
                            WRONG NETWORK
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={openAccountModal}
                          className="px-4 py-2 bg-green-500 text-white border-3 border-black font-black uppercase tracking-wide text-bs hover:bg-green-400 transition-all duration-150"
                        >
                          {account.displayName}
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex flex-wrap justify-center gap-1 mt-3 pt-3 border-t-3 border-black">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 border-3 border-black font-black uppercase tracking-wide text-bs transition-all duration-150 ${
                location.pathname === item.path 
                  ? "bg-black text-white" 
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;