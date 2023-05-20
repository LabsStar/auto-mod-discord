[![npm version](https://badge.fury.io/js/%40hyperstarcloud%2Fauto-mod.svg)](https://badge.fury.io/js/%40hyperstarcloud%2Fauto-mod)
[![GitHub license](https://img.shields.io/github/license/hyperstarcloud/auto-mod)](https://github.com/hyperstarcloud/auto-mod/blob/main/LICENSE)

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
const { AutoMod, LinkChecker } = require("auto-mod-discord"); // Import the package


const client = new Client({
    intents: 32767, // All intents
});

const autoMod = new AutoMod(client); // Default settings
const linkChecker = new LinkChecker(client); // Default settings
```

## Dependencies

This package has the following dependencies:

- discord.js
- chalk


## Examples

All examples are in the [examples](https://github.com/LabsStar/auto-mod-discord/tree/main/examples) folder.

- AutoMod
- LinkChecker

## Roadmap

- Add AntiSpam
- Add Analytics (Might be a separate method)

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](https://www.hyperstar.cloud/contributing)