import { Event, RNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import { DrugSearchPopup } from './DrugSearchPopup';

async function onActivate(plugin: RNPlugin) {
  // Register the React component to be used as a popup widget
  await plugin.app.registerWidget(
    'drugSearchPopup',
    WidgetLocation.Popup,
    {
      component: DrugSearchPopup,
      dimensions: { width: 450, height: 'auto' },
    }
  );

  // Add a listener that fires whenever the text in the editor changes
  plugin.event.addListener(
    Event.RichTextEditorChanged,
    async ({ remId }) => {
      const rem = await plugin.rem.findOne(remId);
      if (!rem) {
        return;
      }

      const text = await plugin.richText.toPlainText(rem.text);

      // Check if the text ends with the trigger string
      if (text.endsWith('=1=1')) {
        // 1. Remove the trigger string from the Rem
        const newText = text.substring(0, text.length - 4);
        await rem.setText(await plugin.richText.fromPlainText(newText));

        // 2. Open the popup widget at the current cursor location
        await plugin.window.openPopup('drugSearchPopup');
      }
    }
  );
}

async function onDeactivate(plugin: RNPlugin) {}

plugin.register({
  name: 'OpenFDA Drug Search',
  id: 'openfda-drug-search',
  onActivate,
  onDeactivate,
});