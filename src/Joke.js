import React, { Component } from 'react';
import './Joke.css';

class Joke extends Component {
	constructor(props) {
		super(props);
		this.upVote = this.upVote.bind(this);
		this.downVote = this.downVote.bind(this);
		this.toggleLock = this.toggleLock.bind(this);
	}

	upVote() {
		this.props.vote(this.props.id, +1);
	}
	downVote() {
		this.props.vote(this.props.id, -1);
	}

	toggleLock() {
		this.props.toggleLock(this.props.id);
	}

	render() {
		return (
			<div className={`Joke ${this.props.isLocked ? 'Joke-locked' : ''}`}>
				<div className="Joke-votearea">
					<button onClick={this.upVote}>
						<i className="fas fa-thumbs-up" />
					</button>

					<span className={'Joke-votes'}>{this.props.votes}</span>

					<button onClick={this.downVote}>
						<i className="fas fa-thumbs-down" />
					</button>

					<div className="Joke-lock">
						<button onClick={this.toggleLock}>
							<i className={`fas ${this.props.isLocked ? 'fa-lock-open' : 'fa-lock'}`} />
						</button>
					</div>
				</div>

				<div className="Joke-text">{this.props.text}</div>
			</div>
		);
	}
}

export default Joke;
