<template>
  <PageWrapper with-padding>
    <ArticlePage title="Feedback and Support">
      <h2>Tracking, Order Information, Returns, and Customer Support</h2>
      <p>
        For fastest results, text messaging is preferred. Second fastest after
        text messaging is email. We aim to respond to all customer support email
        claims within 24 - 48 hours.
      </p>
      <p>
        Customer support calls may be made by appointment. Our support number is
        text message only.
      </p>
      <p><strong>Text:</strong> 530-436-6386</p>
      <p>
        <strong>Email:&nbsp;</strong>
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="
            `mailto:${supportEmail}?subject=Customer%20Support%20Question&body=Hello!%0A%0AI%20need%20custom%20support%20regarding...`
          "
          >{{ supportEmail }}</a
        >
      </p>
      <h2>Wholesale</h2>
      <p>
        For more information about wholesale purchasing and creating a wholesale
        account, please visit
        <router-link to="/wholesale"> our wholesale page </router-link>.
      </p>
      <p>
        <strong>Email:&nbsp;</strong>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:david@purecbdexchange.com?subject=Wholesale%2C%20Support%2C%20Inquiry&body=I%20have%20a%20wholesale%20support%20question..."
          >david@purecbdexchange.com</a
        >.
      </p>
      <h2>Partnerships, Advertising, and Events</h2>
      <p>
        For more information, about partnerships, advertising, marketing,
        events, and more, please email us at the address below.
      </p>
      <p>
        <strong>Email:&nbsp;</strong>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:dillon@purecbdexchange.com?subject=Partnerships%2C%20Advertising%2C%20or%20Events%20Question&body=Hello!%0A%0AI'd%20love%20to%20partner%20with%20your%20company!%20More%20information%20here..."
          >dillon@purecbdexchange.com</a
        >
      </p>
      <p>
        <strong>App Verison: {{ version }}</strong>
      </p>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped></style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import PageWrapper from '@/components/PageWrapper.vue';
import ArticlePage from '@/components/ArticlePage.vue';
import { useMetadata } from '../use/metadata';
import version from '../../../shared/version';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  },
  setup() {
    const supportEmail = process.env.VUE_APP_EMAIL;

    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Feedback and Support');
    setPageDescription(
      "If you're having trouble with your order, have wholesale questions or inquires, or even just general questions about CBD, you've come to the right place. Our support team is standing by to assist you for any of your CBD needs."
    );

    return { version, supportEmail };
  }
});
</script>
