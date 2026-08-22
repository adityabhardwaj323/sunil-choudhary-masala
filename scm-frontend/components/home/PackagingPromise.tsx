import { FadeIn } from '@/components/motion/FadeIn';
const packItems = [
  {
    num: '01',
    title: 'Nitrogen-Flushed Sealing',
    text: 'Oxygen is replaced with nitrogen before sealing — extending shelf life naturally without preservatives.',
  },
  {
    num: '02',
    title: 'Airtight Multi-Layer Pouches',
    text: 'High-barrier laminate pouches prevent moisture, light, and air from degrading the spices.',
  },
  {
    num: '03',
    title: 'Tamper-Evident Seal',
    text: 'Every pack has a visible security seal — so you can be confident the product has never been opened.',
  },
  {
    num: '04',
    title: 'Eco-Friendly Materials',
    text: 'Our packaging is recyclable and we are actively reducing plastic in our supply chain.',
  },
];

export default function PackagingPromise() {
  return (
    <section className="py-20 bg-charcoal">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
            <img
              src="/images/packaging_promise.jpg"
              alt="Sunil Choudhary Masala packaging — pouches and gift box"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <span className="font-kalam text-saffron text-xl mb-3 block">✦ Packaging</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Sealed to Preserve<br />Every Grain of Flavour
            </h2>
            <div className="w-[52px] h-[3px] rounded-full bg-gradient-to-r from-brand-red to-saffron mb-8" />
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Our packaging is engineered to lock in the freshness of every batch — from our mill
              to your masala box.
            </p>

            <div className="flex flex-col gap-7">
              {packItems.map((item) => (
                <div key={item.num} className="flex items-start gap-5">
                  <span className="font-playfair text-2xl font-bold text-saffron/70 shrink-0 w-10">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
