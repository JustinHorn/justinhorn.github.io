import React from "react";

export default {
  header: {
    aboutMe: (
      <div>
        I am Justin, 20yo developer from Brunswick. <br /> <br /> My passions
        are learning, building connections and giving back. Since there is no
        such thing as a single true vocation, only discipline, dedication and
        smart work can get you forward.
        <br /> <br /> In my free time I play Jugger, game sth. or hang out with
        friends.
      </div>
    ),
  },
  webdev: {
    technologies,

    projects: [
      new WebProject(
        "Ultimate Tic Tac Toe",
        "https://justinhorn.github.io/ultimate-tic-tac-toe-react",
        "https://github.com/JustinHorn/ultimate-tic-tac-toe-react",
        "uTTT.png",
        "May 2020",
        ["reactjs"]
      ),
      new WebProject(
        "Joy of Code",
        "https://joyofcode.herokuapp.com/",
        "https://github.com/JustinHorn/joyofcode",
        "joyofcode.png",
        "October 2020",
        ["reactjs", "apollo", "graphql", "nodejs", "prisma", "sql"]
      ),
      new WebProject(
        "DayPlanner Website",
        "https://dayplanner.online/",
        "https://github.com/JustinHorn/DayPlanner",
        "dayplanner.png",
        "March 2020",

        ["bootstrap", "nodejs", "mongodb"]
      ),
    ],
    groupProjects: [
      new WebProject(
        "Cook Book",
        "https://justinhorn.github.io/group-one-cookbook/",
        "https://github.com/JustinHorn/group-one-cookbook",
        "cookBook.png",
        "June 2020",

        ["html5", "css3", "javascript"]
      ),

      new WebProject(
        "Meme Generator",
        "https://meme-creator-seven.vercel.app/",
        "https://github.com/JustinHorn/memeCreator",
        "memeGenerator.png",
        "August 2020",

        ["css3", "reactjs", "firebase"]
      ),
      new WebProject(
        "Rickys Quest",
        "https://rickysquest.netlify.app/",
        "https://github.com/Ey-Jay/rickysquest",
        "rickandmorty.png",
        "September 2020",

        ["html5", "css3", "reactjs", "firebase"]
      ),
    ],
  },
  android: [
    new AnroidProject(
      "Jugger Tetris",
      false,
      "https://github.com/JustinHorn/JuggerTetris",
      "juggertetris.jpeg",
      "April 2020",

      ["kotlin"],
      "Tetris App with block Icons of Jugger Teams."
    ),
    new AnroidProject(
      "Time Logger",
      false,
      "https://github.com/JustinHorn/TimeLogger",
      "timelogger.jpeg",
      "April 2020",

      ["kotlin"],
      "A time tracking app for Android and Wear OS using speech recognition."
    ),
  ],

  windows: [
    new WindowsProject(
      "Neural Network for Tic Tac Toe",
      false,
      "https://github.com/JustinHorn/TicTacToe",
      "tictactoe.png",
      "June 2019",

      ["java"],
      "Tic Tac Toe with several AI opponents. A bruteforce and some Feedforward neural network Algorithms."
    ),
    new WindowsProject(
      "Ultimate Tic Tact Toe",
      false,
      "https://github.com/JustinHorn/MonteCarloUltimateTicTacToe",
      "uTTT.png",
      "July 2019",

      ["java"],
      "Ultimate Tic Tac Toe with a Monte Carlo Algorithm."
    ),
    new WindowsProject(
      "Dayplanner Program",
      "http://justinhorn.github.io/DayPlanner",

      "https://github.com/JustinHorn/DayPlanner",
      "dayplanner.png",
      "January 2020",

      ["python"],
      "A Texteditor style 'DayPlanner' utelizing patterns to save and reuse daily routines. Get it's .exe over the github readme."
    ),
  ],

  footer,
};

function Project(
  name,
  url,
  github,
  img,
  date = "",
  tech = [],
  description = ""
) {
  this.name = name;
  this.url = url;
  this.github = github;
  this.img = img;
  this.date = date;
  this.tech = tech;
  this.description = description;
}

function WebProject(
  name,
  url,
  github,
  img,
  date = "",
  tech = [],
  description = ""
) {
  Project.call(this, name, url, github, "web/" + img, date, tech, description);
  this.type = "web";
}

function AnroidProject(
  name,
  url,
  github,
  img,
  date = "",
  tech = [],
  description = ""
) {
  Project.call(
    this,
    name,
    url,
    github,
    "android/" + img,
    date,
    tech,
    description
  );
  this.type = "android";
}

function WindowsProject(
  name,
  url,
  github,
  img,
  date = "",
  tech = [],
  description = ""
) {
  Project.call(
    this,
    name,
    url,
    github,
    "windows/" + img,
    date,
    tech,
    description
  );
  this.type = "windows";
}

export const technologies = {
  icons: {
    favourite: ["MongoDB", "Express", "React", "NodeJs"],
    tools: ["Git", "Github", "VSCode"],
    experience: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Java",
      "Python",
      "Kotlin",
      "Android",
    ],
  },
};

export const footer = {
  icons: [
    new FooterIcon(
      "linkedin.png",
      "https://www.linkedin.com/in/justin-christian-horn/"
    ),
    new FooterIcon("github.png", "https://github.com/JustinHorn"),
    new FooterIcon("email.jpg", "mailto:justinhorn0000@gmail.com"),
  ],
};

function FooterIcon(src, href) {
  this.src = "/img/icons/" + src;
  this.href = href;
}
