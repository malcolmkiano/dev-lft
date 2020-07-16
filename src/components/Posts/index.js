import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import UserContext from '../../contexts/UserContext';
import ProjectDashService from '../../services/project-dash-service';
import Button from '../Button/';
import Avatar from '../Avatar/';

// images
import { EditIcon } from '../../images';

class Posts extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postToEdit: null
    };
    this.postForm = React.createRef();
    this.postList = React.createRef();
  }

  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate() {
    const { clientPosts, clientPatchedPosts } = this.props.webSocket;
    if (clientPosts.length > 0) {
      this.setState(
        { posts: [...clientPosts, ...this.state.posts] },
        () =>
          (this.postList.current.scrollTop = this.postList.current.scrollHeight)
      );
      this.props.webSocket.clearClientPosts();
    }

    if (clientPatchedPosts.length > 0) {
      const postsToUpdate = this.state.posts;
      clientPatchedPosts.forEach(post => {
        let currentPostIdx = postsToUpdate.findIndex(p => p.id === post.id);
        if (currentPostIdx >= 0) {
          postsToUpdate[currentPostIdx] = post;
        }
      });
      this.setState({ posts: postsToUpdate });
      this.props.webSocket.clearClientPatchedPosts();
    }
  }

  handleEditPost = post_id => {
    this.setState({
      postToEdit: post_id
    });
  };

  getPosts = () => {
    const { project_id } = this.props;
    ProjectDashService.getPosts(project_id)
      .then(posts => {
        this.setState({
          posts,
          postToEdit: null,
          error: null
        });
        this.postList.current.scrollTop = this.postList.current.scrollHeight;
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handlePatchPost = e => {
    e.preventDefault();
    let post_id = this.state.postToEdit;
    let message = e.target['edit-post'].value;
    ProjectDashService.patchPost(post_id, message)
      .then(() => this.setState({ postToEdit: null }))
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleSubmitPost = e => {
    e.preventDefault();
    let { project_id } = this.props;
    let message = e.target['create-post'].value;
    this.postForm.current.reset();

    ProjectDashService.postPost(project_id, message).catch(res => {
      this.setState({
        error: res.error || 'Something went wrong. Please try again later'
      });
    });
  };

  handleCancelEdit = () => {
    this.setState({
      postToEdit: null
    });
  };

  renderDate = date => {
    let currentTime = new Date();
    let postDate = new Date(date);
    let diffInHrs = differenceInHours(currentTime, postDate);
    let diffInMins = differenceInMinutes(currentTime, postDate);
    switch (true) {
      case diffInHrs < 1:
        return `${diffInMins}m ago`;
      case diffInHrs < 24:
        return `${diffInHrs}h ago`;
      case diffInHrs < 48:
        return `Yesterday`;
      default:
        return format(postDate, 'EEEE');
    }
  };

  renderPosts = () => {
    const { posts, postToEdit } = this.state;
    const {
      user: { username }
    } = this.context;
    if (!posts.length) {
      return <li className="project">No posts, yet!</li>;
    }

    let allPosts = [...posts].reverse().map(post => {
      const isAuthor = post.author.username === username;
      return (
        <li key={post.id} className={`message ${isAuthor ? 'author' : ''}`}>
          <header className="user-info">
            <Avatar
              first_name={post.author.first_name}
              last_name={post.author.last_name}
            />
            <h4 className="h5">
              {isAuthor ? (
                'You'
              ) : (
                <Link to={`/users/${post.author.username}`}>
                  {post.author.first_name} {post.author.last_name}
                </Link>
              )}
            </h4>
            <span className="date">{this.renderDate(post.date_created)}</span>
            {post.canEdit ? (
              <Button
                onClick={() => this.handleEditPost(post.id)}
                disabled={postToEdit === post.id}
                className="clear"
                title="Edit post"
              >
                <EditIcon />
              </Button>
            ) : (
              ''
            )}
          </header>

          {postToEdit === post.id ? (
            <form
              name="edit-post-form"
              className="body"
              onSubmit={this.handlePatchPost}
            >
              <label className="hidden" htmlFor="edit-post">
                Change to:
              </label>
              <input
                autoFocus
                type="text"
                maxLength="280"
                name="edit-post"
                id="edit-post"
                defaultValue={post.message}
                placeholder="Say something"
              />
              <Button type="submit">Update</Button>
              <Button onClick={this.handleCancelEdit} className="clear">
                Cancel
              </Button>
            </form>
          ) : (
            <p className="body">
              {post.message.substr(0, 279) +
                (post.message.length > 280 ? '...' : '')}
            </p>
          )}
        </li>
      );
    });
    return allPosts;
  };

  render() {
    const { error } = this.state;
    return (
      <article className="card">
        <div className="team-posts">
          <h3 className="title">Discussion</h3>
          <ul ref={this.postList} className="chats discussion">
            {this.renderPosts()}
          </ul>
        </div>

        {error ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : (
          ''
        )}

        <form
          onSubmit={this.handleSubmitPost}
          ref={this.postForm}
          autoComplete="off"
        >
          <div className="input-group pinned">
            <div className="input">
              <label htmlFor="create-post">What do you want to post?</label>
              <input
                name="create-post"
                id="create-post"
                type="text"
                placeholder="Say something"
                required
                minLength="2"
                maxLength="280"
              />
            </div>
            <Button type="submit">Post</Button>
          </div>
        </form>
      </article>
    );
  }
}

export default Posts;

Posts.propTypes = {
  project_id: PropTypes.number.isRequired,
  webSocket: PropTypes.shape({
    clientPosts: PropTypes.array,
    clientPatchedPosts: PropTypes.array,
    clearClientPosts: PropTypes.func,
    clearClientPatchedPosts: PropTypes.func
  }).isRequired
};
