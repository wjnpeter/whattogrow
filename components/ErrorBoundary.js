import React from 'react';
import BrokenImage from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      return <BrokenImage />
        // <div>
        //   <h2>Something went wrong.</h2>
        //   <details style={{ whiteSpace: 'pre-wrap' }}>
        //     {this.state.error && this.state.error.toString()}
        //     <br />
        //     {this.state.errorInfo.componentStack}
        //   </details>
        // </div>
    }
    
    return this.props.children;
  }  
}

export default ErrorBoundary