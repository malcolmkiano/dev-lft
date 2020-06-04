import React from 'react';

const ProjectDashInfo = ({ name = '', description = '', tags = [] }) => {
  const renderTags = tags => {
    if (!tags.length) {
      return;
    } else if (tags) {
      let tagsList = tags.map(tag => {
        return <li key={tag}>{tag}</li>;
      });
      return tagsList;
    }
  };

  return (
    <>
      <h2>{name}</h2>
      <p>{description}</p>
      <ul className="tags">{renderTags(tags)}</ul>
    </>
  );
};

export default ProjectDashInfo;
