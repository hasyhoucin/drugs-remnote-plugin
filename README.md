# RemNote OpenFDA Drug Search Plugin

This plugin allows you to quickly search for drug information from the OpenFDA database directly within RemNote.

## Features

-   Type `=1=1` to open a search popup.
-   The popup auto-focuses, so you can start typing your query immediately.
-   Fetches and displays drug information as you type, including:
    -   Commercial (Brand) Names
    -   Generic Name
    -   Pharmacologic Class (Family/Action)

## Installation

1.  Build the plugin using `npm run build`.
2.  Go to `Plugins` in RemNote.
3.  Go to `Develop` -> `Upload Plugin`.
4.  Select the bundled `remnote-openfda-search.zip` file (you will need to zip the `dist`, `public`, and `package.json` files).