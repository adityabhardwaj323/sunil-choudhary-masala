import { Truck, ShieldCheck, Leaf, RefreshCw, Headset } from 'lucide-react';

const trustItems = [
  { icon: <Truck size={24} />, text: "Free Shipping ₹499+" },
  { icon: <ShieldCheck size={24} />, text: "FSSAI Certified" },
  { icon: <Leaf size={24} />, text: "100% Natural" },
  { icon: <RefreshCw size={24} />, text: "Easy Returns" },
  { icon: <Headset size={24} />, text: "24/7 Support" },
];

export default function TrustStrip() {
  return (
    <div className="bg-charcoal py-4 px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 text-white">
              <span className="text-gold [&>svg]:w-[18px] [&>svg]:h-[18px]">{item.icon}</span>
              <span className="text-[13px] font-medium tracking-[0.4px]">{item.text}</span>
              {index < trustItems.length - 1 && (
                <span className="hidden md:inline text-white/20 text-xl ml-2">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
