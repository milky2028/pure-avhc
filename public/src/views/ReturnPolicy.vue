<template>
  <page-wrapper withPadding>
    <article-page title="Return Policy">
      <h2>Other Policies</h2>
      <p>
        In addition to this Privacy Policy, please review our
        <router-link to="/privacy-policy">Privacy Policy</router-link>&nbsp;and
        <router-link to="/terms-and-conditions">Terms and Conditions of Service</router-link>.
      </p>
      <p>
        If you believe you may be eligible for a return, please email us as
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:support@purecbdexchange.com?subject=I%20believe%20I%20may%20be%20eligible%20for%20a%20return&body=Hello!%20I%20believe%20my%20item%20may%20have%20been%20lost%20in%20shipping%2C%20and%20I%20understand%20that%20I%20may%20not%20be%20eligible%20for%20a%20return%20in%20any%20other%20case.%0A%0AMy%20order%20number%20is%20(fill%20in%20your%20order%20number%20here).%0A%0AThank%20you"
        >support@purecbdexchange.com</a>.
      </p>
      <p>Generally, {{ legalName }} does not offer returns or refunds. If your item has been lost in shipping or you have not received the item yet, we may be willing to offer you a return, provided that sufficient evidence shows that the item has indeed been lost in transit.</p>
      <p>Additional non-returnable items:</p>
      <ul>
        <li>Gift cards</li>
      </ul>
      <h2>Refunds</h2>

      <p>After you've contacted us with the necessary proof of purchase and evidence, and if we believe you are eligible for a refund, we will notify you. We will also notify you of the approval or rejection of your refund.</p>
      <p>If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
      <h2>Late or missing refunds (if applicable)</h2>

      <p>If you haven't received a refund yet, first check your bank account again.</p>
      <p>Then contact your credit card company. It may take some time before your refund is officially posted (up to 30 days).</p>
      <p>Next contact your bank. There is often some processing time before a refund is posted.</p>
      <p>
        If you've done all of this and you still have not received your refund yet, please contact us at
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:support@purecbdexchange.com?subject=I%20believe%20I%20may%20be%20eligible%20for%20a%20return&body=Hello!%20I%20believe%20my%20item%20may%20have%20been%20lost%20in%20shipping%2C%20and%20I%20understand%20that%20I%20may%20not%20be%20eligible%20for%20a%20return%20in%20any%20other%20case.%0A%0AMy%20order%20number%20is%20(fill%20in%20your%20order%20number%20here).%0A%0AThank%20you"
        >support@purecbdexchange.com</a>.
      </p>
      <h2>Sale items</h2>

      <p>Only regular priced items may be refunded, unfortunately sale items cannot be refunded.</p>
      <h2>Gifts</h2>

      <p>If the item was marked as a gift when purchased and shipped directly to you, you'll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.</p>
      <p>If the item wasn't marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and he will find out about your return.</p>
    </article-page>
  </page-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';

export default Vue.extend({
  data() {
    return {
      legalName: process.env.VUE_APP_LEGAL_NAME,
      siteUrl: process.env.VUE_APP_SITE_URL
    };
  },
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>
