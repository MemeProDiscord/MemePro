const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log('Ready!')
  client.user.setPresence({
    status: 'available',
    activity: {
      name: 'with /aboutmemepro',
      type: 'PLAYING',
      url: 'https://discord.com'
    }
  })
})

const superagent = require('superagent')

const DB = require('@replit/database')
const db = new DB();

const IMGFLIP_API = 'https://api.imgflip.com/caption_image'

function requestMeme (templateId, text0 = ' ', text1 = ' ') {
  return superagent
    .post(IMGFLIP_API)
    .query({
      template_id: templateId,
      username: process.env.IMGFLIP_USERNAME,
      password: process.env.IMGFLIP_PASSWORD,
      text0,
      text1,
    })
}

const builtInMemes = require('./builtInMemes.js')

client.on('message', message => {

  if (message.content === '/aboutmemepro') {
    message.channel.send({
      embed: {
        description: 'Welcome to MemePro',
        fields: [
          {
            name: 'Usage',
            value: 'See the [website](https://memeprodiscord.github.io/) for a list of avaliable commands.'
          },
          {
            name: 'Source Code',
            value: 'MemePro is proudly open source. Check out our repositories [here](https://github.com/MemeProDiscord).'
          },
          {
            name: 'Invite',
            value: 'Click [here](https://discord.com/oauth2/authorize?client_id=810232729382682677&scope=bot&permissions=52224) to add MemePro to your own discord server.'
          },
          {
            name: 'Credits',
            value: 'Developed by [William Zhang](https://github.com/WilliamHYZhang) in Node.js with the Repl.it, Discord, and Imgflip APIs.'
          },
        ]
      }
    })
  }

  else if (message.content.startsWith('/addmeme')) {
    const server = message.guild.id.toString()
    const args = message.content.split(' ')
    if (args.length != 3) {
      message.channel.send({
        embed: {
          description: 'Failed: check the format of your request',
        }
      })
    }
    else {
      const command = '/'+args[1]
      if (Object.keys(builtInMemes).includes(command)) {
        message.channel.send({
          embed: {
            description: 'Failed: cannot overwrite built in meme command',
          }
        })
      }
      else {
        const templateId = args[2]
        requestMeme(templateId).then(resp => {
          if (resp.body.success) {
            db.set(server+command, templateId).then(() => {
              message.channel.send({
                embed: {
                  description: 'Added command '+command+' to meme:',
                  image: { url: resp.body.data.url },
                }
              })
            })
          }
          else {
            message.channel.send({
              embed: {
                description: 'Failed: could not retrieve meme',
              }
            })
          }
        })
      }
    }
  }

  else if (message.content.startsWith('/removememe')) {
    const args = message.content.split(' ')
    if (args.length != 2) {
      message.channel.send({
        embed: {
          description: 'Failed: check the format of your request',
        }
      })
    }
    else {
      const server = message.guild.id.toString()
      const command = '/'+args[1]
      if (Object.keys(builtInMemes).includes(command)) {
        message.channel.send({
          embed: {
            description: 'Failed: cannot delete built in meme command',
          }
        })
      }
      db.get(server+command).then(templateId => {
        if (templateId) {
          db.delete(templateId).then(() => {
            message.channel.send({
              embed: {
                description: 'Deleted command '+command,
              }
            })
          })
        }
        else {
          message.channel.send({
            embed: {
              description: 'Failed: command not found',
            }
          })
        }
      })
    }
  }

  else if (message.content.startsWith('/')) {
    const command = message.content.split(' ')[0].trim()
    const text = message.content.replace(command, '').trim()
    const textSplit = text.split('|')
    const text0 = textSplit[0] || ' '
    const text1 = textSplit.length > 1 ? textSplit[1] : ' '

    const server = message.guild.id.toString()
    db.get(server+command).then(templateId => {
      if (!templateId) templateId = builtInMemes[command]
      if (templateId) {
        requestMeme(templateId, text0, text1).then(resp => {
          if (resp.body.success) {
            message.channel.send({
              embed: {
                image: { url: resp.body.data.url },
              }
            })
          }
          else {
            message.channel.send({
              embed: {
                description: 'Failed: ' + resp.body.error_message,
              }
            })
          }
        })
      }
    })
  }
})

client.login(process.env.TOKEN)
