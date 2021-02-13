# MemePro
Source code for the Meme Pro project.

## How It Works

### Discord

We use [discord.js](https://discord.js.org/#/) to run our server in Node.js. We have the client listen to messages and respond accordingly if it matches a command.

### Meme Commands

We have a object that is imported in that maps the predefined commands to their respective template ids. In regards to custom commands, we store these mappings in a [Repl.it database](https://docs.repl.it/misc/database), where we use a compound key `{serverId}{command}` to map to the template ids. `/addmeme` and `/removememe` operate in this database.

### Captioning Memes

We use the [Imgflip API](https://imgflip.com/api) to request the captioned image, which we then display.

## Possible TODOs
- Add support for more than two captions.
- Add support to disable predefined commands.
- Add support to have users login on behalf of the user?/channel?/server? in case imgflip rate limiting becomes an issue.
- Add rate limiting.

### How to Contribute

We welcome contributors both big and small. Some possible contribution ideas include
- Add more predefined memes! :pray: We only have 10 at the moment.
- Implement TODOs.
- Your own ideas.

Open up a PR and [@WilliamHYZhang](https://github.com/WilliamHYZhang) will review it! :smile:
