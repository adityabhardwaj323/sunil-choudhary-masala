import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/**/}
<section className="hero" id="hero">
  <div className="slides" id="slides">
    {/**/}
    <div className="slide slide-1">
      <div className="slide-bg"></div>
      <div className="slide-overlay"></div>
      <div className="spice-art">🌶️</div>
      <div className="slide-content">
        <span className="slide-eyebrow">✦ Since 1985 · Rajasthan</span>
        <h1 className="slide-h1">The True Taste of<br/><em>Rajasthani Masala</em></h1>
        <p className="slide-p">Hand-picked spices, stone-ground the traditional way. Every batch dated. Every packet sealed with purity.</p>
        <div className="slide-btns">
          <button className="btn-primary" ><i className="fas fa-shopping-bag"></i> Shop Now</button>
          <button className="btn-outline" >Our Story <i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
    {/**/}
    <div className="slide slide-2">
      <div className="slide-bg"></div>
      <div className="slide-overlay"></div>
      <div className="spice-art">🌿</div>
      <div className="slide-content">
        <span className="slide-eyebrow">✦ 100% Natural · No Additives</span>
        <h1 className="slide-h1">Pure Spices,<br/><em>No Shortcuts</em></h1>
        <p className="slide-p">No artificial colours. No preservatives. Just the real flavour of freshly ground Rajasthani spices — nothing more.</p>
        <div className="slide-btns">
          <button className="btn-primary" ><i className="fas fa-leaf"></i> Explore Range</button>
          <button className="btn-outline">Quality Promise <i className="fas fa-shield-alt"></i></button>
        </div>
      </div>
    </div>
    {/**/}
    <div className="slide slide-3">
      <div className="slide-bg"></div>
      <div className="slide-overlay"></div>
      <div className="spice-art">🪔</div>
      <div className="slide-content">
        <span className="slide-eyebrow">✦ Signature Blends</span>
        <h1 className="slide-h1">Secret Blends from<br/><em>Three Generations</em></h1>
        <p className="slide-p">Our special masala recipes have been passed down through the Choudhary family for over 35 years — now in your kitchen.</p>
        <div className="slide-btns">
          <button className="btn-primary" ><i className="fas fa-star"></i> Best Sellers</button>
          <button className="btn-outline">Gift Packs <i className="fas fa-gift"></i></button>
        </div>
      </div>
    </div>
    {/**/}
    <div className="slide slide-4">
      <div className="slide-bg"></div>
      <div className="slide-overlay"></div>
      <div className="spice-art">🎁</div>
      <div className="slide-content">
        <span className="slide-eyebrow">✦ First Order Special</span>
        <h1 className="slide-h1">Get 10% Off<br/><em>Your First Order</em></h1>
        <p className="slide-p">Use code <strong >PEHLADABBA</strong> at checkout and experience authentic Rajasthani flavour delivered to your door.</p>
        <div className="slide-btns">
          <button className="btn-primary" ><i className="fas fa-percent"></i> Claim Offer</button>
          <button className="btn-outline" >Copy Code <i className="fas fa-copy"></i></button>
        </div>
      </div>
    </div>
  </div>
  {/**/}
  <div className="hero-arrows">
    <button className="hero-arr" ><i className="fas fa-chevron-left"></i></button>
    <button className="hero-arr" ><i className="fas fa-chevron-right"></i></button>
  </div>
  {/**/}
  <div className="hero-dots">
    <button className="dot active" ></button>
    <button className="dot" ></button>
    <button className="dot" ></button>
    <button className="dot" ></button>
  </div>
</section>

{/**/}
<div className="trust-strip">
  <div className="trust-inner">
    <div className="trust-item"><i className="fas fa-truck"></i><span>Free Shipping ₹499+</span></div>
    <span className="trust-sep">|</span>
    <div className="trust-item"><i className="fas fa-certificate"></i><span>FSSAI Certified</span></div>
    <span className="trust-sep">|</span>
    <div className="trust-item"><i className="fas fa-leaf"></i><span>100% Natural</span></div>
    <span className="trust-sep">|</span>
    <div className="trust-item"><i className="fas fa-redo"></i><span>Easy Returns</span></div>
    <span className="trust-sep">|</span>
    <div className="trust-item"><i className="fas fa-headset"></i><span>24/7 Support</span></div>
  </div>
</div>

{/**/}
<section className="section">
  <div className="container">
    <div className="about-grid">
      <div className="about-img-wrap">
        <div className="about-img-box">
          <div className="img-placeholder">🌶️</div>
        </div>
        <div className="about-badge">
          <span className="num">35+</span>
          <span className="lbl">Years of<br/>Purity</span>
        </div>
      </div>
      <div>
        <span className="section-eyebrow">✦ Our Story</span>
        <h2 className="section-h2">Crafted with Love,<br/>Rooted in Rajasthan</h2>
        <div className="divider"></div>
        <p className="section-sub">Sunil Choudhary Masala was born out of a passion for authentic Rajasthani cooking. From our humble stone-grinding mill in Rajasthan, we bring the same time-honoured recipes to kitchens across India.</p>
        <div className="about-list">
          <div className="about-item">
            <div className="about-icon"><i className="fas fa-mountain-sun"></i></div>
            <div className="about-item-txt">
              <strong>Sourced from Rajasthan's Best Farms</strong>
              <span>Hand-picked spices from trusted farmers every harvest season</span>
            </div>
          </div>
          <div className="about-item">
            <div className="about-icon"><i className="fas fa-mortar-pestle"></i></div>
            <div className="about-item-txt">
              <strong>Stone-Ground the Old Way</strong>
              <span>Slow grinding preserves essential oils and true aroma</span>
            </div>
          </div>
          <div className="about-item">
            <div className="about-icon"><i className="fas fa-box-open"></i></div>
            <div className="about-item-txt">
              <strong>Packed Fresh, Batch-Dated</strong>
              <span>Every packet stamped with grind date so you know it's fresh</span>
            </div>
          </div>
        </div>
        <div >
          <a href="about.html" className="btn-primary" >Read Our Full Story <i className="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>

{/**/}
<section className="section section-alt">
  <div className="container">
    <div className="founder-wrap">
      <div className="founder-img">
        <div className="founder-photo">👨‍🍳</div>
        <div className="founder-stamp">Sunil<br/>Choudhary<br/>Founder</div>
      </div>
      <div>
        <span className="section-eyebrow">✦ Founder's Message</span>
        <h2 className="section-h2">A Promise from<br/>Our Family to Yours</h2>
        <div className="divider"></div>
        <blockquote>"My mother always said — a meal made with pure spices feeds not just the body, but the soul. For 35 years I have kept that promise. Every masala that leaves our mill carries the same commitment to purity that she taught me."</blockquote>
        <p className="section-sub">Sunil Choudhary started with a single stone-grinder and a dream to bring honest, unadulterated spices to every Indian household. Today, thousands of families across India trust the SCM name.</p>
        <div className="founder-sig">— Sunil Choudhary</div>
        <div className="founder-role">Founder & Master Spice Blender, Sunil Choudhary Masala</div>
      </div>
    </div>
  </div>
</section>

{/**/}
<section className="section">
  <div className="container">
    <div className="text-center">
      <span className="section-eyebrow">✦ Our Promise</span>
      <h2 className="section-h2">Why SCM Masala is Different</h2>
      <div className="divider center"></div>
      <p className="section-sub">Every step from farm to your kitchen is guided by one principle: Shuddhta — purity above everything.</p>
    </div>
    <div className="quality-grid">
      <div className="quality-card">
        <div className="q-icon">🌱</div>
        <h3>Farm-Direct Sourcing</h3>
        <p>We source directly from verified Rajasthani farms, cutting out middlemen and ensuring the freshest raw spices.</p>
      </div>
      <div className="quality-card">
        <div className="q-icon">🔬</div>
        <h3>Lab Tested Quality</h3>
        <p>Every batch is tested for purity, moisture content, and microbial safety before packing begins.</p>
      </div>
      <div className="quality-card">
        <div className="q-icon">🏭</div>
        <h3>FSSAI Certified Unit</h3>
        <p>Our processing unit is fully FSSAI licensed and follows strict food safety hygiene standards.</p>
      </div>
      <div className="quality-card">
        <div className="q-icon">🌡️</div>
        <h3>No Heat Damage</h3>
        <p>Stone-cold grinding — no high-heat processing that destroys essential oils and natural flavours.</p>
      </div>
      <div className="quality-card">
        <div className="q-icon">🎨</div>
        <h3>Zero Artificial Colour</h3>
        <p>The rich colour you see comes from the spices themselves — never from synthetic dyes or additives.</p>
      </div>
      <div className="quality-card">
        <div className="q-icon">📅</div>
        <h3>Freshness Dated</h3>
        <p>Batch grind date printed on every pack. You always know exactly when your masala was ground.</p>
      </div>
    </div>
  </div>
</section>

{/**/}
<section className="section section-dark">
  <div className="container">
    <div className="pack-grid">
      <div className="pack-img" ></div>
      <div>
        <span className="section-eyebrow">✦ Packaging</span>
        <h2 className="section-h2 light">Sealed to Preserve<br/>Every Grain of Flavour</h2>
        <div className="divider"></div>
        <p className="section-sub light" >Our packaging is engineered to lock in the freshness of every batch — from our mill to your masala box.</p>
        <div className="pack-items">
          <div className="pack-item">
            <span className="pack-num">01</span>
            <div>
              <h4>Nitrogen-Flushed Sealing</h4>
              <p>Oxygen is replaced with nitrogen before sealing — extending shelf life naturally without preservatives.</p>
            </div>
          </div>
          <div className="pack-item">
            <span className="pack-num">02</span>
            <div>
              <h4>Airtight Multi-Layer Pouches</h4>
              <p>High-barrier laminate pouches prevent moisture, light, and air from degrading the spices.</p>
            </div>
          </div>
          <div className="pack-item">
            <span className="pack-num">03</span>
            <div>
              <h4>Tamper-Evident Seal</h4>
              <p>Every pack has a visible security seal — so you can be confident the product has never been opened.</p>
            </div>
          </div>
          <div className="pack-item">
            <span className="pack-num">04</span>
            <div>
              <h4>Eco-Friendly Materials</h4>
              <p>Our packaging is recyclable and we are actively reducing plastic in our supply chain.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/**/}
<section className="section section-alt">
  <div className="container">
    <div className="text-center">
      <span className="section-eyebrow">✦ Categories</span>
      <h2 className="section-h2">Shop by Spice Type</h2>
      <div className="divider center"></div>
    </div>
    <div className="cat-grid">
      <div className="cat-card">
        <div className="cat-bg cat-c1"><span>🌶️</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Red Chilli</h3><span>12 Products</span></div>
      </div>
      <div className="cat-card">
        <div className="cat-bg cat-c2"><span>🌿</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Coriander</h3><span>8 Products</span></div>
      </div>
      <div className="cat-card">
        <div className="cat-bg cat-c3"><span>🟡</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Turmeric</h3><span>6 Products</span></div>
      </div>
      <div className="cat-card">
        <div className="cat-bg cat-c4"><span>🫙</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Spice Blends</h3><span>15 Products</span></div>
      </div>
      <div className="cat-card">
        <div className="cat-bg cat-c5"><span>🧂</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Special Masalas</h3><span>10 Products</span></div>
      </div>
      <div className="cat-card">
        <div className="cat-bg cat-c6"><span>🎁</span></div>
        <div className="cat-overlay"></div>
        <div className="cat-label"><h3>Gift Boxes</h3><span>5 Products</span></div>
      </div>
    </div>
  </div>
</section>

{/**/}
<section className="section">
  <div className="container">
    <div className="text-center">
      <span className="section-eyebrow">✦ Featured</span>
      <h2 className="section-h2">Our Signature Products</h2>
      <div className="divider center"></div>
    </div>
    <div className="prod-grid" id="idxFeaturedGrid"><div className="acct-loading" ><i className="fas fa-spinner"></i></div></div>
    <div className="view-all-wrap">
      <button className="btn-view-all" >View All Products <i className="fas fa-arrow-right"></i></button>
    </div>
  </div>
</section>

{/**/}
<section className="section section-alt">
  <div className="container">
    <div className="text-center">
      <span className="section-eyebrow">✦ Top Rated</span>
      <h2 className="section-h2">Best Selling Masalas</h2>
      <div className="divider center"></div>
    </div>
    <div className="prod-grid" id="idxBestsellerGrid"><div className="acct-loading" ><i className="fas fa-spinner"></i></div></div>
    <div className="view-all-wrap">
      <button className="btn-view-all" >See All Best Sellers <i className="fas fa-arrow-right"></i></button>
    </div>
  </div>
</section>

{/**/}
<section className="section">
  <div className="container">
    <div className="text-center">
      <span className="section-eyebrow">✦ Customer Love</span>
      <h2 className="section-h2">What Our Customers Say</h2>
      <div className="divider center"></div>
    </div>
    <div className="testi-grid">
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">I have been using SCM Laal Mirch for 5 years. No other brand comes close to this colour and heat. My whole family insists on this brand now!</p>
        <div className="testi-author">
          <div className="testi-avatar">P</div>
          <div><div className="testi-name">Priya Sharma</div><div className="testi-loc">Jaipur, Rajasthan</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">The Rajasthani Garam Masala is simply outstanding. The aroma when it hits the pan is something else — it fills the entire house. Truly authentic!</p>
        <div className="testi-author">
          <div className="testi-avatar">R</div>
          <div><div className="testi-name">Rajesh Verma</div><div className="testi-loc">Jodhpur, Rajasthan</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">Ordered the gift set for my sister's wedding and everyone asked where I got it from! Beautiful packaging, amazing quality, delivered on time.</p>
        <div className="testi-author">
          <div className="testi-avatar">A</div>
          <div><div className="testi-name">Anita Meena</div><div className="testi-loc">Udaipur, Rajasthan</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">I live in Pune now but I cannot cook without SCM masalas from home. My mother sends me a box every 3 months. Now I order online — so convenient!</p>
        <div className="testi-author">
          <div className="testi-avatar">M</div>
          <div><div className="testi-name">Mohan Choudhary</div><div className="testi-loc">Pune, Maharashtra</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">The batch date on the packet is what sold me. Finally a brand that respects the customer and gives fresh spices. The turmeric colour is phenomenal!</p>
        <div className="testi-author">
          <div className="testi-avatar">S</div>
          <div><div className="testi-name">Sunita Gupta</div><div className="testi-loc">Delhi</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">"</div>
        <p className="testi-text">Best Laal Maas Masala I have ever tasted. I run a small restaurant and all my customers love this dish. SCM is my secret weapon!</p>
        <div className="testi-author">
          <div className="testi-avatar">K</div>
          <div><div className="testi-name">Kishan Rawat</div><div className="testi-loc">Bikaner, Rajasthan</div></div>
        </div>
        <div className="testi-badge">★★★★★</div>
      </div>
    </div>
  </div>
</section>

{/**/}
<div className="offer-banner">
  <div className="container text-center" >
    <span className="section-eyebrow" >✦ Welcome Offer</span>
    <h2 className="section-h2 light" >Your First Order Deserves a Treat!</h2>
    <p className="offer-sub">Use the code below and get 10% off your very first order. No minimum required.</p>
    <div >
      <div className="offer-code">
        <span id="offerCode">PEHLADABBA</span>
        <button >Copy Code</button>
      </div>
    </div>
    <button className="btn-primary"  >
      <i className="fas fa-shopping-bag"></i> Shop & Use Code
    </button>
  </div>
</div>

{/**/}
<section className="newsletter">
  <div className="nl-inner">
    <span className="section-eyebrow">✦ Stay Connected</span>
    <h2 className="section-h2 light">Get Recipes & Exclusive Offers</h2>
    <p className="section-sub light">Subscribe and be the first to know about new products, seasonal offers, and authentic Rajasthani recipes from our kitchen.</p>
    <div className="nl-form">
      <input type="email" className="nl-input" placeholder="Enter your email address" id="nlEmail"/>
      <button className="nl-btn" >Subscribe <i className="fas fa-paper-plane"></i></button>
    </div>
    <p >We respect your privacy. No spam, ever. Unsubscribe anytime.</p>
  </div>
</section>

{/**/}
    </>
  );
}
