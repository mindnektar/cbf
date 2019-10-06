import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    state = {
        error: null,
    }

    componentDidCatch(error, info) {
        this.setState({
            error: {
                message: error.toString(),
                stackTrace: info.componentStack,
            },
        });
    }

    selectAll = (event) => {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNode(event.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    goHome = () => {
        this.props.history.push('/');
        window.location.reload();
    }

    render() {
        if (this.state.error) {
            return (
                <div className="cbf-global-error">
                    <div className="cbf-global-error__note">
                        An error occurred. Please report the error message to mindnektar until he
                        has set up automated error tracking. Reload or&nbsp;
                        <span onClick={this.goHome}>go back to the homepage</span>
                        &nbsp;to try again.
                    </div>

                    <pre
                        className="cbf-global-error__stack-trace"
                        onClick={this.selectAll}
                    >
                        Path:&nbsp;
                        {this.props.history.location.pathname}
                        <br />
                        Message:&nbsp;&quot;
                        {this.state.error.message}
                        &quot;
                        <br />
                        Stack trace:&nbsp;
                        {this.state.error.stackTrace}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ErrorBoundary);
