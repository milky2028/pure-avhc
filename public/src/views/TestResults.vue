<template>
  <PageWrapper with-padding>
    <ArticlePage title="Test Results">
      <p>
        <strong>{{ fullName }}</strong> seeks to maintain transparency with our
        customers by publishing up-to-date test results that showcase the purity
        and high quality of our CBD products. These test results are posted
        intermittently as they’re made available by our testing partners.
      </p>

      <p>
        There are two primary kinds of test results done for CBD products,
        <strong>potency</strong> tests and
        <strong>microbial contaminant</strong> tests.
      </p>

      <h3>About Potency Testing</h3>

      <p>
        Potency testing includes two rounds of analysis. The first round,
        <strong>pre-harvest testing</strong>, occurs 30 days prior to harvest,
        as required by federal and state laws. The exact day when this occurs
        varies from state-to-state. During pre-harvest testing, samples are
        tested for compliance, combining Delta-9 THC and THCa for a combined THC
        total. After this phase, compliant samples will be certified as
        Industrial Hemp. <strong>Post-harvest testing</strong> reflects the
        cannabinoid content in products after they've been dried and harvested.
        These tests are not required in order to meet compliance. We do these
        purely to keep our clients and customers informed.
      </p>

      <h3>About Microbial Contaminants Testing</h3>

      <p>
        {{ fullName }} proudly adheres to the testing requirements of regulated
        cannabis markets, such as, Colorado, Nevada, and Canada. As a hemp
        company, we are not required to meet these standards. However, in the
        interest of consumer safety, we seek to maintain the same level of
        compliance in our products as THC products sold in recreational and
        medical dispensaries.
      </p>

      <p>
        Nearly all cannabis samples, as well the majority of agricultural
        products, contain some levels of yeast/mold. The limit for yeast and
        mold contamination in cannabis is 10,000 CFU/g. This is pass/fail test
        that measures for dangerous thresholds of yeast/mold in cannabis
        products. Any cannabis sample that does not exceed 10,000 CFU/g is
        considered passing and could theoretically be sold on shelves in a
        dispensary.
      </p>

      <p>
        Please feel free to
        <router-link to="/support">contact us</router-link>
        if you have any questions about how to understand these results or any
        other quality-related questions.
      </p>

      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          type="application/pdf"
          href="/test-results-files/Hemp-License.pdf"
          >2019 Colorado State Hemp License</a
        >
      </p>
      <AvSelector
        class="selector"
        label="Sort Test Results"
        :options="sortOptions"
        loop-key="id"
        display-key="display"
        :bound-prop="selectedSortType"
        @select-change="selectedSortType = $event"
      />
      <ul>
        <li v-for="res in testResults.slice().sort(sortByDate)" :key="res.id">
          <a
            target="_blank"
            rel="noopener noreferrer"
            type="application/pdf"
            :href="`/test-results-files/${res.url}.pdf`"
            >{{ formatDate(res.date) }} - {{ res.title }}</a
          >
        </li>
      </ul>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
.selector {
  margin: 2rem 0 0;
}
</style>

<script lang="ts">
import { createComponent, ref, inject } from '@vue/composition-api';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvSelector from '../components/AvSelector.vue';
import TestResult from '../types/TestResult';
import { Modules } from '../use/store';
import { ITestResults } from '../use/test-results';
import { useMetadata } from '../use/metadata';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvSelector
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Test Results');
    setPageDescription(
      "To ensure you're getting the best possible value and the absolute best CBD flower in the world, we publish our test results regularly to educate consumers on the health and purity of our products."
    );
    const { testResults } = inject(Modules.testResults) as ITestResults;
    const fullName = process.env.VUE_APP_FULL_NAME;

    const sortOptions = [
      { id: 0, value: 'newest', display: 'Newest to Oldest' },
      { id: 1, value: 'oldest', display: 'Oldest to Newest' }
    ];

    const selectedSortType = ref('newest');
    function sortByDate(a: TestResult, b: TestResult) {
      return selectedSortType.value === 'oldest'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }

    function formatDate(date: Date) {
      const formatter = new Intl.DateTimeFormat('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
      return formatter.format(date);
    }

    return {
      fullName,
      selectedSortType,
      sortOptions,
      formatDate,
      sortByDate,
      testResults
    };
  }
});
</script>
