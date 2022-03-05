import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
// import tokenThunk from '../redux/actions';
import { fetchQuestionsAPI } from '../services';
import Question from '../components/Questions';
import tokenThunk from '../redux/actions';

export class Game extends Component {
  constructor() {
    super();

    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    this.generateToken();
  }

  async generateToken() {
    const { token, fetchToken } = this.props;

    const RESPONSE_CODE_THREE = 3;
    const questions = await fetchQuestionsAPI(token);

    this.setState({
      results: questions.results,
    });

    if (questions.response_code === RESPONSE_CODE_THREE) {
      fetchToken().then(async () => {
        const { token: newToken } = this.props;
        const newQuestions = await fetchQuestionsAPI(newToken);
        this.setState({
          results: newQuestions.results,
        });
      });
    }
  }

  render() {
    const { results } = this.state;
    // const { question, category, correct_answer } = results[0];

    return (
      <section>
        <Header />
        <main>
          {results.map((item, index) => (
            <span key={ index }>{ console.log(item)}</span>
          ))}
          {/* <Question correct_answer={ results } /> */}
        </main>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('state', state);
  return { token: state.token };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: () => dispatch(tokenThunk()),
});

Game.propTypes = {
  tokenThunks: PropTypes.func,
}.isRequire;

export default connect(mapStateToProps, mapDispatchToProps)(Game);
