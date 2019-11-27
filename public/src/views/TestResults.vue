<template>
  <PageWrapper with-padding>
    <ArticlePage title="Test Results">
      <p>
        Though CBD has been used for centuries, it has become somewhat of a
        recent phenomenon. Primarily because it is such a new thing, CBD is
        currently unregulated by the FDA and most other governing bodies. Due to
        this unregulated nature, there are few quality standards that CBD
        companies must meet.
      </p>
      <p>
        Rather than take advantage,
        <strong>{{ fullName }}</strong> seeks to maintain transparency with our
        customers by publishing up-to-date test results that showcase the purity
        and high quality of our CBD products. We’ll publish these test results
        as soon as they’re made available by our testing partners. Please feel
        free to <router-link to="/support"> contact us </router-link>&nbsp;if
        you have any questions about how to understand these results or any
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

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvSelector
  },
  setup() {
    const { testResults } = inject(Modules.testResults) as ITestResults;
    const fullName = process.env.VUE_APP_FULL_NAME;

    const selectedSortType = ref('newest');
    const sortOptions = [
      { id: 0, value: 'newest', display: 'Newest to Oldest' },
      { id: 1, value: 'oldest', display: 'Oldest to Newest' }
    ];
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
