# Sharn-Konet's Portfolio Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/b9d15ba3-f4cd-47c3-9607-1fc547326b63/deploy-status)](https://app.netlify.com/sites/sharnkonet-portfolio/deploys)

This is the source code for my portfolio website which I made using
[Svelte](https://svelte.dev/) and [Netlify](https://www.netlify.com/).

You can see it in action by going to [sharnko.net](https://sharnko.net)

The website is made completely from scratch. Initially I started with Hugo and
AWS Lightsail. I soon got frustrated with how little I could change the
aesthetic of any given Hugo theme, and instead decided to learn how to do
front-end development.

Svelte was my framework of choice for this, its modularity allows me to focus on
a particular component of the portfolio and that made it a lot easier to learn
the web dev concepts I was using.

I switched to Netlify from AWS Lightsail because it only really catered for
static websites, and I wanted to include some dynamic elements now that I was
writing the code myself. Netlify seemed like the best alternative as it had a
supported adapter maintained by the Svelte team. This meant I could create my
website however I wanted locally, and it would translate directly to the website
I'd see under my domain.

## Projects

The projects section of the website is meant to be a place to house all of my
projects so that they are publically accessible. This means rather than having
to run some source code, people can interact with it online.

At the moment, this section is empty while I figure out the best way to
integrate compute resources into the website.

## Gallery

The gallery is a place for me to upload all of my photos so that if people are
interested in my photography, I can direct them to one place.

## Development

To get this repository working on your local machine, clone the repository and
run the following command in the created directory:

```bash
npm install
```

This will install all the required dependencies for the website.

If you'd like to get the website up and running, run:

```bash
npm run dev
```

