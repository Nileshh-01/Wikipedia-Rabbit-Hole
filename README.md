# Wikipedia Rabbit Hole

<img width="2938" height="1595" alt="Screenshot 2026-10-06 at 11 31 30 AM" src="https://github.com/user-attachments/assets/77aca2a4-5c3b-4cf9-8b74-4baa592d3a27" />


Wikipedia Rabbit Hole is a browser game I built using HTML, CSS, and JavaScript and Fetch APIs.

The idea is simple: you start from one Wikipedia article and have to reach a target article by clicking through the related links of each article. The challenge is to reach the target before reaching the maximum allowed depth.

## How It Works

When the game starts, it selects a start article and a target article from popular Wikipedia pages.

The current article is displayed in the center, with its related Wikipedia articles shown around it as clickable buttons.

When you click a related article:

- The current article changes.
- The rabbit hole depth increases.
- The article is added to the visited history.
- The background changes based on the current article's image.
- A new set of related links is generated.

The game ends when you either reach the target article or reach the maximum depth.

## Difficulty

| Difficulty | Maximum Depth |
|------------|---------------|
| Easy       | 30            |
| Medium     | 20            |
| Hard       | 10            |

## Features

- Random start and target articles
- Dynamically generated related Wikipedia links
- Article images and descriptions
- Dynamic background based on the current article
- Rabbit hole depth counter and progress bar
- Visited article history
- Collapsible visited history panel
- Win and loss popups
- Restart functionality
- Responsive layout

## APIs Used

The project uses Wikimedia APIs to get the data needed for the game.

### Wikimedia Pageviews API

Used to get popular Wikipedia articles that can be used as start and target articles.

```text
https://wikimedia.org/api/rest_v1/metrics/pageviews/top/
```

### MediaWiki Action API

Used to fetch links from the current Wikipedia article and retrieve article information.

```text
https://en.wikipedia.org/w/api.php
```

### Wikipedia REST API

Used to get article summaries, descriptions, thumbnails, and other basic information.

```text
https://en.wikipedia.org/api/rest_v1/page/summary/
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Wikipedia APIs


## Goal

The main goal of the project was to make browsing Wikipedia feel more like a game than normal browsing.

Start with one topic, keep following links, and see whether you can find your way to the target.

#

<img width="2935" height="1589" alt="Screenshot 2026-10-05 at 4 42 41 PM" src="https://github.com/user-attachments/assets/8ad9f798-8f2a-40eb-a7e6-abfbffec2863" />
