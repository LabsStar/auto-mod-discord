[![npm version](https://badge.fury.io/js/auto-mod-discord.svg)](https://badge.fury.io/js/auto-mod-discord)
[![GitHub stars](https://img.shields.io/github/stars/LabsStar/auto-mod-discord)](https://github.com/LabsStar/auto-mod-discord)
[![GitHub issues](https://img.shields.io/github/issues/LabsStar/auto-mod-discord)](https://github.com/LabsStar/auto-mod-discord/issues)
[![GitHub license](https://img.shields.io/github/license/LabsStar/auto-mod-discord)](https://github.com/LabsStar/auto-mod-discord/blob/main/LICENSE)

# auto-mod-discord

A Node.js package for automoderation in Discord servers.

## Installation

Install the package using npm:

```shell
npm install auto-mod-discord
```

## Usage

```javascript
const { Client } = require("discord.js"); // Import discord.js
const { AutoMod, LinkChecker, AntiSpam } = require("auto-mod-discord"); // Import the package


const client = new Client({
    intents: 32767, // All intents
});

const autoMod = new AutoMod(client); // Default settings
const linkChecker = new LinkChecker(client); // Default settings
const antiSpam = new AntiSpam(client); // Default settings
```

## Dependencies

This package has the following dependencies:

- discord.js
- chalk


## Examples

All examples are in the [examples](https://github.com/LabsStar/auto-mod-discord/tree/main/examples) folder.

- AutoMod
- LinkChecker
- AntiSpam

## Roadmap

- ~~Add AntiSpam~~
- Add Analytics (Might be a separate method)

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](https://www.hyperstar.cloud/contributing)