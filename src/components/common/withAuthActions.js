import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated } from 'state/rootReducer';
import * as authActions from 'state/actions/authActions';
import LoginModal from './LoginModal';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAuthActions(WrappedComponent) {
  const mapStateToProps = state => ({
    authenticated: getIsAuthenticated(state),
  });

  const mapDispatchToProps = dispatch => ({
    authenticateUser: payload => dispatch(authActions.authenticateUser.action(payload)),
    authenticateUserError: error => dispatch(authActions.authenticateUser.fail(error)),
  });

  class Wrapper extends React.Component {
    static propTypes = {
      authenticated: PropTypes.bool,
      authenticateUser: PropTypes.func.isRequired,
      authenticateUserError: PropTypes.func.isRequired,
    };

    static defaultProps = {
      authenticated: false,
    };

    constructor(props) {
      super(props);
      this.state = {
        displayLoginModal: false,
      };

      this.handleActionInit = this.handleActionInit.bind(this);
      this.displayLoginModal = this.displayLoginModal.bind(this);
      this.hideLoginModal = this.hideLoginModal.bind(this);
    }

    displayLoginModal() {
      this.setState({
        displayLoginModal: true,
      });
    }

    hideLoginModal() {
      this.setState({
        displayLoginModal: false,
      });
    }

    handleActionInit(callback) {
      if (this.props.authenticated) {
        callback();
      } else {
        this.displayLoginModal();
      }
    }

    render() {
      const { displayLoginModal } = this.state;
      return (
        <View>
          {displayLoginModal && (
            <LoginModal
              visible={this.state.displayLoginModal}
              handleLoginModalCancel={this.hideLoginModal}
              authenticateUser={this.props.authenticateUser}
              authenticateUserError={this.props.authenticateUserError}
            />
          )}
          <WrappedComponent onActionInitiated={this.handleActionInit} {...this.props} />
        </View>
      );
    }
  }

  Wrapper.displayName = `withAuthActions(${getDisplayName(WrappedComponent)})`;

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
}
