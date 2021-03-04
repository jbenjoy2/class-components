import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends Component {
	static defaultProps = { numJokesToGet: 10 };
	constructor(props) {
		super(props);
		this.state = {
			jokes : []
		};
		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.toggleLock = this.toggleLock.bind(this);
		this.vote = this.vote.bind(this);
	}

	componentDidMount() {
		if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
	}

	componentDidUpdate() {
		if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
	}

	async getJokes() {
		try {
			let jokes = this.state.jokes;
			let seen = new Set(jokes.map((j) => j.id));
			while (jokes.length < this.props.numJokesToGet) {
				let response = await axios.get('https://icanhazdadjoke.com', {
					headers : { Accept: 'application/json' }
				});
				let { status, ...joke } = response.data;
				if (!seen.has(joke.id)) {
					seen.add(joke.id);
					jokes.push({ ...joke, votes: 0, isLocked: false });
				} else {
					console.log('duplicate');
				}
			}
			this.setState({ jokes });
		} catch (error) {
			console.log(error);
		}
	}

	generateNewJokes() {
		this.setState((state) => ({ jokes: state.jokes.filter((joke) => joke.isLocked) }));
	}

	vote(id, amount) {
		this.setState((state) => ({
			jokes : state.jokes.map(
				(joke) => (joke.id === id ? { ...joke, votes: joke.votes + amount } : joke)
			)
		}));
	}

	toggleLock(id) {
		this.setState((state) => ({
			jokes : state.jokes.map(
				(joke) => (joke.id === id ? { ...joke, isLocked: !joke.isLocked } : joke)
			)
		}));
	}

	/* get jokes if there are no jokes */
	render() {
		let sorted = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);
		let allAreLocked = sorted.filter((joke) => joke.isLocked).length === this.props.numJokesToGet;
		return (
			<div className="JokeList">
				<button
					className="JokeList-getmore"
					onClick={this.generateNewJokes}
					disabled={allAreLocked}
				>
					Get New Jokes
				</button>

				{sorted.map((j) => (
					<Joke
						text={j.joke}
						key={j.id}
						id={j.id}
						votes={j.votes}
						vote={this.vote}
						isLocked={j.isLocked}
						toggleLock={this.toggleLock}
					/>
				))}
				{sorted.length < this.props.numJokesToGet ? (
					<div className="JokeList-spinner">
						<i className="fas fa-4x fa-spinner fa-spin" />
					</div>
				) : null}
			</div>
		);
	}
}

export default JokeList;
