import RichTextWidget from './RichTextWidget.astro';
import ImageWidget from './ImageWidget.astro';
import VideoWidget from './VideoWidget.astro';
import LayoutWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutWidget.astro';
import LayoutColumnWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutColumnWidget.astro';
import FileWidget from './FileWidget.astro';
import ButtonWidget from './ButtonWidget.astro';
import HeroWidget from './HeroWidget.astro';
import CardWidget from './CardWidget.astro';
import PriceCardWidget from './PriceCardWidget.astro';
import ArticleWidget from './ArticleWidget.astro';
import GithubPrsWidget from './GithubPrsWidget.astro';

const widgetComponents = {
  '@apostrophecms/rich-text': RichTextWidget,
  '@apostrophecms/image': ImageWidget,
  '@apostrophecms/video': VideoWidget,
  '@apostrophecms/layout': LayoutWidget,
  '@apostrophecms/layout-column': LayoutColumnWidget,
  '@apostrophecms/file': FileWidget,
  'button': ButtonWidget,
  'hero': HeroWidget,
  'card': CardWidget,
  'card-title-rt': RichTextWidget,
  'card-content-rt': RichTextWidget,
  'price-card': PriceCardWidget,
  'article': ArticleWidget,
  'github-prs': GithubPrsWidget
};

export default widgetComponents;
