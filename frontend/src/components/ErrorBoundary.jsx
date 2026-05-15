import { Component } from "react";

// Catches rendering errors so a single failing component does not blank the
// whole dashboard.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: "" };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error?.message ?? "Unknown error" };
    }

    componentDidCatch(error, info) {
        console.error("Dashboard error:", error, info);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="hero">
                    <h1>Something went wrong</h1>
                    <p>{this.state.message}</p>
                    <button className="btn btn-primary" onClick={this.handleReload}>
                        Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
