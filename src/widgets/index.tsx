import { registerWidget, RemNotePlugin, RNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../App.css';
import { DrugSearchWidget } from './DrugSearchWidget';

// 1. Corrected imports and function signatures
async function onActivate(plugin: RNPlugin) {

  // Register the slash command (now just a command)
  await plugin.app.registerCommand({
    id: 'drugSearch',
    name: 'Drug Search (=1=1)',
    description: 'Opens a floating window to search for drug information',
    // 2. The action is now simpler
    action: async () => {
      // This action opens the floating widget
      await plugin.window.openFloatingWidget(
        'drugSearchWidget', // This ID must match the registered widget
        {
          // 3. Floating widget dimensions now use top, left, right, bottom for positioning
          // and the widget dimensions are defined in registerWidget
          top: 100,
          left: 100,
        },
      );
    },
  });

  // 4. Corrected function name to registerWidget and new syntax
  registerWidget(
    'drugSearchWidget',
    WidgetLocation.Floating, // Use WidgetLocation enum
    {
      dimensions: {
        width: 500,
        height: 400
      },
      widgetComponent: DrugSearchWidget,
    }
  );
}

// 5. Plugin is now registered differently
// Note: onActivate will be called when the widget is opened for the first time
// For simple plugins, we use registerWidget (which calls register)
registerWidget(
    'index', 
    WidgetLocation.Floating, 
    { 
        widgetComponent: DrugSearchWidget,
        onActivate: onActivate, 
    }
);