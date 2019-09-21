<template>
  <page-wrapper withPadding>
    <article-page title="Test Results">
      <p>Though CBD has been used for centuries, it has become somewhat of a recent phenomenon. Primarily because it is such a new thing, CBD is currently unregulated by the FDA and most other governing bodies. Due to this unregulated nature, there are few quality standards that CBD companies must meet.</p>
      <p>
        Rather than take advantage,
        <strong>{{ fullName }}</strong> seeks to maintain transparency with our customers by publishing up-to-date test results that showcase the purity and high quality of our CBD products. We’ll publish these test results as soon as they’re made available by our testing partners. Please feel free to
        <router-link to="/support">contact us</router-link>&nbsp;if you have any questions about how to understand these results or any other quality-related questions.
      </p>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          type="application/pdf"
          href="/test-results-files/Hemp-License.pdf"
        >2019 Colorado State Hemp License</a>
      </p>
      <av-selector
        label="Sort Test Results"
        :options="sortOptions"
        loopKey="id"
        displayKey="display"
        :boundProp="selectedSortType"
        @select-change="selectedSortType = $event"
      ></av-selector>
      <ul>
        <li v-for="res in testResults.slice().sort(sortByDate)" :key="res.title">
          <a
            target="_blank"
            rel="noopener noreferrer"
            type="application/pdf"
            :href="`/test-results-files/${res.url}.pdf`"
          >{{ res.title }}</a>
        </li>
      </ul>
    </article-page>
  </page-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import { mapState, mapActions } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import AvSelector from '../components/AvSelector.vue';
import TestResult from '../types/TestResult';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvSelector
  },
  computed: {
    ...mapState('base', ['testResults'])
  },
  data() {
    return {
      fullName: process.env.VUE_APP_FULL_NAME,
      selectedSortType: 'newest',
      sortOptions: [
        { id: 0, value: 'newest', display: 'Newest to Oldest' },
        { id: 1, value: 'oldest', display: 'Oldest to Newest' }
      ]
    };
  },
  beforeMount() {
    if (this.testResults.length < 1) {
      const testResOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'testResults'
      };
      this.getFirestoreData(testResOptions);
    }
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    sortByDate(a: TestResult, b: TestResult) {
      return this.selectedSortType === 'oldest'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
  }
});
</script>