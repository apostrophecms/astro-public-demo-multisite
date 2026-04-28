import HomePage from './HomePage.astro';
import DefaultPage from './DefaultPage.astro';
import ArticleIndexPage from './ArticleIndexPage.astro';
import ArticleShowPage from './ArticleShowPage.astro';
import RoomIndexPage from './RoomIndexPage.astro';
import RoomShowPage from './RoomShowPage.astro';
import NotFoundPage from './NotFoundPage.astro';

const templateComponents = {
  '@apostrophecms/home-page': HomePage,
  'default-page': DefaultPage,
  'article-page:index': ArticleIndexPage,
  'article-page:show': ArticleShowPage,
  'room-page:index': RoomIndexPage,
  'room-page:show': RoomShowPage,
  '@apostrophecms/page:notFound': NotFoundPage
};

export default templateComponents;
