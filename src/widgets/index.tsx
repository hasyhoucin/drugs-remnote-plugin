import { PluginCommand, Plugin, ReactRNPlugin } from '@remnote/plugin-sdk';
import '../App.css';
import { DrugSearchWidget } from './DrugSearchWidget';

async function onActivate(plugin: ReactRNPlugin) {

  // Register the slash command
  await plugin.app.registerCommand<PluginCommand>({
    id: 'drugSearch',
    name: 'Drug Search (=1=1)',
    description: 'Opens a floating window to search for drug information',
    action: async () => {
      // This action opens the floating widget
      await plugin.window.openFloatingWidget(
        'drugSearchWidget', // This ID must match the registered widget
        {
          top: 100,
          left: 100,
          width: 500,
          height: 400,
        },
        true // Make it focusable
      );
    },
  });

  // Register the floating widget
  // This is the component that will be rendered in the floating window
  await plugin.widget.registerFloatingWidget(
    'drugSearchWidget',
    'Drug Search',
    {
      dimensions: {
        width: 500,
        height: 400
      },
      widgetComponent: DrugSearchWidget,
    }
  );
}

async function onDeactivate(plugin: Plugin) {
}

declare var plugin: ReactRNPlugin;
plugin.register(onActivate, onDeactivate);