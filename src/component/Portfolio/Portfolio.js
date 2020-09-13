import React, { useState } from "react";

import styles from "./portfolio.module.css";

import data from "data";

import Slider from "react-slick";

import { LinkIcon } from "component/Icon";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const Portfolio = () => {
  const { webdev } = data;

  return (
    <div className={styles.portfolio}>
      <div className={styles.group}>
        <h2>Personal Projects</h2>

        <div className={styles.projects}>
          {webdev.projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h2>WBS Group Projects</h2>

        <div className={styles.projects}>
          {webdev.groupProjects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

const Nav = ({ options, display, setDisplay, className }) => {
  return (
    <nav className={className}>
      {options.map((value, index) => (
        <button
          key={index}
          onClick={(e) => setDisplay(value)}
          style={{ color: display === value ? "black" : "" }}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </nav>
  );
};

const Projects = ({ name, data, className }) => {
  return (
    <div className={className}>
      <Slider {...settings}>
        {data.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </Slider>
    </div>
  );
};

export const Project = (project) => {
  return (
    <div className={styles.project}>
      <h4> {project.name}</h4>
      <iframe title={project.name} src={project.url} frameBorder="0" />
      <br />
      <div className={styles.links}>
        <a href={project.url}>
          <button className="">Visit</button>
        </a>
        <a href={project.github} className="rotate">
          <LinkIcon
            className={styles.icon}
            src="/img/icons/github.png"
            href={project.github}
          ></LinkIcon>
        </a>
      </div>
    </div>
  );
};
