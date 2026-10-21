import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Category = {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  products: Product[];
};

type Screen = 'home' | 'category' | 'cart' | 'image';

const categories: Category[] = [
  {
    id: 'outdoor',
    name: 'Turutstyr',
    subtitle: 'Gjør turen litt enklere',
    emoji: '🏕️',
    products: [
      {
        id: 'daypack',
        name: 'Dagstursekk',
        description: 'Lett sekk med plass til alt du trenger på en dagstur.',
        price: 799,
      },
      {
        id: 'bottle',
        name: 'Turflaske',
        description: 'Solid drikkeflaske i rustfritt stål, 750 ml.',
        price: 249,
      },
    ],
  },
  {
    id: 'training',
    name: 'Trening',
    subtitle: 'Utstyr til økter hjemme',
    emoji: '🏋️',
    products: [
      {
        id: 'dumbbells',
        name: 'Manualsett',
        description: 'Justerbare manualer for styrketrening hjemme.',
        price: 649,
      },
      {
        id: 'mat',
        name: 'Treningsmatte',
        description: 'Myk, sklisikker matte for bevegelighet og styrke.',
        price: 349,
      },
    ],
  },
  {
    id: 'sunglasses',
    name: 'Solbriller',
    subtitle: 'Klar for solrike dager',
    emoji: '🕶️',
    products: [
      {
        id: 'classic-shades',
        name: 'Classic',
        description: 'Tidløse solbriller med UV-beskyttelse.',
        price: 499,
      },
      {
        id: 'sport-shades',
        name: 'Sport',
        description: 'Lett modell som sitter godt når du er i aktivitet.',
        price: 599,
      },
    ],
  },
];

const allProducts = categories.flatMap((category) => category.products);
const currency = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

export default function ShopApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [imageReturnTo, setImageReturnTo] = useState<Screen>('category');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<Record<string, number>>({});

  const cartItems = allProducts
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({ product, quantity: cart[product.id] }));
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function openCategory(category: Category) {
    setSelectedCategory(category);
    setScreen('category');
  }

  function changeCartQuantity(productId: string, difference: number) {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[productId] ?? 0) + difference;
      if (nextQuantity <= 0) {
        const remainingItems = { ...currentCart };
        delete remainingItems[productId];
        return remainingItems;
      }
      return { ...currentCart, [productId]: nextQuantity };
    });
  }

  function addToCart(product: Product) {
    const quantity = quantities[product.id] ?? 1;
    setCart((currentCart) => ({
      ...currentCart,
      [product.id]: (currentCart[product.id] ?? 0) + quantity,
    }));
    setQuantities((currentQuantities) => ({ ...currentQuantities, [product.id]: 1 }));
    Alert.alert('Lagt i handlekurven', `${product.name} er lagt til.`);
  }

  function placeOrder() {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Bestillingen er registrert',
      `Takk for bestillingen! Totalen er ${currency.format(cartTotal)}.`,
    );
    setCart({});
  }

  function goBack() {
    if (screen === 'image') {
      setScreen(imageReturnTo);
    } else if (screen === 'category' || screen === 'cart') {
      setScreen('home');
    }
  }

  function openProductImage(product: Product, returnTo: Screen) {
    setSelectedImage(product);
    setImageReturnTo(returnTo);
    setScreen('image');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable onPress={goBack} style={styles.brandButton}>
          <View style={styles.brandMark}>
            <Image source={require('../assets/uebak.jpg')} style={styles.brandImage} />
          </View>
          <View>
            <Text style={styles.brandName}>GULLO</Text>
            <Text style={styles.brandCaption}>FINN DIN FAVORITT</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Handlekurv, ${cartCount} varer`}
          onPress={() => setScreen('cart')}
          style={styles.cartButton}
        >
          <Text style={styles.cartIcon}>🛍️</Text>
          <Text style={styles.cartButtonText}>Kurv</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        </Pressable>
      </View>

      {screen === 'home' ? (
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>GODE TING, GODE DAGER</Text>
              </View>
              <Text style={styles.heroTitle}>Små eventyr. Store smil.</Text>
              <Text style={styles.heroText}>
                Finn utstyr til tur, trening og solrike dager.
              </Text>
            </View>
            <ProductArtwork size="hero" />
            <View style={styles.heroDecoration} />
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionEyebrow}>GULLO HAR NOE FOR DEG</Text>
              <Text style={styles.sectionTitle}>Utforsk kategorier</Text>
            </View>
            <Text style={styles.categoryCount}>0{categories.length}</Text>
          </View>

          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              onPress={() => openCategory(category)}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  index === 1 && styles.categoryIconBlue,
                  index === 2 && styles.categoryIconPeach,
                ]}
              >
                {index < 3 ? (
                  <Image
                    source={require('../assets/uebak.jpg')}
                    style={styles.categoryPhoto}
                    accessibilityLabel={`Bilde for ${category.name}`}
                  />
                ) : (
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                )}
              </View>
              <View style={styles.categoryTextBlock}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </View>
              <View style={styles.categoryArrow}>
                <Text style={styles.chevron}>↗</Text>
              </View>
            </Pressable>
          ))}
          <Text style={styles.footerNote}>
            En liten nettbutikk med store planer ☀
          </Text>
        </ScrollView>
      ) : null}

      {screen === 'category' && selectedCategory ? (
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.categoryHero}>
            <View style={styles.categoryHeroIcon}>
              <Text style={styles.categoryHeroEmoji}>{selectedCategory.emoji}</Text>
            </View>
            <Text style={styles.sectionEyebrow}>GULLO / KATEGORI</Text>
            <Text style={styles.sectionTitle}>{selectedCategory.name}</Text>
            <Text style={styles.pageIntro}>{selectedCategory.subtitle}.</Text>
            <Text style={styles.itemCount}>
              {selectedCategory.products.length} FAVORITTER Å UTFORSKE
            </Text>
          </View>
          {selectedCategory.products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Vis stort bilde av ${product.name}`}
                onPress={() => openProductImage(product, 'category')}
              >
                <ProductArtwork size="product" />
              </Pressable>
              <View style={styles.productDetails}>
                <View style={styles.productEyebrowRow}>
                  <Text style={styles.productEyebrow}>GULLO FAVORITT</Text>
                  <Text style={styles.productStar}>✦</Text>
                </View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.productBottomRow}>
                  <Text style={styles.productPrice}>{currency.format(product.price)}</Text>
                  <View style={styles.quantityPicker}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Reduser antall ${product.name}`}
                      onPress={() =>
                        setQuantities((current) => ({
                          ...current,
                          [product.id]: Math.max(1, (current[product.id] ?? 1) - 1),
                        }))
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.quantityText}>{quantities[product.id] ?? 1}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Øk antall ${product.name}`}
                      onPress={() =>
                        setQuantities((current) => ({
                          ...current,
                          [product.id]: Math.min(99, (current[product.id] ?? 1) + 1),
                        }))
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
                <ActionButton title="Legg i kurven  →" onPress={() => addToCart(product)} />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : null}

      {screen === 'cart' ? (
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.sectionEyebrow}>GULLO / HANDLEKURV</Text>
          <Text style={styles.sectionTitle}>Handlekurven</Text>
          <Text style={styles.pageIntro}>Dine utvalgte favoritter, samlet på ett sted.</Text>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <ProductArtwork size="empty" />
              <Text style={styles.emptyCartTitle}>Her var det tomt!</Text>
              <Text style={styles.emptyCartText}>
                Ta en titt i kategoriene og finn noe som gjør dagen litt bedre.
              </Text>
              <ActionButton title="Utforsk butikken" onPress={() => setScreen('home')} />
            </View>
          ) : (
            <>
              {cartItems.map(({ product, quantity }) => (
                <View key={product.id} style={styles.cartItem}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Vis stort bilde av ${product.name}`}
                    onPress={() => openProductImage(product, 'cart')}
                  >
                    <ProductArtwork size="cart" />
                  </Pressable>
                  <View style={styles.cartItemDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      {currency.format(product.price * quantity)}
                    </Text>
                    <View style={styles.quantityPicker}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Fjern én ${product.name}`}
                        onPress={() => changeCartQuantity(product.id, -1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </Pressable>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Legg til én ${product.name}`}
                        onPress={() => changeCartQuantity(product.id, 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
              <View style={styles.totalCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalPrice}>{currency.format(cartTotal)}</Text>
                </View>
                <Text style={styles.checkoutNote}>
                  Demo-bestilling. Ingen betaling eller personopplysninger lagres.
                </Text>
              </View>
              <ActionButton title="Bestill varer  →" onPress={placeOrder} />
            </>
          )}
        </ScrollView>
      ) : null}

      {screen === 'image' && selectedImage ? (
        <View style={styles.imageScreen}>
          <Text style={styles.sectionEyebrow}>GULLO / FAVORITT</Text>
          <Text style={styles.sectionTitle}>{selectedImage.name}</Text>
          <ProductArtwork size="large" />
          <Text style={styles.imageHint}>Trykk tilbake for å gå til produktene.</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ProductArtwork({ size }: { size: 'hero' | 'product' | 'cart' | 'large' | 'empty' }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Bildet som ble lastet ned for Gullo-butikken"
      style={[
        styles.artwork,
        size === 'hero' && styles.artworkHero,
        size === 'product' && styles.artworkProduct,
        size === 'cart' && styles.artworkCart,
        size === 'large' && styles.artworkLarge,
        size === 'empty' && styles.artworkEmpty,
      ]}
    >
      <Image
        source={require('../assets/uebak.jpg')}
        resizeMode="cover"
        style={styles.artworkPhoto}
      />
      {size !== 'cart' && size !== 'empty' ? (
        <View style={styles.artworkTag}>
          <Text style={[styles.artworkLabel, size === 'large' && styles.artworkLabelLarge]}>
            GULLO&apos;S FAVORITT
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function ActionButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
    >
      <Text style={styles.actionButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9EC',
  },
  topBar: {
    minHeight: 72,
    paddingHorizontal: 20,
    backgroundColor: '#FFF9EC',
    borderBottomColor: '#F0E8D6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    overflow: 'hidden',
    transform: [{ rotate: '-8deg' }],
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    color: '#20213C',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandCaption: {
    color: '#8C876E',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginTop: 2,
  },
  cartButton: {
    minHeight: 42,
    backgroundColor: '#FFFFFF',
    borderColor: '#EEE7D7',
    borderWidth: 1,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  cartIcon: {
    fontSize: 16,
  },
  cartButtonText: {
    color: '#20213C',
    fontSize: 13,
    fontWeight: '800',
  },
  cartBadge: {
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#FFD044',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: '#20213C',
    fontSize: 12,
    fontWeight: '900',
  },
  page: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 42,
  },
  hero: {
    minHeight: 220,
    backgroundColor: '#FFD044',
    borderRadius: 28,
    padding: 22,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroCopy: {
    flex: 1,
    zIndex: 1,
  },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF2BF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroPillText: {
    color: '#67521A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#20213C',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: 13,
    maxWidth: 220,
  },
  heroText: {
    color: '#51482F',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    maxWidth: 210,
  },
  heroDecoration: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFDE77',
    position: 'absolute',
    right: -40,
    bottom: -55,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionEyebrow: {
    color: '#89816D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.35,
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#20213C',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '900',
    marginBottom: 16,
  },
  categoryCount: {
    color: '#B5AA8D',
    fontSize: 14,
    fontWeight: '800',
    paddingBottom: 19,
  },
  categoryCard: {
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#F1EBDD',
    borderWidth: 1,
  },
  categoryIcon: {
    height: 56,
    width: 56,
    borderRadius: 17,
    backgroundColor: '#FFF0B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconBlue: {
    backgroundColor: '#E1EBFF',
  },
  categoryIconPeach: {
    backgroundColor: '#FFE5D9',
  },
  categoryPhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryTextBlock: {
    flex: 1,
    marginLeft: 14,
  },
  categoryName: {
    color: '#20213C',
    fontSize: 16,
    fontWeight: '900',
  },
  categorySubtitle: {
    color: '#918B7D',
    fontSize: 12,
    marginTop: 4,
  },
  categoryArrow: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: '#F7F3E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    color: '#34334E',
    fontSize: 18,
    fontWeight: '700',
  },
  footerNote: {
    color: '#A69C83',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 28,
  },
  categoryHero: {
    backgroundColor: '#FFF1BB',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  categoryHeroIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  categoryHeroEmoji: {
    fontSize: 25,
  },
  pageIntro: {
    color: '#777267',
    fontSize: 14,
    lineHeight: 20,
    marginTop: -10,
    marginBottom: 12,
  },
  itemCount: {
    color: '#9A7930',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'hidden',
    borderColor: '#F0EBDD',
    borderWidth: 1,
  },
  artwork: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0B8',
    overflow: 'hidden',
    position: 'relative',
  },
  artworkPhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  artworkTag: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 249, 236, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  artworkHero: {
    width: 108,
    height: 130,
    borderRadius: 30,
    marginLeft: 6,
    zIndex: 1,
  },
  artworkProduct: {
    width: '100%',
    height: 185,
    backgroundColor: '#FFE58A',
  },
  artworkCart: {
    width: 86,
    height: 92,
    borderRadius: 15,
    backgroundColor: '#FFE58A',
  },
  artworkLarge: {
    width: '100%',
    flex: 1,
    minHeight: 240,
    borderRadius: 28,
    backgroundColor: '#FFD044',
  },
  artworkEmpty: {
    width: 116,
    height: 116,
    borderRadius: 58,
    marginBottom: 14,
    backgroundColor: '#FFF0B8',
  },
  artworkLabel: {
    color: '#34334E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.15,
  },
  artworkLabelLarge: {
    fontSize: 12,
  },
  productDetails: {
    padding: 16,
  },
  productEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productEyebrow: {
    color: '#A08B4D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  productStar: {
    color: '#F0B819',
    fontSize: 17,
  },
  productName: {
    color: '#20213C',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 5,
  },
  productDescription: {
    color: '#827E73',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  productPrice: {
    color: '#20213C',
    fontSize: 19,
    fontWeight: '900',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#34334E',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  quantityText: {
    color: '#20213C',
    minWidth: 14,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
  },
  actionButton: {
    minHeight: 46,
    backgroundColor: '#252642',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.76,
  },
  emptyCart: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0EBDD',
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
  },
  emptyCartTitle: {
    color: '#20213C',
    fontSize: 19,
    fontWeight: '900',
  },
  emptyCartText: {
    color: '#827E73',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0EBDD',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    gap: 13,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  cartItemPrice: {
    color: '#84702F',
    fontSize: 14,
    fontWeight: '800',
  },
  totalCard: {
    backgroundColor: '#FFF1BB',
    borderRadius: 20,
    marginTop: 20,
    padding: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#20213C',
    fontSize: 17,
    fontWeight: '800',
  },
  totalPrice: {
    color: '#20213C',
    fontSize: 20,
    fontWeight: '900',
  },
  checkoutNote: {
    color: '#847A5C',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  imageScreen: {
    flex: 1,
    padding: 20,
    paddingTop: 28,
  },
  imageHint: {
    color: '#827E73',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 18,
  },
});
