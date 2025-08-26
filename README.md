# Vencord-Bobby-Plugin

This is just a repo to contain files for my Vencord plugin, As using file imports isn't very supported.

# CONSOLE VERSION

To run the console version, simply paste this in the console:

```
fetch("https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/path/to/file.js")
  .then(r => r.text())
  .then(js => eval(js));
```
