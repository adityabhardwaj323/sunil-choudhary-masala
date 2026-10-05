import Link from 'next/link';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Button } from '@/components/ui/Button';
import { ChefHat, Clock, Soup, UtensilsCrossed } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const recipes = [
  {
    title: 'Authentic Laal Maas',
    desc: 'The iconic Rajasthani mutton curry made with our signature Mathania Red Chilli powder for perfect heat and color.',
    icon: <ChefHat size={48} className="text-charcoal/20 group-hover:text-brand-red transition-colors duration-500" />,
    time: '60 mins',
    difficulty: 'Medium'
  },
  {
    title: 'Classic Gatte Ki Sabzi',
    desc: 'Gram flour dumplings in a spicy curd gravy, featuring our Coriander and Turmeric powders.',
    icon: <Soup size={48} className="text-charcoal/20 group-hover:text-saffron transition-colors duration-500" />,
    time: '45 mins',
    difficulty: 'Easy'
  },
  {
    title: 'Dal Baati Churma',
    desc: 'The soul of Rajasthan. A perfect blend of roasted lentils and wheat breads, spiced to perfection.',
    icon: <UtensilsCrossed size={48} className="text-charcoal/20 group-hover:text-gold transition-colors duration-500" />,
    time: '90 mins',
    difficulty: 'Hard'
  }
];

export default function RecipeSection() {
  return (
    <section className="py-20 bg-cream-dark">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-body uppercase tracking-[0.2em] text-xs font-semibold text-saffron text-xl mb-2">✦ Cooking Inspiration</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">Bring More Flavour to the Table</h2>
          <SectionDivider />
          <p className="text-brown max-w-2xl mt-6">
            Discover traditional recipes that showcase the true potential of our spices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-[4/3] bg-cream flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors z-10"></div>
                <span className="group-hover:scale-110 transition-transform duration-500">{recipe.icon}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs font-semibold text-brand-red uppercase tracking-wider mb-3">
                  <span className="flex items-center gap-1"><Clock size={16} /> {recipe.time}</span>
                  <span className="flex items-center gap-1"><UtensilsCrossed size={12} /> {recipe.difficulty}</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-3 group-hover:text-saffron transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-brown text-sm mb-6 line-clamp-3">
                  {recipe.desc}
                </p>
                {/* No actual backend, so we link to shop for now or keep it as a visual exploration card */}
                <Link href="/shop">
                  <Button variant="secondary" className="w-full group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-all">
                    Explore Spices
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
