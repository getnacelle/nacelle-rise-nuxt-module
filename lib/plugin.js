function uuidv4() {
  // source: https://stackoverflow.com/a/2117523/6387812 (Update, 2017-06-28)
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export default async (context, inject) => {
  function registerProduct({ product }) {
    if (
      window !== undefined &&
      product &&
      product.vendor &&
      product.vendor.toLowerCase() === 'rise.ai'
    ) {
      const atcButton = document.querySelector('button.Rise-add-to-cart-button')
      atcButton.setAttribute(
        'style',
        'visibility: hidden; width: 0; padding: 0; margin: 0;'
      )

      const riseScript = document.createElement('script')
      riseScript.type = 'text/javascript'
      riseScript.defer = true
      riseScript.src =
        'https://str.rise-ai.com/?shop=' +
        '<%= options.domain %>' +
        '.myshopify.com'

      const lastScript = Array.from(
        document.getElementsByTagName('script')
      ).pop()

      lastScript.insertAdjacentElement('afterend', riseScript)

      window['Rise'] = {
        is_product_page: true,
        cart: {
          // imitate the cart token (required by Rise)
          token: uuidv4()
        },
        using_add_to_cart_flow: false,
        is_floating_cart_theme: true,
        product: {
          id: window.atob(product.pimSyncSourceProductId).split('/').pop()
        },
        full_product: {
          available: true
        }
      }

      window.sessionStorage.setItem('cartToken', window['Rise'].cart.token)
    }
  }

  inject('rise', { registerProduct })

  context.store.subscribe((mutation) => {
    const { type, payload } = mutation

    if (
      type === 'checkout/setCheckout' &&
      payload.id === null &&
      payload.url === null
    ) {
      window.sessionStorage.removeItem('cartToken')
    }
  })
}
