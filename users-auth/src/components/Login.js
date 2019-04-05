import React from 'react';

class Login extends React.Component {
    state = {
        username: '',
        password: '',
    };

    render() {
        return (
            <div className="login-form">
            <form>
                <input 
                    type='text' 
                      name='username'
                    value={this.state.username}
                    onChange={this.handleChange}
                />

                <input 
                    type='text' 
                    name='password'
                    value={this.state.password}
                    onChange={this.handleChange}
                />
            </form>
            </ div>
        )
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }
};

export default Login;