import HomePage from './HomePage.astro';
import DefaultPage from './DefaultPage.astro';
import ArticleIndexPage from './ArticleIndexPage.astro';
import ArticleShowPage from './ArticleShowPage.astro';
import JobIndexPage from './JobIndexPage.astro';
import JobShowPage from './JobShowPage.astro';
import NotFoundPage from './NotFoundPage.astro';

const templateComponents = {
  '@apostrophecms/home-page': HomePage,
  'default-page': DefaultPage,
  'article-page:index': ArticleIndexPage,
  'article-page:show': ArticleShowPage,
  'job-page:index': JobIndexPage,
  'job-page:show': JobShowPage,
  '@apostrophecms/page:notFound': NotFoundPage
};

export default templateComponents;
