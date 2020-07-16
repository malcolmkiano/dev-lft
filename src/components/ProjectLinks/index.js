import React from 'react';

const ProjectLinks = ({ github = '', live = '', trello = '' }) => {
  return (
    <article className="card">
      <h3 className="title">Links</h3>
      {!github && !live && !trello ? (
        <p className="project">No links found</p>
      ) : (
        <ul className="project links">
          {github && (
            <li>
              <a rel="noopener noreferrer" target="_blank" href={github}>
                Github
              </a>
            </li>
          )}
          {live && (
            <li>
              <a rel="noopener noreferrer" target="_blank" href={live}>
                Live Page
              </a>
            </li>
          )}
          {trello && (
            <li>
              <a rel="noopener noreferrer" target="_blank" href={trello}>
                Trello
              </a>
            </li>
          )}
        </ul>
      )}
    </article>
  );
};

export default ProjectLinks;
