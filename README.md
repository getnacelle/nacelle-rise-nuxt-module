# nacelle-rise-nuxt-module

Integrate [Rise.ai](https://www.rise.ai)'s gift card configurator into your [Nacelle](https://getnacelle.com/) Nuxt project

![Animation of Rise.ai gift card add-to-cart flow](https://nacelle-assets.s3-us-west-2.amazonaws.com/documentation/nacelle-rise-ai-gift-card-demo.gif)

## Requirements

- A Nacelle project set up locally. To get started, refer to [the Nacelle docs](https://docs.getnacelle.com).
- A [Rise Gift Card](https://dashboard.rise-ai.com/gift-cards) has been added to your Shopify store.

## Setup

To see the setup instructions demonstrated in a Nacelle Nuxt project, check out the [example](./example).

### Add Module to Nacelle

Once you have Nacelle set up, you can install this module in your project from `npm`:

```sh
npm install @nacelle/rise-nuxt-module --save
```

After the package has installed, open `nuxt.config.js`. Under `modules` add `@nacelle/nacelle-rise-nuxt-module` to the array:

```js
modules: [
  // ...other modules,
  '@nacelle/rise-nuxt-module"
],
```

Then add your store's Shopify domain to your environment variables `.env` file:

```sh
# example: "starship-furniture" for "starship-furniture.myshopify.com"
SHOPIFY_DOMAIN=xxxxxxxxxxxxx
```

Lastly, add the environment variable to the `nacelle` block of `nuxt.config.js`:

```javascript
// nuxt.config.js
nacelle: {
  // ...other Nacelle config
  shopifyDomain: process.env.SHOPIFY_DOMAIN
},
```

### Configure the `checkoutCreate` action

By default, the beginning of the `checkoutCreate` action in `~/store/checkout.js` is as follows:

```javascript
const cartItems = rootGetters['cart/checkoutLineItems']
const checkoutId = state.id || ''

if (cartItems.length === 0) {
  throw new Error('Cannot checkout with an empty cart')
}

let checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId })
if (checkout && checkout.completed) {
  checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId: '' })
}
```

For the Rise integration to work as expected, you must update this code to include a new metafield which is passed to the checkout:

```javascript
const cartItems = rootGetters['cart/checkoutLineItems']
const checkoutId = state.id || ''
const cartToken = window.sessionStorage.getItem('cartToken')
const metafields = cartToken ? [{ key: 'cart_token', value: cartToken }] : []

if (cartItems.length === 0) {
  throw new Error('Cannot checkout with an empty cart')
}

let checkout = await this.$nacelle.checkout.process({
  cartItems,
  checkoutId,
  metafields
})
if (checkout && checkout.completed) {
  checkout = await this.$nacelle.checkout.process({
    cartItems,
    checkoutId: '',
    metafields
  })
}
```

### Modify the Product Detail Page

In `~/pages/products/_productHandle.vue`, use `this.$rise.registerProduct()` to provide product information to Rise in the `mounted` lifecycle:

```javascript
mounted() {
  this.$rise.registerProduct({ product: this.product })
},
```

### Add a Class to the Add-to-Cart Button

Whether you're using `~/components/nacelle/ProductAddToCartButton.vue` or a custom Add to Cart button, the last step is to add the `Rise-add-to-cart-button` class to your Add to Cart button.

```html
<button class="Rise-add-to-cart-button">Add to Cart</button>
```

The "Send as a Gift" button added by Rise inherits the styles of the Add to Cart button, but it can also be styled using the `gwbutton` class.
