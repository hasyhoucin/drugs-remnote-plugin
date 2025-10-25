import { registerWidget } from '@remnote/core';
import { DrugSearchWidget } from './drug-search';

registerWidget('drug_search_widget', DrugSearchWidget, {
  widgetType: 'editor-toolbar',
  dimensions: { height: 'auto', width: '400px' }
});